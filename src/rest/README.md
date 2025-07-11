# 验签请求工具

这个模块提供了带验签功能的 axios 请求工具，支持多种签名算法和时间戳验证。

## 功能特性

- 🔐 支持多种签名算法（MD5、SHA1、SHA256）
- ⏰ 自动时间戳生成和验证
- 🛡️ 防重放攻击（时间戳有效期控制）
- 📝 支持请求头和请求体两种签名方式
- 🔄 自动请求拦截器，无需手动添加签名
- ✅ 提供独立的签名验证函数

## 安装依赖

```bash
npm install axios
# 或
yarn add axios
```

## 基本使用

### 1. 创建带验签的 axios 实例

```typescript
import { createWithValid } from '@cosmosfe/tool';

const signConfig = {
  secretKey: 'your-secret-key',
  timestampField: 'timestamp',
  signField: 'sign',
  expireTime: 300000, // 5分钟
  useHeader: false, // 在请求体中添加签名
  algorithm: 'md5', // 签名算法
};

const api = createWithValid({ baseURL: 'https://api.example.com' }, signConfig);

// 使用方式与普通 axios 相同
const response = await api.post('/users', { name: '张三', age: 25 });
```

### 2. 使用便捷的请求函数

```typescript
import { createValidatedRequest } from '@cosmosfe/tool';

const signConfig = {
  secretKey: 'your-secret-key',
  algorithm: 'sha256',
};

const api = createValidatedRequest('https://api.example.com', signConfig);

// GET 请求
const users = await api.get('/users', {
  params: { page: 1, size: 10 },
});

// POST 请求
const newUser = await api.post('/users', {
  name: '李四',
  email: 'lisi@example.com',
});

// 验证请求参数
const params = { name: 'test', timestamp: Date.now(), sign: 'abc123' };
const validation = api.validate(params);
console.log(validation.isValid, validation.error);
```

### 3. 独立验证签名

```typescript
import { validateRequest } from '@cosmosfe/tool';

const signConfig = {
  secretKey: 'your-secret-key',
  algorithm: 'md5',
};

const params = {
  name: '王五',
  age: 30,
  timestamp: 1640995200000,
  sign: 'calculated-signature',
};

const result = validateRequest(params, signConfig);
if (result.isValid) {
  console.log('签名验证通过');
} else {
  console.log('签名验证失败:', result.error);
}
```

## 配置选项

### SignConfig 接口

| 字段             | 类型                          | 默认值        | 说明                   |
| ---------------- | ----------------------------- | ------------- | ---------------------- |
| `secretKey`      | `string`                      | -             | 签名密钥（必需）       |
| `timestampField` | `string`                      | `'timestamp'` | 时间戳字段名           |
| `signField`      | `string`                      | `'sign'`      | 签名字段名             |
| `expireTime`     | `number`                      | `300000`      | 时间戳有效期（毫秒）   |
| `useHeader`      | `boolean`                     | `false`       | 是否在请求头中添加签名 |
| `algorithm`      | `'md5' \| 'sha1' \| 'sha256'` | `'md5'`       | 签名算法               |

## 签名算法

### MD5（默认）

```typescript
const signConfig = {
  secretKey: 'your-key',
  algorithm: 'md5',
};
```

### SHA1

```typescript
const signConfig = {
  secretKey: 'your-key',
  algorithm: 'sha1',
};
```

### SHA256

```typescript
const signConfig = {
  secretKey: 'your-key',
  algorithm: 'sha256',
};
```

## 签名位置

### 请求体签名（默认）

```typescript
const signConfig = {
  secretKey: 'your-key',
  useHeader: false, // 默认值
};

// GET 请求会添加到 URL 参数
// POST/PUT 请求会添加到请求体
```

### 请求头签名

```typescript
const signConfig = {
  secretKey: 'your-key',
  useHeader: true,
};

// 签名和时间戳会添加到请求头
```

## 跳过签名

某些请求可能需要跳过签名：

```typescript
// 跳过单个请求的签名
const response = await api.post(
  '/public/health',
  {},
  {
    skipSign: true,
  },
);

// 或者使用原始的 axios 实例
const axiosInstance = axios.create();
const response = await axiosInstance.post('/public/health');
```

## 错误处理

```typescript
try {
  const response = await api.post('/users', userData);
  console.log('请求成功:', response.data);
} catch (error) {
  if (error.response?.status === 401) {
    console.log('签名验证失败');
  } else {
    console.log('请求失败:', error.message);
  }
}
```

## 服务端验证示例

服务端可以使用相同的算法验证签名：

```javascript
// Node.js 示例
const crypto = require('crypto');

function verifySign(params, secretKey, algorithm = 'md5') {
  const { sign, timestamp, ...otherParams } = params;

  // 过滤空值并排序
  const filteredParams = Object.keys(otherParams)
    .filter(
      (key) =>
        otherParams[key] !== null &&
        otherParams[key] !== undefined &&
        otherParams[key] !== '',
    )
    .sort()
    .reduce((acc, key) => {
      acc[key] = otherParams[key];
      return acc;
    }, {});

  // 构建签名字符串
  const signString =
    Object.keys(filteredParams)
      .map((key) => `${key}=${filteredParams[key]}`)
      .join('&') + `&key=${secretKey}`;

  // 生成签名
  const calculatedSign = crypto
    .createHash(algorithm)
    .update(signString)
    .digest('hex');

  return sign.toLowerCase() === calculatedSign.toLowerCase();
}
```

## 注意事项

1. **密钥安全**: 请妥善保管签名密钥，不要在前端代码中硬编码
2. **时间同步**: 确保客户端和服务端时间同步，避免时间戳验证失败
3. **算法一致性**: 客户端和服务端必须使用相同的签名算法
4. **参数排序**: 签名时参数会按字母顺序排序，服务端验证时也要保持一致
5. **空值处理**: 空值、null、undefined 会被自动过滤，不参与签名计算
