import isEmptyObject from '../src/object/isEmpty'

describe('isEmptyObject', () => {
  describe('基础功能测试', () => {
    test('应该正确识别空对象', () => {
      const emptyObj = {}
      expect(isEmptyObject(emptyObj)).toBe(true)
    })

    test('应该正确识别非空对象', () => {
      const nonEmptyObj = { key: 'value' }
      expect(isEmptyObject(nonEmptyObj)).toBe(false)
    })

    test('应该正确识别包含多个属性的对象', () => {
      const multiPropObj = { 
        name: 'John', 
        age: 30, 
        city: 'New York' 
      }
      expect(isEmptyObject(multiPropObj)).toBe(false)
    })
  })

  describe('边界情况测试', () => {
    test('应该处理默认参数（空对象）', () => {
      expect(isEmptyObject()).toBe(true)
    })

    test('应该处理只包含空字符串键的对象', () => {
      const obj = { '': 'value' }
      expect(isEmptyObject(obj)).toBe(false)
    })

    test('应该处理只包含数字键的对象', () => {
      const obj = { 1: 'one', 2: 'two' }
      expect(isEmptyObject(obj)).toBe(false)
    })

    test('应该处理只包含符号键的对象', () => {
      const symbol = Symbol('test')
      const obj = { [symbol]: 'value' }
      expect(isEmptyObject(obj)).toBe(true) // Object.keys 不返回 Symbol 键
    })

    test('应该处理包含null值的对象', () => {
      const obj = { key: null }
      expect(isEmptyObject(obj)).toBe(false)
    })

    test('应该处理包含undefined值的对象', () => {
      const obj = { key: undefined }
      expect(isEmptyObject(obj)).toBe(false)
    })

    test('应该处理包含空字符串值的对象', () => {
      const obj = { key: '' }
      expect(isEmptyObject(obj)).toBe(false)
    })

    test('应该处理包含0值的对象', () => {
      const obj = { key: 0 }
      expect(isEmptyObject(obj)).toBe(false)
    })

    test('应该处理包含false值的对象', () => {
      const obj = { key: false }
      expect(isEmptyObject(obj)).toBe(false)
    })
  })

  describe('复杂对象测试', () => {
    test('应该处理嵌套对象', () => {
      const nestedObj = { 
        outer: { 
          inner: 'value' 
        } 
      }
      expect(isEmptyObject(nestedObj)).toBe(false)
    })

    test('应该处理包含数组的对象', () => {
      const objWithArray = { 
        items: [1, 2, 3] 
      }
      expect(isEmptyObject(objWithArray)).toBe(false)
    })

    test('应该处理包含函数的对象', () => {
      const objWithFunction = { 
        method: () => 'hello' 
      }
      expect(isEmptyObject(objWithFunction)).toBe(false)
    })

    test('应该处理包含日期的对象', () => {
      const objWithDate = { 
        createdAt: new Date() 
      }
      expect(isEmptyObject(objWithDate)).toBe(false)
    })

    test('应该处理包含正则表达式的对象', () => {
      const objWithRegex = { 
        pattern: /test/ 
      }
      expect(isEmptyObject(objWithRegex)).toBe(false)
    })
  })

  describe('原型链测试', () => {
    test('应该处理从原型继承属性的对象', () => {
      const parent = { inherited: 'value' }
      const child = Object.create(parent)
      expect(isEmptyObject(child)).toBe(true) // 只检查自身属性
    })

    test('应该处理自身属性和继承属性混合的对象', () => {
      const parent = { inherited: 'value' }
      const child = Object.create(parent)
      child.own = 'property'
      expect(isEmptyObject(child)).toBe(false)
    })
  })

  describe('不可枚举属性测试', () => {
    test('应该处理包含不可枚举属性的对象', () => {
      const obj = {}
      Object.defineProperty(obj, 'hidden', {
        value: 'secret',
        enumerable: false
      })
      expect(isEmptyObject(obj)).toBe(true) // Object.keys 只返回可枚举属性
    })

    test('应该处理混合可枚举和不可枚举属性的对象', () => {
      const obj = { visible: 'public' }
      Object.defineProperty(obj, 'hidden', {
        value: 'secret',
        enumerable: false
      })
      expect(isEmptyObject(obj)).toBe(false)
    })
  })

  describe('特殊对象测试', () => {
    test('应该处理Object.create(null)创建的对象', () => {
      const nullProtoObj = Object.create(null)
      expect(isEmptyObject(nullProtoObj)).toBe(true)
    })

    test('应该处理Object.create(null)创建的非空对象', () => {
      const nullProtoObj = Object.create(null)
      nullProtoObj.key = 'value'
      expect(isEmptyObject(nullProtoObj)).toBe(false)
    })

    test('应该处理通过构造函数创建的对象', () => {
      function TestClass() {
        this.property = 'value'
      }
      const instance = new TestClass()
      expect(isEmptyObject(instance)).toBe(false)
    })

    test('应该处理空构造函数创建的对象', () => {
      function EmptyClass() {}
      const instance = new EmptyClass()
      expect(isEmptyObject(instance)).toBe(true)
    })
  })

  describe('实际应用场景测试', () => {
    test('模拟API响应对象检查', () => {
      const emptyResponse = {}
      const validResponse = { data: [], total: 0 }
      
      expect(isEmptyObject(emptyResponse)).toBe(true)
      expect(isEmptyObject(validResponse)).toBe(false)
    })

    test('模拟表单数据检查', () => {
      const emptyForm = {}
      const filledForm = { username: 'john', email: 'john@example.com' }
      
      expect(isEmptyObject(emptyForm)).toBe(true)
      expect(isEmptyObject(filledForm)).toBe(false)
    })

    test('模拟配置对象检查', () => {
      const defaultConfig = {}
      const customConfig = { theme: 'dark', language: 'zh-CN' }
      
      expect(isEmptyObject(defaultConfig)).toBe(true)
      expect(isEmptyObject(customConfig)).toBe(false)
    })
  })

  describe('性能测试', () => {
    test('应该快速处理大对象', () => {
      const largeObj: Record<string, any> = {}
      for (let i = 0; i < 1000; i++) {
        largeObj[`key${i}`] = `value${i}`
      }
      
      const startTime = performance.now()
      const result = isEmptyObject(largeObj)
      const endTime = performance.now()
      
      expect(result).toBe(false)
      expect(endTime - startTime).toBeLessThan(10) // 应该在10ms内完成
    })

    test('应该快速处理空对象', () => {
      const emptyObj = {}
      
      const startTime = performance.now()
      const result = isEmptyObject(emptyObj)
      const endTime = performance.now()
      
      expect(result).toBe(true)
      expect(endTime - startTime).toBeLessThan(1) // 应该在1ms内完成
    })
  })

  describe('类型安全测试', () => {
    test('应该正确处理TypeScript类型', () => {
      interface User {
        name?: string
        age?: number
      }
      
      const emptyUser: User = {}
      const filledUser: User = { name: 'John', age: 30 }
      
      expect(isEmptyObject(emptyUser)).toBe(true)
      expect(isEmptyObject(filledUser)).toBe(false)
    })

    test('应该处理泛型对象', () => {
      const emptyGeneric: Record<string, any> = {}
      const filledGeneric: Record<string, any> = { key: 'value' }
      
      expect(isEmptyObject(emptyGeneric)).toBe(true)
      expect(isEmptyObject(filledGeneric)).toBe(false)
    })
  })
}) 