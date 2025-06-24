# 开发指南

## 🚀 快速开始

### 环境要求

- Node.js >= 14.0.0
- npm >= 6.0.0 或 yarn >= 1.22.0

### 安装依赖

```bash
cd tool
yarn install
```

### 开发模式

```bash
# 启动开发模式（监听文件变化）
yarn dev

# 构建项目
yarn build

# 运行测试
yarn test

# 代码检查
yarn lint
```

## 📁 项目结构

```
tool/
├── src/                    # 源代码目录
│   ├── async/             # 异步相关功能
│   │   └── index.ts
│   ├── object/            # 对象操作功能
│   │   └── filterEmptyValue.ts
│   ├── date/              # 日期处理功能
│   │   └── formatDuringWithoutSec.ts
│   └── index.ts           # 主入口文件
├── tests/                 # 测试文件
│   └── setup.ts
├── examples/              # 使用示例
│   └── react-example.tsx
├── scripts/               # 脚本文件
│   └── release.sh
├── dist/                  # 构建输出（自动生成）
├── package.json           # 项目配置
├── tsconfig.json          # TypeScript 配置
├── rollup.config.js       # Rollup 构建配置
├── jest.config.js         # Jest 测试配置
├── .eslintrc.js           # ESLint 配置
└── README.md              # 项目文档
```

## 🛠️ 开发流程

### 1. 添加新功能

1. **创建功能文件**
   ```bash
   # 在 src/ 目录下创建相应的模块文件
   touch src/string/capitalize.ts
   ```

2. **实现功能**
   ```typescript
   // src/string/capitalize.ts
   export const capitalize = (str: string): string => {
     return str.charAt(0).toUpperCase() + str.slice(1)
   }
   ```

3. **创建入口文件**
   ```typescript
   // src/string/index.ts
   export { capitalize } from './capitalize'
   ```

4. **在主入口中导出**
   ```typescript
   // src/index.ts
   import { capitalize } from './string'
   
   // 添加到默认导出
   export default {
     // ... 其他导出
     capitalize,
   }
   
   // 添加到命名导出
   export { capitalize }
   ```

### 2. 添加测试

1. **创建测试文件**
   ```bash
   touch tests/string/capitalize.test.ts
   ```

2. **编写测试用例**
   ```typescript
   // tests/string/capitalize.test.ts
   import { capitalize } from '../../src/string/capitalize'

   describe('capitalize', () => {
     it('应该将首字母大写', () => {
       expect(capitalize('hello')).toBe('Hello')
       expect(capitalize('world')).toBe('World')
     })

     it('应该处理空字符串', () => {
       expect(capitalize('')).toBe('')
     })

     it('应该处理单个字符', () => {
       expect(capitalize('a')).toBe('A')
     })
   })
   ```

### 3. 代码检查

```bash
# 运行 ESLint 检查
yarn lint

# 自动修复可修复的问题
yarn lint:fix

# 类型检查
yarn type-check
```

## 📦 发布流程

### 1. 准备发布

```bash
# 确保所有更改已提交
git status

# 运行完整的检查
yarn test
yarn lint
yarn type-check
yarn build
```

### 2. 使用发布脚本

```bash
# 运行发布脚本
./scripts/release.sh
```

### 3. 手动发布

```bash
# 更新版本号
npm version patch  # 或 minor, major

# 构建项目
yarn build

# 发布到 npm
npm publish --access public

# 推送标签
git push --follow-tags
```

## 🧪 测试指南

### 测试结构

```
tests/
├── setup.ts              # 测试环境设置
├── async/                # 异步功能测试
│   └── index.test.ts
├── object/               # 对象功能测试
│   └── filterEmptyValue.test.ts
└── date/                 # 日期功能测试
    └── formatDuringWithoutSec.test.ts
```

### 测试命令

```bash
# 运行所有测试
yarn test

# 监听模式
yarn test:watch

# 生成覆盖率报告
yarn test:coverage

# 运行特定测试文件
yarn test tests/async/index.test.ts
```

### 测试最佳实践

1. **测试覆盖率**：确保新功能有足够的测试覆盖率
2. **边界情况**：测试边界情况和异常情况
3. **异步测试**：正确处理异步函数的测试
4. **模拟依赖**：使用 Jest 的 mock 功能模拟外部依赖

## 🔧 配置说明

### TypeScript 配置 (tsconfig.json)

- `strict: true` - 启用严格模式
- `declaration: true` - 生成类型声明文件
- `sourceMap: true` - 生成源码映射
- `esModuleInterop: true` - 启用 ES 模块互操作性

### Rollup 配置 (rollup.config.js)

- 支持 CommonJS 和 ES Module 双格式
- 外部化 peerDependencies
- 生成源码映射
- 使用 TypeScript 插件

### Jest 配置 (jest.config.js)

- 使用 ts-jest 预设
- 收集覆盖率信息
- 设置测试环境

## 📝 代码规范

### 命名规范

- **文件名**：使用 kebab-case（如：`filter-empty-value.ts`）
- **函数名**：使用 camelCase（如：`filterEmptyValue`）
- **类型名**：使用 PascalCase（如：`AsyncFetchHooks`）
- **常量名**：使用 UPPER_SNAKE_CASE（如：`MAX_RETRY_COUNT`）

### 代码风格

- 使用 2 个空格缩进
- 使用单引号
- 行尾不加分号
- 使用 TypeScript 严格模式

### 注释规范

```typescript
/**
 * 过滤对象中的空值
 * @param obj 要过滤的对象
 * @returns 过滤后的对象
 * @example
 * ```typescript
 * const result = filterEmptyValue({
 *   name: '张三',
 *   age: 25,
 *   email: '',
 *   phone: null
 * })
 * // 结果: { name: '张三', age: 25 }
 * ```
 */
export const filterEmptyValue = <T extends Record<string, any>>(obj: T): Partial<T> => {
  // 实现代码
}
```

## 🐛 常见问题

### 1. 构建失败

```bash
# 清理构建缓存
yarn clean
yarn build
```

### 2. 类型错误

```bash
# 运行类型检查
yarn type-check
```

### 3. 测试失败

```bash
# 清理测试缓存
yarn test --clearCache
```

### 4. 发布失败

- 确保已登录 npm：`npm login`
- 检查包名是否可用
- 确保版本号已更新

## 📚 相关资源

- [TypeScript 官方文档](https://www.typescriptlang.org/docs/)
- [Rollup 官方文档](https://rollupjs.org/guide/en/)
- [Jest 官方文档](https://jestjs.io/docs/getting-started)
- [ESLint 官方文档](https://eslint.org/docs/user-guide/) 