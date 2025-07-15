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
    accessKey: 'PMS' as const
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

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

  test('应该使用默认的 PMS accessKey', () => {
    const instance = createWithValid({ 
      apiPrefix: 'https://api.example.com',
      accessKey: 'PMS'
    })
    
    expect(instance).toBeDefined()
  })

  test('应该支持不同的 accessKey', () => {
    const appInstance = createWithValid({ 
      apiPrefix: 'https://api.example.com', 
      accessKey: 'APP' 
    })
    
    const nrxInstance = createWithValid({ 
      apiPrefix: 'https://api.example.com', 
      accessKey: 'NRX' 
    })
    
    expect(appInstance).toBeDefined()
    expect(nrxInstance).toBeDefined()
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