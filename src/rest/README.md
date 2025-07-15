# createWithValid 工具函数

这是一个用于创建带有访问令牌验证的 axios 实例的工具函数。

## 功能特性

- 自动生成访问令牌
- 支持自定义 API 前缀
- 支持自定义访问密钥和密钥
- 自动添加请求拦截器处理认证
- 自动添加响应拦截器处理错误

## 使用方法

### 基本用法

```typescript
import { createWithValid } from 'cosmos-fe-tool';

const apiClient = createWithValid({
  apiPrefix: 'https://api.example.com',
  accessKey: 'your-access-key',
});

// 使用客户端发送请求
const response = await apiClient.get('/users');
```

### 多环境配置

```typescript
import { createWithValid } from 'cosmos-fe-tool';

// 生产环境
const productionClient = createWithValid({
  apiPrefix: 'https://api.production.com',
  accessKey: 'pms',
});

// 测试环境
const stagingClient = createWithValid({
  apiPrefix: 'https://api.staging.com',
  accessKey: 'pms',
});
```

## 参数说明

### CreateWithValidOptions

| 参数      | 类型        | 必填 | 说明          |
| --------- | ----------- | ---- | ------------- |
| apiPrefix | string      | 是   | API 基础 URL  |
| accessKey | 'pms','app' | 是   | 访问密钥 类型 |

## 工作原理

1. **令牌生成**: 自动生成包含 `X-Access-Key`、`X-Access-Secret`、`X-Random` 和 `X-Timestamp` 的令牌字符串
2. **MD5 加密**: 使用 MD5 算法对令牌字符串进行加密
3. **请求头设置**: 自动在请求头中添加以下字段：
   - `X-Access-Token`: MD5 加密后的令牌
   - `X-Access-Key`: 访问密钥
   - `X-Random`: 随机数
   - `X-Timestamp`: 时间戳
4. **响应处理**: 自动处理响应数据和错误

## 示例

```typescript
import { createWithValid } from 'cosmos-fe-tool';

const apiClient = createWithValid({
  apiPrefix: 'https://api.example.com',
  accessKey: 'pms',
});

// GET 请求
const users = await apiClient.get('/users');

// POST 请求
const newUser = await apiClient.post('/users', {
  name: '张三',
  email: 'zhangsan@example.com',
});

// PUT 请求
const updatedUser = await apiClient.put('/users/1', {
  name: '李四',
});

// DELETE 请求
await apiClient.delete('/users/1');
```

## 注意事项

- 确保提供的 `accessKey` 和 `accessSecret` 与服务器端配置一致
- 时间戳使用毫秒级时间戳
- 随机数范围是 0-100
- 所有请求都会自动添加认证信息
