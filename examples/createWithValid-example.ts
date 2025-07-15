import { createWithValid } from '../src/rest/createWithValid'

// 使用示例
const apiClient = createWithValid({
  apiPrefix: 'https://api.example.com',
  accessKey: 'your-access-key',
  accessSecret: 'your-access-secret'
})

// 使用创建的客户端发送请求
async function exampleRequest() {
  try {
    const response = await apiClient.get('/users')
    console.log('Response:', response)
  } catch (error) {
    console.error('Error:', error)
  }
}

// 另一个示例：使用不同的配置创建多个客户端
const productionClient = createWithValid({
  apiPrefix: 'https://api.production.com',
  accessKey: 'prod-access-key',
  accessSecret: 'prod-access-secret'
})

const stagingClient = createWithValid({
  apiPrefix: 'https://api.staging.com',
  accessKey: 'staging-access-key',
  accessSecret: 'staging-access-secret'
})

export { apiClient, productionClient, stagingClient, exampleRequest } 