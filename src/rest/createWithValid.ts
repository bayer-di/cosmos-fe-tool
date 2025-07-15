import axios from 'axios'
import { Md5 } from 'ts-md5'

import { requestErrorInterceptor } from './error'

interface CreateWithValidOptions {
  apiPrefix: string
  accessKey: 'pms' | 'app' | 'nrx'
}

const getAccessTokenParams = () => ({
  'X-Random': Math.round(Math.random() * 100),
  'X-Timestamp': new Date().getTime(),
})

const AccessParams = {
  'pms': 'uBZLIxWWSKkBTweErvjXo73kQKusFatz',
  'app': 'KLxLB4SSS9VdpWmE',
  'nrx': 'VGX7IQIZhw5aCiw7GFJhvTgMXw',
}

export const createWithValid = (options: CreateWithValidOptions) => {
  const { apiPrefix, accessKey = 'pms' } = options

  const accessSecret = AccessParams[accessKey]
  
  const request = axios.create({ baseURL: apiPrefix })

  request.interceptors.request.use((config) => {
    const params = getAccessTokenParams()
    const token = `X-Access-Key=${accessKey}&X-Access-Secret=${accessSecret}&X-Random=${
      params['X-Random']
    }&X-Timestamp=${
      params['X-Timestamp']
    }`
    config.headers = {
      ...config.headers,
      'X-Access-Token': Md5.hashStr(token),
      'X-Access-Key': accessKey,
      ...params,
    } as any
    return config
  })

  request.interceptors.response.use(
    (res) => requestErrorInterceptor({ response: res }),
    (error) => requestErrorInterceptor(error) as any
  )

  request.interceptors.response.use((response) => {
    return Promise.resolve(response.data)
  })

  return request
}
