import { findMostFrequent } from '../src/array/findMostFrequent'

describe('findMostFrequent', () => {
  describe('基础功能测试', () => {
    test('应该找出数字数组中重复最多的值', () => {
      const arr = [1, 2, 3, 2, 4, 2, 5, 1]
      const result = findMostFrequent(arr)
      expect(result).toBe(2)
    })

    test('应该找出字符串数组中重复最多的值', () => {
      const arr = ['apple', 'banana', 'apple', 'cherry', 'banana', 'apple']
      const result = findMostFrequent(arr)
      expect(result).toBe('apple')
    })

    test('应该找出布尔值数组中重复最多的值', () => {
      const arr = [true, false, true, true, false]
      const result = findMostFrequent(arr)
      expect(result).toBe(true)
    })
  })

  describe('边界情况测试', () => {
    test('应该处理只有一个元素的数组', () => {
      const arr = [42]
      const result = findMostFrequent(arr)
      expect(result).toBe(42)
    })

    test('应该处理所有元素都相同的数组', () => {
      const arr = [1, 1, 1, 1, 1]
      const result = findMostFrequent(arr)
      expect(result).toBe(1)
    })

    test('应该处理所有元素都不相同的数组', () => {
      const arr = [1, 2, 3, 4, 5]
      const result = findMostFrequent(arr)
      expect(result).toBe(1) // 返回第一个元素
    })

    test('应该处理空数组（返回null）', () => {
      const arr: number[] = []
      const result = findMostFrequent(arr)
      expect(result).toBeNull()
    })
  })

  describe('复杂数据类型测试', () => {
    test('应该处理对象数组（基于引用比较）', () => {
      const obj1 = { id: 1, name: 'Alice' }
      const obj2 = { id: 2, name: 'Bob' }
      const obj3 = { id: 1, name: 'Alice' } // 不同的引用
      
      const arr = [obj1, obj2, obj1, obj3]
      const result = findMostFrequent(arr)
      expect(result).toBe(obj1)
    })

    test('应该处理嵌套数组', () => {
      const arr1 = [1, 2]
      const arr2 = [3, 4]
      const arr3 = [1, 2] // 不同的引用
      
      const arr = [arr1, arr2, arr1, arr3]
      const result = findMostFrequent(arr)
      expect(result).toBe(arr1)
    })

    test('应该处理混合类型数组', () => {
      const arr = [1, 'hello', 1, true, 'hello', 1]
      const result = findMostFrequent(arr)
      expect(result).toBe(1)
    })
  })

  describe('频率相等的情况测试', () => {
    test('当多个元素频率相同时，应该返回第一个出现的元素', () => {
      const arr = [1, 2, 1, 2, 3, 3]
      const result = findMostFrequent(arr)
      expect(result).toBe(1) // 1 和 2 都出现2次，但1先出现
    })

    test('应该正确处理所有元素频率都相同的情况', () => {
      const arr = [1, 2, 3, 4]
      const result = findMostFrequent(arr)
      expect(result).toBe(1) // 所有元素都出现1次，返回第一个
    })
  })

  describe('特殊值测试', () => {
    test('应该处理包含 null 的数组', () => {
      const arr = [null, 1, null, 2, null]
      const result = findMostFrequent(arr)
      expect(result).toBe(null)
    })

    test('应该处理包含 undefined 的数组', () => {
      const arr = [undefined, 1, undefined, 2, undefined]
      const result = findMostFrequent(arr)
      expect(result).toBe(undefined)
    })

    test('应该处理包含 NaN 的数组', () => {
      const arr = [NaN, 1, NaN, 2, NaN]
      const result = findMostFrequent(arr)
      expect(result).toBe(NaN)
    })

    test('应该处理包含空字符串的数组', () => {
      const arr = ['', 'hello', '', 'world', '']
      const result = findMostFrequent(arr)
      expect(result).toBe('')
    })

    test('应该处理包含零的数组', () => {
      const arr = [0, 1, 0, 2, 0]
      const result = findMostFrequent(arr)
      expect(result).toBe(0)
    })
  })

  describe('大数组性能测试', () => {
    test('应该处理较大的数组', () => {
      const baseArr = [1, 2, 3, 4, 5]
      const arr = Array.from({ length: 1000 }, (_, i) => baseArr[i % baseArr.length])
      const result = findMostFrequent(arr)
      expect(result).toBe(1) // 1 出现 200 次，其他元素各出现 200 次
    })

    test('应该处理包含大量重复元素的大数组', () => {
      const arr = Array.from({ length: 1000 }, (_, i) => {
        if (i < 500) return 'frequent'
        return `item-${i}`
      })
      const result = findMostFrequent(arr)
      expect(result).toBe('frequent')
    })
  })

  describe('实际应用场景测试', () => {
    test('模拟用户投票场景', () => {
      const votes = ['张三', '李四', '张三', '王五', '李四', '张三', '赵六']
      const result = findMostFrequent(votes)
      expect(result).toBe('张三')
    })

    test('模拟商品销售统计场景', () => {
      const sales = ['苹果', '香蕉', '苹果', '橙子', '苹果', '香蕉', '葡萄']
      const result = findMostFrequent(sales)
      expect(result).toBe('苹果')
    })

    test('模拟错误代码统计场景', () => {
      const errorCodes = [404, 500, 404, 403, 500, 404, 200, 500]
      const result = findMostFrequent(errorCodes)
      expect(result).toBe(404)
    })
  })

  describe('类型安全测试', () => {
    test('应该保持泛型类型', () => {
      const stringArr: string[] = ['a', 'b', 'a', 'c']
      const result = findMostFrequent(stringArr)
      expect(typeof result).toBe('string')
      expect(result).toBe('a')
    })

    test('应该处理自定义类型', () => {
      type User = { id: number; name: string }
      const users: User[] = [
        { id: 1, name: 'Alice' },
        { id: 2, name: 'Bob' },
        { id: 1, name: 'Alice' }
      ]
      const result = findMostFrequent(users)
      expect(result).toEqual({ id: 1, name: 'Alice' })
    })
  })
}) 