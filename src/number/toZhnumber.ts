import _isNil from 'lodash/isNil'

/**
 * 转成千分位数字
 * @param val 要转换的数字
 * @param maxDigital 最大小数位数，默认2
 * @param minDigital 最小小数位数
 * @returns 转换后的字符串或原值
 */
export const toZhNumber = (
  val: number,
  maxDigital: number = 2,
  minDigital?: number
): string | number => {
  if (isNaN(val)) return val
  try {
    return Number(val).toLocaleString('zh', {
      minimumFractionDigits: minDigital ?? maxDigital,
      maximumFractionDigits: maxDigital,
    })
  } catch {
    return val
  }
}

/**
 * 将字符串安全地转换为数字
 * @param str 要转换的字符串
 * @param isDefault 是否返回默认值，可选参数
 * @param defaultValue 转换失败时返回的默认值，可选参数，默认为0
 * @returns 转换后的数字、原始值或默认值
 */
export const strToNumber = (
  str: string | null | undefined,
  isDefault = false,
  defaultValue = 0,
) => {
  if (_isNil(str)) {
    return isDefault ? defaultValue : str
  }
  const num = Number(str)

  if (isNaN(num)) {
    return isDefault ? defaultValue : str
  }
  return num
}

/**
 * 最多保留<digital>位小数的千分位数字
 * @param val 要转换的数字
 * @param maxDigital 最大小数位数，默认3
 * @param minDigital 最小小数位数，默认0
 * @returns 转换后的千分位数字
 */
export const formatMaxDigitalToZNumber = (val: number, maxDigital = 3, minDigital = 0) => {
  if (_isNil(val)) return '-'
  return toZhNumber(val, maxDigital, minDigital)
}
/**
 * 获取两位小数
 * @param val 要转换的数字
 * @param digital 小数位数，默认2
 * @returns 转换后的千分位数字
 */
export const getDoubleValue = (val: number, digital = 2) => {
  if (_isNil(val)) return '-'
  return toZhNumber(val, digital)
}
/**
 * 将字符串转换为千分位数字
 * @param str 要转换的字符串
 * @param digital 数字配置对象，包含最小小数位数和最大小数位数
 * @returns 转换后的千分位数字
 */
export const strToZNumber = (
  str: string,
  digital = {
    minDigital: 2,
    maxDigital: 2,
  },
) => toZhNumber(strToNumber(str) as number, digital.maxDigital, digital.minDigital)
/** 
 * 千分符保留整数
 * @param val 要转换的数字
 * @returns 转换后的千分位数字
 */
export const toNumberInt = (val: number) => toZhNumber(val, 0)
