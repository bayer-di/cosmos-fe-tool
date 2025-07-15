// status code
export const SUCCESS_CODE_LOWER_BOUND = 200
export const SUCCESS_CODE_HIGHER_BOUND = 300

// request code
// success code
export const SERVER_SUCCESS_CODE_NEW = 0
// fail code
export const SERVER_FAIL_CODE = 1
// unAuthorize redirect code, fallback with jumpUrl
export const SERVER_REDIRECT_CODE = 2

export const UNAUTHORIZED_ERROR = 401
export const SERVER_SUCCESS_CODE = 200

export enum RequestErrors {
    FETCH = 'FETCH',
    SERVER = 'SERVER',
    TIMEOUT = 'TIMEOUT',
    NETWORK = 'NETWORK',
    UNAUTHORIZED = 'UNAUTHORIZED',
}

/* status >= 500 服务器异常 */
export class ServerError extends Error {
    constructor(response?: any, msg: string = '获取数据失败，请重试') {
        super(response?.msg || msg)
        this.name = RequestErrors.SERVER
    }
}

/* 网络超时 */
export class NetworkError extends Error {
    constructor(msg: string = '网络异常，请检查您的网络') {
        super(msg)
        this.name = RequestErrors.NETWORK
    }
}

/* 服务器超时 */
export class TimeoutError extends Error {
    constructor(msg: string = '网络超时，请检查后重试') {
        super(msg)
        this.name = RequestErrors.TIMEOUT
    }
}

export class UnAuthorizedError extends Error {
    constructor(msg: string = '认证失败，请重新登录') {
        super(msg)
        this.name = RequestErrors.UNAUTHORIZED
    }
}

export class FetchError extends Error {
    constructor(response?: any, msg: string = '请求出错，请重试') {
        // 特殊处理一下接口404的错误信息
        const message =  response?.data?.msg || (response && (response.statusText || `${response.url}: ${response.status}`))
        super(message || msg)
        this.name = RequestErrors.FETCH
    }
}

const rejectCustomizeError = (error: Error, response?: Response) => {
    return Promise.reject({ error, response })
}

export const requestErrorInterceptor = async ({ response, ...rest }: any) => {
    if (!response) {
        const { message } = rest
        // 接口超时
        if (message.indexOf('timeout') > -1) return rejectCustomizeError(new TimeoutError(), rest)
        // 网络异常
        if (message.indexOf('Network') > -1) return rejectCustomizeError(new NetworkError(), rest)
        return
    }
    const { headers, status } = response
    // 接口404
    if (response.status === 404) return rejectCustomizeError(new FetchError({ ...response, url: response.request.responseURL }), rest)
    if (!headers.get('Content-Type')?.includes('application/json')) return response
    const resp: any = response.data
    // 鉴权失败
    if (status === UNAUTHORIZED_ERROR || resp.code === UNAUTHORIZED_ERROR || resp.code === 403) {
        return rejectCustomizeError(new UnAuthorizedError(), rest)
    }
    // 客户端报错
    if (response.status < SUCCESS_CODE_LOWER_BOUND || response.status > SUCCESS_CODE_HIGHER_BOUND)
        return rejectCustomizeError(new FetchError({ ...response, ...rest }))

    // 兼容老接口的业务code === 200
    if (resp.code === SERVER_SUCCESS_CODE_NEW || resp.code === SERVER_SUCCESS_CODE) return response
    return rejectCustomizeError(new ServerError(resp), { ...response, ...rest })
}

export const parseMessage = (e: any) => {
    if (e instanceof Error) {
        return e.message
    }
    const { error } = e
    if (error instanceof ServerError) return error.message
    if (error instanceof UnAuthorizedError) return error.message
    if (error instanceof FetchError) return error.message
    if (error instanceof TimeoutError) return error.message
    if (error instanceof NetworkError) return error.message
    return '系统错误，请重试'
}