import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse, InternalAxiosRequestConfig } from 'axios'
import crypto from 'crypto'

export interface SignConfig {
  /** 签名密钥 */
  secretKey: string
  /** 时间戳字段名，默认为 timestamp */
  timestampField?: string
  /** 签名字段名，默认为 sign */
  signField?: string
  /** 时间戳有效期（毫秒），默认为 5 分钟 */
  expireTime?: number
  /** 是否在请求头中添加签名，默认为 false（在请求体中添加） */
  useHeader?: boolean
  /** 自定义签名算法，默认为 MD5 */
  algorithm?: 'md5' | 'sha1' | 'sha256'
}

export interface ValidatedRequestConfig extends AxiosRequestConfig {
  /** 验签配置 */
  signConfig?: SignConfig
  /** 是否跳过验签，默认为 false */
  skipSign?: boolean
}

/**
 * 生成签名
 * @param params 请求参数
 * @param secretKey 密钥
 * @param algorithm 签名算法
 * @returns 签名字符串
 */
function generateSign(params: Record<string, any>, secretKey: string, algorithm: string = 'md5'): string {
  // 过滤空值和签名相关字段
  const filteredParams = Object.keys(params)
    .filter(key => {
      const value = params[key]
      return value !== null && value !== undefined && value !== '' && 
             !['sign', 'timestamp'].includes(key)
    })
    .reduce((acc, key) => {
      acc[key] = params[key]
      return acc
    }, {} as Record<string, any>)

  // 按键名排序
  const sortedKeys = Object.keys(filteredParams).sort()
  
  // 构建签名字符串
  const signString = sortedKeys
    .map(key => `${key}=${filteredParams[key]}`)
    .join('&') + `&key=${secretKey}`

  // 根据算法生成签名
  switch (algorithm.toLowerCase()) {
    case 'sha1':
      return crypto.createHash('sha1').update(signString).digest('hex')
    case 'sha256':
      return crypto.createHash('sha256').update(signString).digest('hex')
    case 'md5':
    default:
      return crypto.createHash('md5').update(signString).digest('hex')
  }
}

/**
 * 验证签名
 * @param params 请求参数
 * @param secretKey 密钥
 * @param algorithm 签名算法
 * @returns 验证结果
 */
function verifySign(params: Record<string, any>, secretKey: string, algorithm: string = 'md5'): boolean {
  const receivedSign = params.sign || params.signature
  if (!receivedSign) {
    return false
  }

  const calculatedSign = generateSign(params, secretKey, algorithm)
  return receivedSign.toLowerCase() === calculatedSign.toLowerCase()
}

/**
 * 验证时间戳
 * @param timestamp 时间戳
 * @param expireTime 过期时间（毫秒）
 * @returns 验证结果
 */
function verifyTimestamp(timestamp: number, expireTime: number = 300000): boolean {
  const now = Date.now()
  const diff = Math.abs(now - timestamp)
  return diff <= expireTime
}

/**
 * 创建带验签功能的 axios 实例
 * @param config axios 配置
 * @param signConfig 验签配置
 * @returns axios 实例
 */
export function createWithValid(
  config: AxiosRequestConfig = {},
  signConfig: SignConfig
): AxiosInstance {
  const instance = axios.create(config)
  
  const {
    secretKey,
    timestampField = 'timestamp',
    signField = 'sign',
    useHeader = false,
    algorithm = 'md5'
  } = signConfig

  // 请求拦截器：添加签名
  instance.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
      // 如果跳过签名，直接返回
      if ((config as any).skipSign) {
        return config
      }

      const timestamp = Date.now()
      const signData: Record<string, any> = {
        [timestampField]: timestamp
      }

      // 根据请求方法处理数据
      if (config.method?.toLowerCase() === 'get') {
        // GET 请求：将参数添加到 URL 查询字符串
        const params = config.params || {}
        Object.assign(signData, params)
      } else {
        // POST/PUT 等请求：将参数添加到请求体
        const data = config.data || {}
        Object.assign(signData, data)
      }

      // 生成签名
      const sign = generateSign(signData, secretKey, algorithm)
      signData[signField] = sign

      // 根据配置决定签名位置
      if (useHeader) {
        // 添加到请求头
        config.headers = config.headers || {}
        config.headers[timestampField] = timestamp
        config.headers[signField] = sign
      } else {
        // 添加到请求数据
        if (config.method?.toLowerCase() === 'get') {
          config.params = signData
        } else {
          config.data = signData
        }
      }

      return config
    },
    (error) => {
      return Promise.reject(error)
    }
  )

  // 响应拦截器：验证签名（可选）
  instance.interceptors.response.use(
    (response: AxiosResponse) => {
      // 这里可以添加响应验签逻辑
      // 如果服务端返回的数据包含签名，可以在这里验证
      return response
    },
    (error) => {
      return Promise.reject(error)
    }
  )

  return instance
}

/**
 * 验证请求签名
 * @param params 请求参数
 * @param signConfig 验签配置
 * @returns 验证结果
 */
export function validateRequest(
  params: Record<string, any>,
  signConfig: SignConfig
): { isValid: boolean; error?: string } {
  const {
    secretKey,
    timestampField = 'timestamp',
    signField = 'sign',
    expireTime = 300000,
    algorithm = 'md5'
  } = signConfig

  // 检查必要字段
  const timestamp = params[timestampField]
  const sign = params[signField]

  if (!timestamp) {
    return { isValid: false, error: '缺少时间戳' }
  }

  if (!sign) {
    return { isValid: false, error: '缺少签名' }
  }

  // 验证时间戳
  if (!verifyTimestamp(timestamp, expireTime)) {
    return { isValid: false, error: '时间戳已过期' }
  }

  // 验证签名
  if (!verifySign(params, secretKey, algorithm)) {
    return { isValid: false, error: '签名验证失败' }
  }

  return { isValid: true }
}

/**
 * 创建带验签的请求函数
 * @param baseURL 基础 URL
 * @param signConfig 验签配置
 * @returns 请求函数
 */
export function createValidatedRequest(baseURL: string, signConfig: SignConfig) {
  const instance = createWithValid({ baseURL }, signConfig)
  
  return {
    get: (url: string, config?: ValidatedRequestConfig) => instance.get(url, config),
    post: (url: string, data?: any, config?: ValidatedRequestConfig) => instance.post(url, data, config),
    put: (url: string, data?: any, config?: ValidatedRequestConfig) => instance.put(url, data, config),
    delete: (url: string, config?: ValidatedRequestConfig) => instance.delete(url, config),
    patch: (url: string, data?: any, config?: ValidatedRequestConfig) => instance.patch(url, data, config),
    validate: (params: Record<string, any>) => validateRequest(params, signConfig)
  }
}

export default createWithValid
