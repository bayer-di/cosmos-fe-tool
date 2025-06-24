# H5 Rem 设置工具

用于移动端响应式适配的rem工具，支持动态设置rem基准值，实现不同屏幕尺寸下的等比例缩放。

## 功能特性

- 🎯 动态设置rem基准值
- 📱 支持自定义设计稿尺寸
- 🔄 自动监听窗口大小变化
- 📏 提供px与rem转换工具
- 🎨 生成CSS变量
- 🛡️ 兼容iOS Safari

## 使用方法

### 基础用法

```typescript
import { setRem } from '@cosmos-fe/tool'

// 使用默认配置设置rem
setRem()
```

### 自定义配置

```typescript
import { setRem } from '@cosmos-fe/tool'

// 自定义配置
setRem({
  designWidth: 750,    // 设计稿宽度
  baseFontSize: 100,   // 基准字体大小
  maxWidth: 1000,      // 最大宽度限制
  minWidth: 375        // 最小宽度限制
})
```

### 工具函数

```typescript
import { 
  getRemSize, 
  pxToRem, 
  remToPx, 
  removeRem,
  createRemCSSVars 
} from '@cosmos-fe/tool'

// 获取当前rem基准值
const currentRem = getRemSize()

// px转rem
const remValue = pxToRem(200) // 如果当前rem=100px，返回2

// rem转px
const pxValue = remToPx(2) // 如果当前rem=100px，返回200

// 移除rem设置
removeRem()

// 生成CSS变量
const cssVars = createRemCSSVars({
  designWidth: 750,
  baseFontSize: 100
})
```

## 配置参数

| 参数 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| designWidth | number | 375 | 设计稿宽度（px） |
| baseFontSize | number | 100 | 基准字体大小（px） |
| maxWidth | number | 750 | 最大宽度限制（px） |
| minWidth | number | 320 | 最小宽度限制（px） |

## 工作原理

1. **计算rem基准值**：`remSize = (当前宽度 / 设计稿宽度) * 基准字体大小`
2. **设置根元素字体**：将计算出的值设置为`html`元素的`font-size`
3. **响应式更新**：监听`resize`事件，动态调整rem基准值
4. **宽度限制**：确保rem基准值在合理范围内

## 使用场景

### 移动端适配

```typescript
// 在应用启动时设置
setRem({
  designWidth: 375,  // iPhone设计稿
  baseFontSize: 100
})
```

### 平板适配

```typescript
setRem({
  designWidth: 768,  // iPad设计稿
  baseFontSize: 100,
  maxWidth: 1024
})
```

### CSS中使用

```css
/* 使用rem单位 */
.container {
  width: 3.2rem;  /* 320px (3.2 * 100px) */
  height: 1rem;   /* 100px (1 * 100px) */
  font-size: 0.16rem; /* 16px (0.16 * 100px) */
}

/* 使用生成的CSS变量 */
:root {
  --design-width: 375px;
  --base-font-size: 100px;
}
```

## 注意事项

1. **浏览器兼容性**：支持所有现代浏览器，包括iOS Safari
2. **性能考虑**：resize事件会触发rem重新计算，建议适当节流
3. **CSS单位**：在CSS中使用rem单位时，1rem = 当前设置的基准值（默认100px）
4. **清除设置**：使用`removeRem()`可以恢复默认字体大小

## 示例项目

```typescript
// main.ts
import { setRem } from '@cosmos-fe/tool'

// 初始化rem设置
setRem({
  designWidth: 375,
  baseFontSize: 100,
  maxWidth: 750,
  minWidth: 320
})

// 在组件中使用
const buttonStyle = {
  width: '1rem',    // 100px
  height: '2.5rem',  // 250px
  fontSize: '0.16rem'   // 16px
}
``` 