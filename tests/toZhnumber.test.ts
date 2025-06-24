/* eslint-env jest */
import { describe, it, expect } from '@jest/globals'
import {
  toZhNumber,
  strToNumber,
  formatMaxDigitalToZNumber,
  getDoubleValue,
  strToZNumber,
  toNumberInt
} from '../src/number/toZhnumber'

describe('toZhNumber', () => {
  it('正常数字转千分位', () => {
    expect(toZhNumber(1234567.89)).toBe('1,234,567.89')
    expect(toZhNumber(1000)).toBe('1,000.00')
    expect(toZhNumber(1000, 0)).toBe('1,000')
  })
  it('小数位数控制', () => {
    expect(toZhNumber(1234.5678, 3)).toBe('1,234.568')
    expect(toZhNumber(1234.5, 2, 2)).toBe('1,234.50')
    expect(toZhNumber(1234, 0)).toBe('1,234')
  })
  it('非法输入返回原值', () => {
    expect(toZhNumber(NaN)).toBe(NaN)
    expect(toZhNumber(undefined as any)).toBe(undefined)
    expect(toZhNumber(null as any)).toBe('0.00')
  })
})

describe('strToNumber', () => {
  it('字符串转数字', () => {
    expect(strToNumber('123')).toBe(123)
    expect(strToNumber('123.45')).toBe(123.45)
  })
  it('空字符串/undefined/null', () => {
    expect(strToNumber('')).toBe(0)
    expect(strToNumber(undefined)).toBe(undefined)
    expect(strToNumber(null)).toBe(null)
  })
  it('非法字符串', () => {
    expect(strToNumber('abc')).toBe('abc')
    expect(strToNumber('abc', true, 99)).toBe(99)
  })
  it('isDefault=true 返回默认值', () => {
    expect(strToNumber(undefined, true, 5)).toBe(5)
    expect(strToNumber(null, true, 7)).toBe(7)
    expect(strToNumber('abc', true, 8)).toBe(8)
  })
})

describe('formatMaxDigitalToZNumber', () => {
  it('正常数字', () => {
    expect(formatMaxDigitalToZNumber(1234.5678)).toBe('1,234.568')
    expect(formatMaxDigitalToZNumber(1234.5, 2, 2)).toBe('1,234.50')
  })
  it('空值返回 -', () => {
    expect(formatMaxDigitalToZNumber(undefined as any)).toBe('-')
    expect(formatMaxDigitalToZNumber(null as any)).toBe('-')
  })
})

describe('getDoubleValue', () => {
  it('正常数字', () => {
    expect(getDoubleValue(1234.5678)).toBe('1,234.57')
    expect(getDoubleValue(1234, 0)).toBe('1,234')
  })
  it('空值返回 -', () => {
    expect(getDoubleValue(undefined as any)).toBe('-')
    expect(getDoubleValue(null as any)).toBe('-')
  })
})

describe('strToZNumber', () => {
  it('字符串转千分位', () => {
    expect(strToZNumber('1234567.89')).toBe('1,234,567.89')
    expect(strToZNumber('1234.5', { minDigital: 2, maxDigital: 2 })).toBe('1,234.50')
  })
  it('非法字符串', () => {
    expect(strToZNumber('abc')).toBe('abc')
  })
})

describe('toNumberInt', () => {
  it('整数千分位', () => {
    expect(toNumberInt(1234567)).toBe('1,234,567')
    expect(toNumberInt(0)).toBe('0')
  })
}) 