/* eslint-env jest */
import { describe, it, expect } from '@jest/globals'
import filterEmptyValue from '../src/object/filterEmptyValue'

describe('filterEmptyValue', () => {
  it('should filter out null, undefined and empty string values', () => {
    const input = {
      name: '张三',
      age: 25,
      email: '',
      address: null,
      phone: undefined,
      tags: ['tag1', 'tag2']
    }
    
    const expected = {
      name: '张三',
      age: 25,
      tags: ['tag1', 'tag2']
    }
    
    expect(filterEmptyValue(input)).toEqual(expected)
  })
  
  it('should filter out array with single empty string', () => {
    const input = {
      name: '张三',
      tags: [''],
      categories: ['cat1', '']
    }
    
    const expected = {
      name: '张三',
      categories: ['cat1', '']
    }
    
    expect(filterEmptyValue(input)).toEqual(expected)
  })
  
  it('should return empty object for null input', () => {
    expect(filterEmptyValue(null)).toEqual({})
  })
  
  it('should return empty object for undefined input', () => {
    expect(filterEmptyValue(undefined)).toEqual({})
  })

  it('should filter empty values', () => {
    const obj = { a: 1, b: '', c: null, d: undefined, e: [""] }
    const result = filterEmptyValue(obj)
    expect(result).toEqual({ a: 1 })
  })
}) 