/**
 * 过滤对象中的空值
 * @param obj 要过滤的对象
 * @returns 过滤后的对象
 */
const filterEmptyValue = <T extends Record<string, any>>(obj?: T | null): Partial<T> => {
  if (!obj) return {} as Partial<T>
  
  return Object.entries(obj).reduce((acc, [key, value]) => {
    // 如果值是数组且只包含一个空字符串，则跳过该属性
    if (Array.isArray(value) && value.length === 1 && ['', null, undefined].includes(value[0])) {
      return acc
    }
    
    // 保留其他非空值
    if (value !== null && value !== undefined && value !== '') {
      acc[key as keyof T] = value
    }
    
    return acc
  }, {} as Partial<T>)
}

export default filterEmptyValue 