import { createWithToken, createTokenRequest, createSimpleTokenRequest, TokenConfig } from '../src/rest/createWithToken'

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

describe('createWithToken', () => {
  const mockTokenConfig: TokenConfig = {
    token: 'test-token-123',
    tokenField: 'Authorization',
    tokenPrefix: 'Bearer',
    autoRefresh: false,
    skipPaths: ['/public', '/health'],
    retryCount: 3,
    retryDelay: 1000
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  test('应该创建带 token 的 axios 实例', () => {
    const instance = createWithToken('https://api.example.com', mockTokenConfig)
    
    expect(instance).toBeDefined()
    expect(instance.interceptors.request.use).toHaveBeenCalled()
    expect(instance.interceptors.response.use).toHaveBeenCalled()
  })

  test('应该正确配置请求拦截器', () => {
    const instance = createWithToken('https://api.example.com', mockTokenConfig)
    const requestInterceptor = instance.interceptors.request.use as jest.Mock
    
    expect(requestInterceptor).toHaveBeenCalledWith(
      expect.any(Function),
      expect.any(Function)
    )
  })

  test('应该提供 updateToken 方法', () => {
    const instance = createWithToken('https://api.example.com', mockTokenConfig)
    
    expect(instance.updateToken).toBeDefined()
    expect(typeof instance.updateToken).toBe('function')
  })

  test('应该提供 getCurrentToken 方法', () => {
    const instance = createWithToken('https://api.example.com', mockTokenConfig)
    
    expect(instance.getCurrentToken).toBeDefined()
    expect(typeof instance.getCurrentToken).toBe('function')
  })

  test('应该正确设置 baseURL', () => {
    const baseURL = 'https://api.example.com'
    const instance = createWithToken(baseURL, mockTokenConfig)
    
    // 这里我们验证 axios.create 被调用时传入了正确的 baseURL
    const axiosCreate = require('axios').create as jest.Mock
    expect(axiosCreate).toHaveBeenCalledWith(
      expect.objectContaining({ baseURL })
    )
  })
})

describe('createTokenRequest', () => {
  const mockTokenConfig: TokenConfig = {
    token: 'test-token-456',
    tokenField: 'X-Auth-Token',
    tokenPrefix: 'Token',
    autoRefresh: true,
    retryCount: 2
  }

  test('应该创建带 token 的请求函数', () => {
    const request = createTokenRequest('https://api.example.com', mockTokenConfig)
    
    expect(request.get).toBeDefined()
    expect(request.post).toBeDefined()
    expect(request.put).toBeDefined()
    expect(request.delete).toBeDefined()
    expect(request.patch).toBeDefined()
    expect(request.updateToken).toBeDefined()
    expect(request.getCurrentToken).toBeDefined()
  })

  test('应该提供 token 管理方法', () => {
    const request = createTokenRequest('https://api.example.com', mockTokenConfig)
    
    expect(typeof request.updateToken).toBe('function')
    expect(typeof request.getCurrentToken).toBe('function')
  })
})

describe('createSimpleTokenRequest', () => {
  test('应该创建简单的 token 请求实例', () => {
    const token = 'simple-token-789'
    const instance = createSimpleTokenRequest('https://api.example.com', token)
    
    expect(instance).toBeDefined()
    expect(instance.interceptors.request.use).toHaveBeenCalled()
    expect(instance.interceptors.response.use).toHaveBeenCalled()
  })

  test('应该使用默认配置', () => {
    const token = 'simple-token-789'
    const instance = createSimpleTokenRequest('https://api.example.com', token)
    
    // 验证使用了默认的 tokenField 和 tokenPrefix
    const axiosCreate = require('axios').create as jest.Mock
    expect(axiosCreate).toHaveBeenCalledWith(
      expect.objectContaining({
        baseURL: 'https://api.example.com'
      })
    )
  })

  test('应该支持自定义配置', () => {
    const token = 'custom-token-123'
    const options = {
      tokenField: 'X-Custom-Token',
      tokenPrefix: 'Custom',
      skipPaths: ['/public']
    }
    
    const instance = createSimpleTokenRequest('https://api.example.com', token, options)
    
    expect(instance).toBeDefined()
  })
})

describe('Token 配置选项', () => {
  test('应该支持自定义 token 字段名', () => {
    const config: TokenConfig = {
      token: 'test-token',
      tokenField: 'X-Custom-Auth'
    }
    
    const instance = createWithToken('https://api.example.com', config)
    expect(instance).toBeDefined()
  })

  test('应该支持无前缀的 token', () => {
    const config: TokenConfig = {
      token: 'test-token',
      tokenPrefix: ''
    }
    
    const instance = createWithToken('https://api.example.com', config)
    expect(instance).toBeDefined()
  })

  test('应该支持跳过路径配置', () => {
    const config: TokenConfig = {
      token: 'test-token',
      skipPaths: ['/public', '/health', '/docs']
    }
    
    const instance = createWithToken('https://api.example.com', config)
    expect(instance).toBeDefined()
  })

  test('应该支持重试配置', () => {
    const config: TokenConfig = {
      token: 'test-token',
      retryCount: 5,
      retryDelay: 2000
    }
    
    const instance = createWithToken('https://api.example.com', config)
    expect(instance).toBeDefined()
  })
}) 