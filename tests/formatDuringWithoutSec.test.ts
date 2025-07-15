import formatDuringWithoutSec from '../src/date/formatDuringWithoutSec'

describe('formatDuringWithoutSec', () => {
  describe('基础功能测试', () => {
    test('应该正确格式化1天', () => {
      const oneDay = 24 * 60 * 60 * 1000 // 1天
      const result = formatDuringWithoutSec(oneDay)
      expect(result).toEqual({ d: 1, h: 0, m: 0 })
    })

    test('应该正确格式化1小时', () => {
      const oneHour = 60 * 60 * 1000 // 1小时
      const result = formatDuringWithoutSec(oneHour)
      expect(result).toEqual({ d: 0, h: 1, m: 0 })
    })

    test('应该正确格式化1分钟', () => {
      const oneMinute = 60 * 1000 // 1分钟
      const result = formatDuringWithoutSec(oneMinute)
      expect(result).toEqual({ d: 0, h: 0, m: 1 })
    })

    test('应该正确格式化1秒（应该显示为0分钟）', () => {
      const oneSecond = 1000 // 1秒
      const result = formatDuringWithoutSec(oneSecond)
      expect(result).toEqual({ d: 0, h: 0, m: 0 })
    })
  })

  describe('复合时间测试', () => {
    test('应该正确格式化2天3小时45分钟', () => {
      const time = 2 * 24 * 60 * 60 * 1000 + // 2天
                   3 * 60 * 60 * 1000 +       // 3小时
                   45 * 60 * 1000             // 45分钟
      const result = formatDuringWithoutSec(time)
      expect(result).toEqual({ d: 2, h: 3, m: 45 })
    })

    test('应该正确格式化12小时30分钟', () => {
      const time = 12 * 60 * 60 * 1000 + // 12小时
                   30 * 60 * 1000         // 30分钟
      const result = formatDuringWithoutSec(time)
      expect(result).toEqual({ d: 0, h: 12, m: 30 })
    })

    test('应该正确格式化23小时59分钟', () => {
      const time = 23 * 60 * 60 * 1000 + // 23小时
                   59 * 60 * 1000         // 59分钟
      const result = formatDuringWithoutSec(time)
      expect(result).toEqual({ d: 0, h: 23, m: 59 })
    })

    test('应该正确格式化1天23小时59分钟', () => {
      const time = 1 * 24 * 60 * 60 * 1000 + // 1天
                   23 * 60 * 60 * 1000 +      // 23小时
                   59 * 60 * 1000             // 59分钟
      const result = formatDuringWithoutSec(time)
      expect(result).toEqual({ d: 1, h: 23, m: 59 })
    })
  })

  describe('边界情况测试', () => {
    test('应该处理0毫秒', () => {
      const result = formatDuringWithoutSec(0)
      expect(result).toEqual({ d: 0, h: 0, m: 0 })
    })

    test('应该处理小于1分钟的毫秒数', () => {
      const result = formatDuringWithoutSec(30 * 1000) // 30秒
      expect(result).toEqual({ d: 0, h: 0, m: 0 })
    })

    test('应该处理小于1小时的毫秒数', () => {
      const result = formatDuringWithoutSec(30 * 60 * 1000) // 30分钟
      expect(result).toEqual({ d: 0, h: 0, m: 30 })
    })

    test('应该处理小于1天的毫秒数', () => {
      const result = formatDuringWithoutSec(12 * 60 * 60 * 1000) // 12小时
      expect(result).toEqual({ d: 0, h: 12, m: 0 })
    })

    test('应该处理刚好1天的毫秒数', () => {
      const result = formatDuringWithoutSec(24 * 60 * 60 * 1000)
      expect(result).toEqual({ d: 1, h: 0, m: 0 })
    })

    test('应该处理刚好1小时的毫秒数', () => {
      const result = formatDuringWithoutSec(60 * 60 * 1000)
      expect(result).toEqual({ d: 0, h: 1, m: 0 })
    })

    test('应该处理刚好1分钟的毫秒数', () => {
      const result = formatDuringWithoutSec(60 * 1000)
      expect(result).toEqual({ d: 0, h: 0, m: 1 })
    })
  })

  describe('大数值测试', () => {
    test('应该处理多天的时间', () => {
      const time = 7 * 24 * 60 * 60 * 1000 + // 7天
                   12 * 60 * 60 * 1000 +      // 12小时
                   30 * 60 * 1000             // 30分钟
      const result = formatDuringWithoutSec(time)
      expect(result).toEqual({ d: 7, h: 12, m: 30 })
    })

    test('应该处理30天的时间', () => {
      const time = 30 * 24 * 60 * 60 * 1000 // 30天
      const result = formatDuringWithoutSec(time)
      expect(result).toEqual({ d: 30, h: 0, m: 0 })
    })

    test('应该处理365天的时间', () => {
      const time = 365 * 24 * 60 * 60 * 1000 // 365天
      const result = formatDuringWithoutSec(time)
      expect(result).toEqual({ d: 365, h: 0, m: 0 })
    })
  })

  describe('精度测试', () => {
    test('应该忽略秒数，只保留分钟', () => {
      const time = 1 * 60 * 60 * 1000 + // 1小时
                   30 * 60 * 1000 +      // 30分钟
                   45 * 1000              // 45秒
      const result = formatDuringWithoutSec(time)
      expect(result).toEqual({ d: 0, h: 1, m: 30 })
    })

    test('应该忽略毫秒数', () => {
      const time = 1 * 60 * 60 * 1000 + // 1小时
                   30 * 60 * 1000 +      // 30分钟
                   500                    // 500毫秒
      const result = formatDuringWithoutSec(time)
      expect(result).toEqual({ d: 0, h: 1, m: 30 })
    })

    test('应该正确处理59分59秒（应该显示为59分钟）', () => {
      const time = 59 * 60 * 1000 + // 59分钟
                   59 * 1000         // 59秒
      const result = formatDuringWithoutSec(time)
      expect(result).toEqual({ d: 0, h: 0, m: 59 })
    })

    test('应该正确处理59小时59分59秒（应该显示为2天11小时59分钟）', () => {
      const time = 59 * 60 * 60 * 1000 + // 59小时
                   59 * 60 * 1000 +       // 59分钟
                   59 * 1000               // 59秒
      const result = formatDuringWithoutSec(time)
      expect(result).toEqual({ d: 2, h: 11, m: 59 })
    })
  })

  describe('实际应用场景测试', () => {
    test('模拟倒计时场景', () => {
      const countdown = 2 * 24 * 60 * 60 * 1000 + // 2天
                       15 * 60 * 60 * 1000 +       // 15小时
                       30 * 60 * 1000              // 30分钟
      const result = formatDuringWithoutSec(countdown)
      expect(result).toEqual({ d: 2, h: 15, m: 30 })
    })

    test('模拟视频时长格式化', () => {
      const videoDuration = 2 * 60 * 60 * 1000 + // 2小时
                           45 * 60 * 1000         // 45分钟
      const result = formatDuringWithoutSec(videoDuration)
      expect(result).toEqual({ d: 0, h: 2, m: 45 })
    })

    test('模拟任务剩余时间', () => {
      const remainingTime = 5 * 60 * 60 * 1000 + // 5小时
                           20 * 60 * 1000         // 20分钟
      const result = formatDuringWithoutSec(remainingTime)
      expect(result).toEqual({ d: 0, h: 5, m: 20 })
    })

    test('模拟会议时长', () => {
      const meetingDuration = 1 * 60 * 60 * 1000 + // 1小时
                             30 * 60 * 1000         // 30分钟
      const result = formatDuringWithoutSec(meetingDuration)
      expect(result).toEqual({ d: 0, h: 1, m: 30 })
    })
  })

  describe('负数测试', () => {
    test('应该处理负数（返回0值）', () => {
      const result = formatDuringWithoutSec(-1000)
      expect(result).toEqual({ d: 0, h: 0, m: 0 })
    })

    test('应该处理大的负数', () => {
      const result = formatDuringWithoutSec(-24 * 60 * 60 * 1000)
      expect(result).toEqual({ d: 0, h: 0, m: 0 })
    })
  })

  describe('小数测试', () => {
    test('应该正确处理小数值', () => {
      const time = 1.5 * 60 * 60 * 1000 // 1.5小时
      const result = formatDuringWithoutSec(time)
      expect(result).toEqual({ d: 0, h: 1, m: 30 })
    })

    test('应该正确处理带小数的天数', () => {
      const time = 1.5 * 24 * 60 * 60 * 1000 // 1.5天
      const result = formatDuringWithoutSec(time)
      expect(result).toEqual({ d: 1, h: 12, m: 0 })
    })
  })

  describe('极限值测试', () => {
    test('应该处理非常大的数值', () => {
      const time = 1000 * 24 * 60 * 60 * 1000 // 1000天
      const result = formatDuringWithoutSec(time)
      expect(result).toEqual({ d: 1000, h: 0, m: 0 })
    })

    test('应该处理接近整数边界的时间', () => {
      const time = 24 * 60 * 60 * 1000 - 1 // 差1毫秒到1天
      const result = formatDuringWithoutSec(time)
      expect(result).toEqual({ d: 0, h: 23, m: 59 })
    })

    test('应该处理刚好超过整数边界的时间', () => {
      const time = 24 * 60 * 60 * 1000 + 1 // 超过1天1毫秒
      const result = formatDuringWithoutSec(time)
      expect(result).toEqual({ d: 1, h: 0, m: 0 }) // 由于精度问题，小时数可能为0
    })
  })

  describe('类型安全测试', () => {
    test('应该正确处理number类型', () => {
      const time: number = 3600000 // 1小时
      const result = formatDuringWithoutSec(time)
      expect(result).toEqual({ d: 0, h: 1, m: 0 })
    })

    test('应该返回正确的对象结构', () => {
      const result = formatDuringWithoutSec(3600000)
      expect(typeof result.d).toBe('number')
      expect(typeof result.h).toBe('number')
      expect(typeof result.m).toBe('number')
      expect(result.d).toBeGreaterThanOrEqual(0)
      expect(result.h).toBeGreaterThanOrEqual(0)
      expect(result.m).toBeGreaterThanOrEqual(0)
    })
  })
}) 