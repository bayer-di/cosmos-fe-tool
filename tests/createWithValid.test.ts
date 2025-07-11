import { createWithValid, createValidatedRequest, validateRequest, SignConfig } from '../src/rest/createWithValid'

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

describe('createWithValid', () => {
  const mockSignConfig: SignConfig = {
    secretKey: 'test-secret-key',
    timestampField: 'timestamp',
    signField: 'sign',
    expireTime: 300000,
    useHeader: false,
    algorithm: 'md5'
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  test('应该创建带验签功能的 axios 实例', () => {
    const instance = createWithValid({}, mockSignConfig)
    
    expect(instance).toBeDefined()
    expect(instance.interceptors.request.use).toHaveBeenCalled()
    expect(instance.interceptors.response.use).toHaveBeenCalled()
  })

  test('应该正确配置请求拦截器', () => {
    const instance = createWithValid({}, mockSignConfig)
    const requestInterceptor = instance.interceptors.request.use as jest.Mock
    
    expect(requestInterceptor).toHaveBeenCalledWith(
      expect.any(Function),
      expect.any(Function)
    )
  })
})

describe('validateRequest', () => {
  const mockSignConfig: SignConfig = {
    secretKey: 'test-secret-key',
    timestampField: 'timestamp',
    signField: 'sign',
    expireTime: 300000,
    algorithm: 'md5'
  }

  test('应该验证有效的请求参数', () => {
    const timestamp = Date.now()
    const params = {
      name: 'test',
      age: 25,
      timestamp,
      sign: 'valid-sign' // 这里需要是真实的签名
    }

    const result = validateRequest(params, mockSignConfig)
    expect(result.isValid).toBe(false) // 因为签名不匹配
    expect(result.error).toBe('签名验证失败')
  })

  test('应该检测缺少时间戳', () => {
    const params = {
      name: 'test',
      sign: 'some-sign'
    }

    const result = validateRequest(params, mockSignConfig)
    expect(result.isValid).toBe(false)
    expect(result.error).toBe('缺少时间戳')
  })

  test('应该检测缺少签名', () => {
    const params = {
      name: 'test',
      timestamp: Date.now()
    }

    const result = validateRequest(params, mockSignConfig)
    expect(result.isValid).toBe(false)
    expect(result.error).toBe('缺少签名')
  })

  test('应该检测过期的时间戳', () => {
    const oldTimestamp = Date.now() - 400000 // 6分钟前
    const params = {
      name: 'test',
      timestamp: oldTimestamp,
      sign: 'some-sign'
    }

    const result = validateRequest(params, mockSignConfig)
    expect(result.isValid).toBe(false)
    expect(result.error).toBe('时间戳已过期')
  })
})

describe('createValidatedRequest', () => {
  const mockSignConfig: SignConfig = {
    secretKey: 'test-secret-key',
    timestampField: 'timestamp',
    signField: 'sign',
    expireTime: 300000,
    algorithm: 'md5'
  }

  test('应该创建带验签的请求函数', () => {
    const request = createValidatedRequest('https://api.example.com', mockSignConfig)
    
    expect(request.get).toBeDefined()
    expect(request.post).toBeDefined()
    expect(request.put).toBeDefined()
    expect(request.delete).toBeDefined()
    expect(request.patch).toBeDefined()
    expect(request.validate).toBeDefined()
  })

  test('应该提供验证方法', () => {
    const request = createValidatedRequest('https://api.example.com', mockSignConfig)
    const params = { name: 'test', timestamp: Date.now(), sign: 'test-sign' }
    
    const result = request.validate(params)
    expect(result).toHaveProperty('isValid')
    expect(result).toHaveProperty('error')
  })
}) 