/* eslint-env browser */
/**
 * H5 rem 设置工具
 * 用于移动端响应式适配
 */

export interface RemConfig {
  designWidth?: number;
  baseFontSize?: number;
  maxWidth?: number;
  minWidth?: number;
}

/**
 * 设置rem基准值
 * @param {Object} config - 配置选项
 * @param {number} config.designWidth - 设计稿宽度，默认375px
 * @param {number} config.baseFontSize - 基准字体大小，默认100px
 * @param {number} config.maxWidth - 最大宽度限制，默认750px
 * @param {number} config.minWidth - 最小宽度限制，默认320px
 */
export function setRem(config: RemConfig = {}): void {
  const {
    designWidth = 375,
    baseFontSize = 100,
    maxWidth = 750,
    minWidth = 320
  } = config

  const setRemSize = () => {
    const docEl = document.documentElement
    const clientWidth = docEl.clientWidth
    
    // 限制宽度范围
    const width = Math.min(Math.max(clientWidth, minWidth), maxWidth)
    
    // 计算rem基准值
    const remSize = (width / designWidth) * baseFontSize
    
    // 设置根元素字体大小
    docEl.style.fontSize = `${remSize}px`
  }

  // 初始化设置
  setRemSize()

  // 监听窗口大小变化
  window.addEventListener('resize', setRemSize)
  
  // 监听页面显示（解决iOS Safari的兼容性问题）
  document.addEventListener('pageshow', (e: Event) => {
    if ((e as PageTransitionEvent).persisted) {
      setRemSize()
    }
  })
}

/**
 * 获取当前rem基准值
 * @returns {number} 当前rem基准值（px）
 */
export function getRemSize(): number {
  const fontSize = getComputedStyle(document.documentElement).fontSize
  return parseFloat(fontSize)
}

/**
 * px转rem
 * @param {number} px - px值
 * @returns {number} rem值
 */
export function pxToRem(px: number): number {
  const remSize = getRemSize()
  return px / remSize
}

/**
 * rem转px
 * @param {number} rem - rem值
 * @returns {number} px值
 */
export function remToPx(rem: number): number {
  const remSize = getRemSize()
  return rem * remSize
}

/**
 * 移除rem设置（恢复默认字体大小）
 */
export function removeRem(): void {
  const docEl = document.documentElement
  docEl.style.fontSize = ''
  
  // 移除事件监听器
  window.removeEventListener('resize', () => {})
  document.removeEventListener('pageshow', () => {})
}

/**
 * 创建rem适配的CSS变量
 * @param {Object} config - 配置选项
 * @param {number} config.designWidth - 设计稿宽度，默认375px
 * @param {number} config.baseFontSize - 基准字体大小，默认100px
 * @param {number} config.maxWidth - 最大宽度限制，默认750px
 * @param {number} config.minWidth - 最小宽度限制，默认320px
 * @returns {string} CSS变量字符串
 */
export function createRemCSSVars(config: RemConfig = {}): string {
  const {
    designWidth = 375,
    baseFontSize = 100,
    maxWidth = 750,
    minWidth = 320
  } = config

  return `
    :root {
      --design-width: ${designWidth}px;
      --base-font-size: ${baseFontSize}px;
      --max-width: ${maxWidth}px;
      --min-width: ${minWidth}px;
    }
  `
} 