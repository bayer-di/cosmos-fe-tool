import ApiLimitControl from '../src/rest/apiLimit'

describe('ApiLimitControl', () => {
  let apiLimit: ApiLimitControl

  beforeEach(() => {
    apiLimit = new ApiLimitControl(2) // 限制并发数为2
  })

  afterEach(() => {
    apiLimit.reset()
  })

  describe('基础功能测试', () => {
    test('应该正确初始化', () => {
      expect(apiLimit.limit).toBe(2)
      expect(apiLimit.executingQueue).toEqual([])
      expect(apiLimit.subscribeQueue).toEqual([])
      expect(apiLimit.count).toBe(0)
    })

    test('应该支持自定义并发限制', () => {
      const customLimit = new ApiLimitControl(5)
      expect(customLimit.limit).toBe(5)
    })
  })

  describe('并发控制测试', () => {
    test('应该立即执行未超过限制的API', async () => {
      const mockApi = jest.fn().mockResolvedValue('success')
      
      const result = await apiLimit.add(mockApi)
      
      expect(result).toBe('success')
      expect(mockApi).toHaveBeenCalledTimes(1)
    })

    test('应该限制并发执行数量', async () => {
      const results: string[] = []
      const promises: Promise<any>[] = []
      
      // 创建3个API调用，但限制为2个并发
      for (let i = 0; i < 3; i++) {
        const mockApi = jest.fn().mockImplementation(() => {
          return new Promise((resolve) => {
            setTimeout(() => {
              results.push(`api-${i}`)
              resolve(`result-${i}`)
            }, 100)
          })
        })
        
        promises.push(apiLimit.add(mockApi))
      }

      await Promise.all(promises)
      
      // 验证所有API都被执行了
      expect(results).toHaveLength(3)
      expect(results).toContain('api-0')
      expect(results).toContain('api-1')
      expect(results).toContain('api-2')
    })

    test('应该按顺序执行超过限制的API', async () => {
      const executionOrder: number[] = []
      const promises: Promise<any>[] = []
      
      // 创建4个API调用，限制为2个并发
      for (let i = 0; i < 4; i++) {
        const mockApi = jest.fn().mockImplementation(() => {
          return new Promise((resolve) => {
            executionOrder.push(i)
            setTimeout(() => resolve(`result-${i}`), 50)
          })
        })
        
        promises.push(apiLimit.add(mockApi))
      }

      await Promise.all(promises)
      
      // 前两个应该立即执行，后两个应该等待
      expect(executionOrder.slice(0, 2)).toEqual([0, 1])
      expect(executionOrder.slice(2)).toEqual([2, 3])
    })
  })

  describe('队列管理测试', () => {
    test('应该正确管理执行队列', async () => {
      const mockApi1 = jest.fn().mockResolvedValue('result1')
      const mockApi2 = jest.fn().mockResolvedValue('result2')
      
      const promise1 = apiLimit.add(mockApi1)
      const promise2 = apiLimit.add(mockApi2)
      
      expect(apiLimit.executingQueue).toHaveLength(2)
      
      await Promise.all([promise1, promise2])
      
      expect(apiLimit.executingQueue).toHaveLength(0)
    })

    test('应该正确管理订阅队列', async () => {
      const mockApis = [
        jest.fn().mockResolvedValue('result1'),
        jest.fn().mockResolvedValue('result2'),
        jest.fn().mockResolvedValue('result3'),
        jest.fn().mockResolvedValue('result4')
      ]
      
      const promises = mockApis.map(api => apiLimit.add(api))
      
      // 前两个应该在执行队列中，后两个应该在订阅队列中
      expect(apiLimit.executingQueue).toHaveLength(2)
      expect(apiLimit.subscribeQueue).toHaveLength(2)
      
      await Promise.all(promises)
      
      expect(apiLimit.executingQueue).toHaveLength(0)
      expect(apiLimit.subscribeQueue).toHaveLength(0)
    })
  })

  describe('错误处理测试', () => {
    test('应该正确处理API执行错误', async () => {
      const errorMessage = 'API执行失败'
      const mockApi = jest.fn().mockRejectedValue(new Error(errorMessage))
      
      await expect(apiLimit.add(mockApi)).rejects.toThrow(errorMessage)
    })

    test('应该正确处理多个API的错误', async () => {
      const mockApi1 = jest.fn().mockResolvedValue('success')
      const mockApi2 = jest.fn().mockRejectedValue(new Error('API2失败'))
      const mockApi3 = jest.fn().mockResolvedValue('success')
      
      const promise1 = apiLimit.add(mockApi1)
      const promise2 = apiLimit.add(mockApi2)
      const promise3 = apiLimit.add(mockApi3)
      
      await expect(promise1).resolves.toBe('success')
      await expect(promise2).rejects.toThrow('API2失败')
      await expect(promise3).resolves.toBe('success')
    })
  })

  describe('事件系统测试', () => {
    test('应该正确触发和监听事件', async () => {
      const mockApi1 = jest.fn().mockResolvedValue('result1')
      const mockApi2 = jest.fn().mockResolvedValue('result2')
      const mockApi3 = jest.fn().mockResolvedValue('result3')
      
      const promise1 = apiLimit.add(mockApi1)
      const promise2 = apiLimit.add(mockApi2)
      const promise3 = apiLimit.add(mockApi3)
      
      await Promise.all([promise1, promise2, promise3])
      
      // 验证事件系统正常工作（通过队列管理间接验证）
      expect(apiLimit.subscribeQueue).toHaveLength(0)
    })
  })

  describe('重置功能测试', () => {
    test('应该正确重置所有状态', async () => {
      const mockApi = jest.fn().mockResolvedValue('result')
      
      // 添加一些API到队列中
      apiLimit.add(mockApi)
      
      // 重置
      apiLimit.reset()
      
      expect(apiLimit.executingQueue).toEqual([])
      expect(apiLimit.subscribeQueue).toEqual([])
      expect(apiLimit.count).toBe(0)
    })

    test('重置后应该重新开始工作', async () => {
      const mockApi = jest.fn().mockResolvedValue('result')
      
      // 重置
      apiLimit.reset()
      
      // 重新添加API
      const result = await apiLimit.add(mockApi)
      
      expect(result).toBe('result')
      expect(mockApi).toHaveBeenCalledTimes(1)
    })
  })

  describe('边界情况测试', () => {
    test('应该处理并发限制为1的情况', async () => {
      const singleLimit = new ApiLimitControl(1)
      const executionOrder: number[] = []
      
      const promises = [0, 1, 2, 3].map(i => {
        const mockApi = jest.fn().mockImplementation(() => {
          return new Promise((resolve) => {
            executionOrder.push(i)
            setTimeout(() => resolve(`result-${i}`), 50)
          })
        })
        return singleLimit.add(mockApi)
      })
      
      await Promise.all(promises)
      
      // 应该按顺序执行
      expect(executionOrder).toEqual([0, 1, 2, 3])
    })

    test('应该处理大量API调用', async () => {
      const largeLimit = new ApiLimitControl(10)
      const mockApis = Array.from({ length: 20 }, (_, i) => 
        jest.fn().mockResolvedValue(`result-${i}`)
      )
      
      const promises = mockApis.map(api => largeLimit.add(api))
      const results = await Promise.all(promises)
      
      expect(results).toHaveLength(20)
      results.forEach((result, index) => {
        expect(result).toBe(`result-${index}`)
      })
    })

    test('应该处理异步API的长时间执行', async () => {
      const longRunningApi = jest.fn().mockImplementation(() => {
        return new Promise((resolve) => {
          setTimeout(() => resolve('long-result'), 200)
        })
      })
      
      const quickApi = jest.fn().mockResolvedValue('quick-result')
      
      const longPromise = apiLimit.add(longRunningApi)
      const quickPromise = apiLimit.add(quickApi)
      
      const [longResult, quickResult] = await Promise.all([longPromise, quickPromise])
      
      expect(longResult).toBe('long-result')
      expect(quickResult).toBe('quick-result')
    })
  })

  describe('CustomEvents 内部类测试', () => {
    test('应该正确注册和触发事件', () => {
      const events = new (apiLimit as any).constructor(2).events
      const listener = jest.fn()
      
      events.on('test-event', listener)
      events.emit('test-event')
      
      expect(listener).toHaveBeenCalledTimes(1)
    })

    test('应该正确移除事件监听器', () => {
      const events = new (apiLimit as any).constructor(2).events
      const listener = jest.fn()
      
      events.on('test-event', listener)
      events.off('test-event', listener)
      events.emit('test-event')
      
      expect(listener).not.toHaveBeenCalled()
    })

    test('应该支持一次性事件监听器', () => {
      const events = new (apiLimit as any).constructor(2).events
      const listener = jest.fn()
      
      events.once('test-event', listener)
      events.emit('test-event')
      events.emit('test-event')
      
      expect(listener).toHaveBeenCalledTimes(1)
    })
  })
}) 