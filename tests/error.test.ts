import {
  ServerError,
  NetworkError,
  TimeoutError,
  UnAuthorizedError,
  FetchError,
  parseMessage,
  requestErrorInterceptor,
  RequestErrors,
  UNAUTHORIZED_ERROR,
  SERVER_SUCCESS_CODE_NEW,
  SERVER_SUCCESS_CODE
} from '../src/rest/error'

describe('自定义错误类', () => {
  test('ServerError', () => {
    const err = new ServerError(undefined, '服务器错误')
    expect(err).toBeInstanceOf(Error)
    expect(err.name).toBe(RequestErrors.SERVER)
    expect(err.message).toBe('服务器错误')
  })

  test('NetworkError', () => {
    const err = new NetworkError('网络异常')
    expect(err).toBeInstanceOf(Error)
    expect(err.name).toBe(RequestErrors.NETWORK)
    expect(err.message).toBe('网络异常')
  })

  test('TimeoutError', () => {
    const err = new TimeoutError('超时')
    expect(err).toBeInstanceOf(Error)
    expect(err.name).toBe(RequestErrors.TIMEOUT)
    expect(err.message).toBe('超时')
  })

  test('UnAuthorizedError', () => {
    const err = new UnAuthorizedError('未认证')
    expect(err).toBeInstanceOf(Error)
    expect(err.name).toBe(RequestErrors.UNAUTHORIZED)
    expect(err.message).toBe('未认证')
  })

  test('FetchError', () => {
    const err = new FetchError({ statusText: 'Not Found', url: '/api' }, '请求失败')
    expect(err).toBeInstanceOf(Error)
    expect(err.name).toBe(RequestErrors.FETCH)
    expect(err.message).toBe('Not Found')
  })
})

describe('parseMessage', () => {
  test('Error 实例', () => {
    const err = new Error('错误信息')
    expect(parseMessage(err)).toBe('错误信息')
  })

  test('ServerError', () => {
    const err = { error: new ServerError(undefined, '服务器错误') }
    expect(parseMessage(err)).toBe('服务器错误')
  })

  test('UnAuthorizedError', () => {
    const err = { error: new UnAuthorizedError('未认证') }
    expect(parseMessage(err)).toBe('未认证')
  })

  test('FetchError', () => {
    const err = { error: new FetchError({ statusText: 'Not Found' }, '请求失败') }
    expect(parseMessage(err)).toBe('Not Found')
  })

  test('TimeoutError', () => {
    const err = { error: new TimeoutError('超时') }
    expect(parseMessage(err)).toBe('超时')
  })

  test('NetworkError', () => {
    const err = { error: new NetworkError('网络异常') }
    expect(parseMessage(err)).toBe('网络异常')
  })

  test('未知类型', () => {
    expect(parseMessage({})).toBe('系统错误，请重试')
  })
})

describe('requestErrorInterceptor', () => {
  test('无 response 且 message 包含 timeout', async () => {
    await expect(requestErrorInterceptor({ message: 'timeout of 1000ms exceeded' })).rejects.toMatchObject({
      error: expect.any(TimeoutError)
    })
  })

  test('无 response 且 message 包含 Network', async () => {
    await expect(requestErrorInterceptor({ message: 'Network Error' })).rejects.toMatchObject({
      error: expect.any(NetworkError)
    })
  })

  test('无 response 且 message 其他', async () => {
    await expect(requestErrorInterceptor({ message: '其他错误' })).resolves.toBeUndefined()
  })

  test('404 错误', async () => {
    const response = {
      status: 404,
      request: { responseURL: '/api/test' },
      data: {},
      headers: { get: () => 'application/json' }
    }
    await expect(requestErrorInterceptor({ response })).rejects.toMatchObject({
      error: expect.any(FetchError)
    })
  })

  test('非 JSON 响应', async () => {
    const response = {
      status: 200,
      headers: { get: () => 'text/html' },
      data: {}
    }
    await expect(requestErrorInterceptor({ response })).resolves.toBe(response)
  })

  test('鉴权失败', async () => {
    const response = {
      status: UNAUTHORIZED_ERROR,
      headers: { get: () => 'application/json' },
      data: { code: UNAUTHORIZED_ERROR }
    }
    await expect(requestErrorInterceptor({ response })).rejects.toMatchObject({
      error: expect.any(UnAuthorizedError)
    })
  })

  test('客户端报错', async () => {
    const response = {
      status: 500,
      headers: { get: () => 'application/json' },
      data: { code: 999 }
    }
    await expect(requestErrorInterceptor({ response })).rejects.toMatchObject({
      error: expect.any(FetchError)
    })
  })

  test('业务 code 成功', async () => {
    const response = {
      status: 200,
      headers: { get: () => 'application/json' },
      data: { code: SERVER_SUCCESS_CODE_NEW }
    }
    await expect(requestErrorInterceptor({ response })).resolves.toBe(response)
  })

  test('兼容老接口 code 200', async () => {
    const response = {
      status: 200,
      headers: { get: () => 'application/json' },
      data: { code: SERVER_SUCCESS_CODE }
    }
    await expect(requestErrorInterceptor({ response })).resolves.toBe(response)
  })

  test('服务端异常', async () => {
    const response = {
      status: 200,
      headers: { get: () => 'application/json' },
      data: { code: 123, msg: '服务端异常' }
    }
    await expect(requestErrorInterceptor({ response })).rejects.toMatchObject({
      error: expect.any(ServerError)
    })
  })
}) 