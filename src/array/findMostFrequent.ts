// 找出数组中重复最多的值
export const findMostFrequent = <T,>(arr: T[]): T | null => {
  if (arr.length === 0) {
    return null
  }

  const frequency = new Map<T, number>()
  let maxFreq = 0
  let mostFrequent: T = arr[0]

  // 统计每个元素的频率
  for (const item of arr) {
    const count = (frequency.get(item) || 0) + 1
    frequency.set(item, count)
    
    if (count > maxFreq) {
      maxFreq = count
      mostFrequent = item
    }
  }

  return mostFrequent
}