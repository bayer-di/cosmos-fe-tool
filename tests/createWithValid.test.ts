import { createWithValid } from '../src/rest/createWithValid'

// Mock axios
jest.mock('axios', () => ({
  create: jest.fn(() => ({
    interceptors: {
      request: {
        use: jest.fn()
      },
      response: {
        use: jest.fn()
      }
    },
    get: jest.fn(),
    post: jest.fn(),
    put: jest.fn(),
    delete: jest.fn(),
    patch: jest.fn()
  }))
}))

// Mock ts-md5
jest.mock('ts-md5', () => ({
  Md5: {
    hashStr: jest.fn(() => 'mocked-hash')
  }
}))

// Mock error interceptor
jest.mock('../src/rest/error', () => ({
  requestErrorInterceptor: jest.fn((error) => error)
}))

describe('createWithValid', () => {
  const mockOptions = {
    apiPrefix: 'https://api.example.com',
    accessKey: 'pms' as const
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('基础功能测试', () => {
    test('应该创建带验签功能的 axios 实例', () => {
      const instance = createWithValid(mockOptions)
      
      expect(instance).toBeDefined()
      expect(instance.interceptors.request.use).toHaveBeenCalled()
      expect(instance.interceptors.response.use).toHaveBeenCalledTimes(2)
    })

    test('应该正确配置请求拦截器', () => {
      const instance = createWithValid(mockOptions)
      const requestInterceptor = instance.interceptors.request.use as jest.Mock
      
      expect(requestInterceptor).toHaveBeenCalledWith(
        expect.any(Function)
      )
    })

    test('应该正确配置响应拦截器', () => {
      const instance = createWithValid(mockOptions)
      const responseInterceptor = instance.interceptors.response.use as jest.Mock
      
      expect(responseInterceptor).toHaveBeenCalledTimes(2)
    })

    test('应该使用正确的 API 前缀', () => {
      const axios = require('axios')
      const mockAxiosCreate = axios.create as jest.Mock
      
      createWithValid(mockOptions)
      
      expect(mockAxiosCreate).toHaveBeenCalledWith({
        baseURL: mockOptions.apiPrefix
      })
    })
  })

  describe('accessKey 配置测试', () => {
    test('应该使用默认的 pms accessKey', () => {
      const instance = createWithValid({ 
        apiPrefix: 'https://api.example.com'
      })
      
      expect(instance).toBeDefined()
    })

    test('应该支持 pms accessKey', () => {
      const instance = createWithValid({ 
        apiPrefix: 'https://api.example.com',
        accessKey: 'pms'
      })
      
      expect(instance).toBeDefined()
    })

    test('应该支持 app accessKey', () => {
      const instance = createWithValid({ 
        apiPrefix: 'https://api.example.com', 
        accessKey: 'app'
      })
      
      expect(instance).toBeDefined()
    })

    test('应该支持 nrx accessKey', () => {
      const instance = createWithValid({ 
        apiPrefix: 'https://api.example.com', 
        accessKey: 'nrx'
      })
      
      expect(instance).toBeDefined()
    })
  })

  describe('请求拦截器功能测试', () => {
    test('应该正确设置请求头', () => {
      const instance = createWithValid(mockOptions)
      const requestInterceptor = instance.interceptors.request.use as jest.Mock
      const requestHandler = requestInterceptor.mock.calls[0][0]
      
      const mockConfig = {
        headers: {}
      }
      
      const result = requestHandler(mockConfig)
      
      expect(result.headers).toHaveProperty('X-Access-Token')
      expect(result.headers).toHaveProperty('X-Access-Key')
      expect(result.headers).toHaveProperty('X-Random')
      expect(result.headers).toHaveProperty('X-Timestamp')
      expect(result.headers['X-Access-Token']).toBe('mocked-hash')
      expect(result.headers['X-Access-Key']).toBe('pms')
    })

    test('应该保持原有请求头', () => {
      const instance = createWithValid(mockOptions)
      const requestInterceptor = instance.interceptors.request.use as jest.Mock
      const requestHandler = requestInterceptor.mock.calls[0][0]
      
      const mockConfig = {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer token'
        }
      }
      
      const result = requestHandler(mockConfig)
      
      expect(result.headers['Content-Type']).toBe('application/json')
      expect(result.headers['Authorization']).toBe('Bearer token')
    })

    test('应该为不同 accessKey 设置不同的密钥', () => {
      const pmsInstance = createWithValid({ 
        apiPrefix: 'https://api.example.com',
        accessKey: 'pms'
      })
      const appInstance = createWithValid({ 
        apiPrefix: 'https://api.example.com',
        accessKey: 'app'
      })
      
      const pmsRequestInterceptor = pmsInstance.interceptors.request.use as jest.Mock
      const appRequestInterceptor = appInstance.interceptors.request.use as jest.Mock
      
      const pmsHandler = pmsRequestInterceptor.mock.calls[0][0]
      const appHandler = appRequestInterceptor.mock.calls[0][0]
      
      const mockConfig1 = { headers: {} }
      const mockConfig2 = { headers: {} }
      
      const pmsResult = pmsHandler(mockConfig1)
      const appResult = appHandler(mockConfig2)
      
      expect(pmsResult.headers['X-Access-Key']).toBe('pms')
      expect(appResult.headers['X-Access-Key']).toBe('app')
    })
  })

  describe('响应拦截器功能测试', () => {
    test('应该调用错误拦截器', () => {
      const { requestErrorInterceptor } = require('../src/rest/error')
      const instance = createWithValid(mockOptions)
      const responseInterceptor = instance.interceptors.response.use as jest.Mock
      
      // 第一个响应拦截器（错误处理）
      const errorHandler = responseInterceptor.mock.calls[0][0]
      const errorRejectHandler = responseInterceptor.mock.calls[0][1]
      
      expect(requestErrorInterceptor).toHaveBeenCalledTimes(0)
      
      // 模拟成功响应
      const mockResponse = { data: 'success' }
      errorHandler(mockResponse)
      
      expect(requestErrorInterceptor).toHaveBeenCalledWith({ response: mockResponse })
    })

    test('应该处理响应数据', () => {
      const instance = createWithValid(mockOptions)
      const responseInterceptor = instance.interceptors.response.use as jest.Mock
      
      // 第二个响应拦截器（数据处理）
      const dataHandler = responseInterceptor.mock.calls[1][0]
      
      const mockResponse = { data: 'success' }
      const result = dataHandler(mockResponse)
      
      expect(result).resolves.toBe('success')
    })
  })

  describe('边界情况测试', () => {
    test('应该处理空的 apiPrefix', () => {
      const instance = createWithValid({ 
        apiPrefix: '',
        accessKey: 'pms'
      })
      
      expect(instance).toBeDefined()
    })

    test('应该处理复杂的 apiPrefix', () => {
      const instance = createWithValid({ 
        apiPrefix: 'https://api.example.com/v1/api',
        accessKey: 'pms'
      })
      
      expect(instance).toBeDefined()
    })
  })

  describe('实际使用场景测试', () => {
    test('模拟 API 调用场景', () => {
      const instance = createWithValid({
        apiPrefix: 'https://api.example.com',
        accessKey: 'pms'
      })
      
      expect(instance.get).toBeDefined()
      expect(instance.post).toBeDefined()
      expect(instance.put).toBeDefined()
      expect(instance.delete).toBeDefined()
      expect(instance.patch).toBeDefined()
    })

    test('模拟不同环境的配置', () => {
      const devInstance = createWithValid({
        apiPrefix: 'https://dev-api.example.com',
        accessKey: 'pms'
      })
      
      const prodInstance = createWithValid({
        apiPrefix: 'https://api.example.com',
        accessKey: 'app'
      })
      
      expect(devInstance).toBeDefined()
      expect(prodInstance).toBeDefined()
    })
  })
}) 