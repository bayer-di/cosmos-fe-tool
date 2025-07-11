import { createWithValid, createValidatedRequest, validateRequest } from '../src/rest/createWithValid'

// 示例 1: 基本使用
async function basicExample() {
  console.log('=== 基本使用示例 ===')
  
  const signConfig = {
    secretKey: 'your-secret-key-123',
    timestampField: 'timestamp',
    signField: 'sign',
    expireTime: 300000, // 5分钟
    useHeader: false,
    algorithm: 'md5'
  }

  // 创建带验签的 axios 实例
  const api = createWithValid(
    { baseURL: 'https://api.example.com' },
    signConfig
  )

  try {
    // POST 请求会自动添加时间戳和签名
    const response = await api.post('/users', {
      name: '张三',
      age: 25,
      email: 'zhangsan@example.com'
    })
    
    console.log('请求成功:', response.data)
  } catch (error) {
    console.log('请求失败:', error.message)
  }
}

// 示例 2: 使用便捷的请求函数
async function convenientExample() {
  console.log('\n=== 便捷请求函数示例 ===')
  
  const signConfig = {
    secretKey: 'your-secret-key-456',
    algorithm: 'sha256' // 使用 SHA256 算法
  }

  const api = createValidatedRequest('https://api.example.com', signConfig)

  try {
    // GET 请求
    const users = await api.get('/users', {
      params: { page: 1, size: 10 }
    })
    console.log('获取用户列表成功:', users.data)

    // POST 请求
    const newUser = await api.post('/users', {
      name: '李四',
      email: 'lisi@example.com'
    })
    console.log('创建用户成功:', newUser.data)

  } catch (error) {
    console.log('请求失败:', error.message)
  }
}

// 示例 3: 独立验证签名
function validationExample() {
  console.log('\n=== 签名验证示例 ===')
  
  const signConfig = {
    secretKey: 'your-secret-key-789',
    algorithm: 'md5'
  }

  // 模拟接收到的请求参数
  const params = {
    name: '王五',
    age: 30,
    timestamp: Date.now(),
    sign: 'invalid-signature' // 这是一个无效的签名
  }

  const result = validateRequest(params, signConfig)
  
  if (result.isValid) {
    console.log('✅ 签名验证通过')
  } else {
    console.log('❌ 签名验证失败:', result.error)
  }
}

// 示例 4: 请求头签名
async function headerSignExample() {
  console.log('\n=== 请求头签名示例 ===')
  
  const signConfig = {
    secretKey: 'your-secret-key-header',
    useHeader: true, // 在请求头中添加签名
    algorithm: 'sha1'
  }

  const api = createWithValid(
    { baseURL: 'https://api.example.com' },
    signConfig
  )

  try {
    const response = await api.post('/secure-endpoint', {
      sensitiveData: 'confidential'
    })
    
    console.log('安全请求成功:', response.data)
  } catch (error) {
    console.log('安全请求失败:', error.message)
  }
}

// 示例 5: 跳过签名
async function skipSignExample() {
  console.log('\n=== 跳过签名示例 ===')
  
  const signConfig = {
    secretKey: 'your-secret-key',
    algorithm: 'md5'
  }

  const api = createWithValid(
    { baseURL: 'https://api.example.com' },
    signConfig
  )

  try {
    // 跳过签名验证的请求
    const response = await api.post('/public/health', {}, {
      skipSign: true
    })
    
    console.log('公共接口请求成功:', response.data)
  } catch (error) {
    console.log('公共接口请求失败:', error.message)
  }
}

// 运行所有示例
async function runExamples() {
  try {
    await basicExample()
    await convenientExample()
    validationExample()
    await headerSignExample()
    await skipSignExample()
  } catch (error) {
    console.log('示例运行出错:', error.message)
  }
}

// 如果直接运行此文件，则执行示例
if (require.main === module) {
  runExamples()
}

export {
  basicExample,
  convenientExample,
  validationExample,
  headerSignExample,
  skipSignExample
} 