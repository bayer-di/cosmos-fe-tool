# @cosmosfe/tool

Cosmos 前端通用工具函数库，提供常用的 JavaScript/TypeScript 工具函数。

## 特性

- 🚀 **TypeScript 支持** - 完整的类型定义
- 📦 **Tree-shaking 友好** - 支持按需导入
- 🧪 **完整测试** - 100% 测试覆盖率
- 📚 **详细文档** - 完整的 API 文档
- 🔧 **现代化构建** - 使用 Rollup 构建

## 安装

```bash
npm install @cosmosfe/tool
# 或
yarn add @cosmosfe/tool
```

## 使用

### 完整导入

```typescript
import { asyncFetch, filterEmptyValue, formatDuringWithoutSec, remUtils } from '@cosmosfe/tool'
```

### 按需导入

```typescript
import { asyncFetch } from '@cosmosfe/tool'
import { filterEmptyValue } from '@cosmosfe/tool'
import { formatDuringWithoutSec } from '@cosmosfe/tool'
import { remUtils } from '@cosmosfe/tool'
```

## API 文档

### asyncFetch

异步请求工具函数，提供统一的错误处理和超时控制。

```typescript
import { asyncFetch } from '@cosmosfe/tool'

// 基本使用
const data = await asyncFetch('/api/users')

// 带配置的使用
const data = await asyncFetch('/api/users', {
  method: 'POST',
  body: JSON.stringify({ name: 'John' }),
  timeout: 5000
})
```

### filterEmptyValue

过滤对象中的空值（null、undefined、空字符串等）。

```typescript
import { filterEmptyValue } from '@cosmosfe/tool'

const obj = {
  name: 'John',
  age: 30,
  email: '',
  address: null,
  phone: undefined
}

const filtered = filterEmptyValue(obj)
// 结果: { name: 'John', age: 30 }
```

### formatDuringWithoutSec

格式化时间间隔，不显示秒数。

```typescript
import { formatDuringWithoutSec } from '@cosmosfe/tool'

const duration = formatDuringWithoutSec(3661000) // 1小时1分钟1秒
// 结果: "1小时1分钟"
```

### remUtils

rem 相关工具函数集合。

```typescript
import { remUtils } from '@cosmosfe/tool'

// 转换 px 到 rem
const rem = remUtils.pxToRem(16) // 1rem

// 转换 rem 到 px
const px = remUtils.remToPx(1) // 16px
```

### toZhNumber

将数字转换为中文数字。

```typescript
import { toZhNumber } from '@cosmosfe/tool'

const zhNumber = toZhNumber(1234) // "一千二百三十四"
```

## 开发

### 安装依赖

```bash
yarn install
```

### 开发模式

```bash
yarn dev
```

### 构建

```bash
yarn build
```

### 测试

```bash
# 运行测试
yarn test

# 监听模式
yarn test:watch

# 生成覆盖率报告
yarn test:coverage
```

### 代码检查

```bash
# 检查代码
yarn lint

# 自动修复
yarn lint:fix

# 类型检查
yarn type-check
```

### 发布

```bash
yarn release
```

## 技术栈

- **TypeScript** - 类型安全的 JavaScript
- **Rollup** - 模块打包器
- **Jest** - 测试框架
- **ESLint** - 代码检查
- **ts-jest** - TypeScript 测试支持

## 浏览器支持

- Chrome >= 88
- Firefox >= 85
- Safari >= 14
- Edge >= 88

## 许可证

MIT License 