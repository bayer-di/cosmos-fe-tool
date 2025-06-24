import { setRem, getRemSize, pxToRem, remToPx, removeRem, createRemCSSVars } from '../src/rem'

// Mock DOM环境
const mockDocument = {
  documentElement: {
    clientWidth: 375,
    style: {
      fontSize: ''
    }
  },
  addEventListener: jest.fn(),
  removeEventListener: jest.fn()
}

const mockWindow = {
  addEventListener: jest.fn(),
  removeEventListener: jest.fn()
}

const mockGetComputedStyle = jest.fn(() => ({
  fontSize: '16px'
}))

// 设置全局mock
Object.defineProperty(global, 'document', {
  value: mockDocument,
  writable: true
})

Object.defineProperty(global, 'window', {
  value: mockWindow,
  writable: true
})

Object.defineProperty(global, 'getComputedStyle', {
  value: mockGetComputedStyle,
  writable: true
})

describe('rem工具测试', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockDocument.documentElement.style.fontSize = ''
    mockDocument.documentElement.clientWidth = 375
  })

  describe('setRem', () => {
    it('应该使用默认配置设置rem', () => {
      setRem()
      
      expect(mockDocument.documentElement.style.fontSize).toBe('100px')
      expect(mockWindow.addEventListener).toHaveBeenCalledWith('resize', expect.any(Function))
      expect(mockDocument.addEventListener).toHaveBeenCalledWith('pageshow', expect.any(Function))
    })

    it('应该使用自定义配置设置rem', () => {
      setRem({
        designWidth: 750,
        baseFontSize: 20,
        maxWidth: 1000,
        minWidth: 375
      })
      
      expect(mockDocument.documentElement.style.fontSize).toBe('10px') // (375/750)*20
    })

    it('应该限制宽度范围', () => {
      mockDocument.documentElement.clientWidth = 1000
      
      setRem({
        designWidth: 375,
        baseFontSize: 16,
        maxWidth: 750
      })
      
      expect(mockDocument.documentElement.style.fontSize).toBe('32px') // (750/375)*16
    })
  })

  describe('getRemSize', () => {
    it('应该返回当前rem基准值', () => {
      mockGetComputedStyle.mockReturnValue({ fontSize: '100px' })
      
      const result = getRemSize()
      
      expect(result).toBe(100)
      expect(mockGetComputedStyle).toHaveBeenCalledWith(mockDocument.documentElement)
    })
  })

  describe('pxToRem', () => {
    it('应该正确转换px到rem', () => {
      mockGetComputedStyle.mockReturnValue({ fontSize: '100px' })
      
      const result = pxToRem(200)
      
      expect(result).toBe(2) // 200/100
    })
  })

  describe('remToPx', () => {
    it('应该正确转换rem到px', () => {
      mockGetComputedStyle.mockReturnValue({ fontSize: '100px' })
      
      const result = remToPx(2)
      
      expect(result).toBe(200) // 2*100
    })
  })

  describe('removeRem', () => {
    it('应该移除rem设置', () => {
      mockDocument.documentElement.style.fontSize = '16px'
      
      removeRem()
      
      expect(mockDocument.documentElement.style.fontSize).toBe('')
      expect(mockWindow.removeEventListener).toHaveBeenCalled()
      expect(mockDocument.removeEventListener).toHaveBeenCalled()
    })
  })

  describe('createRemCSSVars', () => {
    it('应该使用默认配置创建CSS变量', () => {
      const result = createRemCSSVars()
      
      expect(result).toContain('--design-width: 375px')
      expect(result).toContain('--base-font-size: 100px')
      expect(result).toContain('--max-width: 750px')
      expect(result).toContain('--min-width: 320px')
    })

    it('应该使用自定义配置创建CSS变量', () => {
      const result = createRemCSSVars({
        designWidth: 750,
        baseFontSize: 20,
        maxWidth: 1000,
        minWidth: 375
      })
      
      expect(result).toContain('--design-width: 750px')
      expect(result).toContain('--base-font-size: 20px')
      expect(result).toContain('--max-width: 1000px')
      expect(result).toContain('--min-width: 375px')
    })
  })
}) 