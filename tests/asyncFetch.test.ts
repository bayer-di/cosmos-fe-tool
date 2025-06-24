/* eslint-env jest */
import { describe, it, expect, jest } from '@jest/globals'
import asyncFetch from '../src/async'

describe('asyncFetch', () => {
  it('should handle successful API call', async () => {
    const mockApi = jest.fn().mockResolvedValue({ data: 'success' })
    const mockMessage = {
      loading: jest.fn().mockReturnValue(() => {}),
      success: jest.fn()
    }
    
    const hooks = {
      loadingAction: '测试',
      onSuccess: jest.fn(),
      onError: jest.fn()
    }
    
    const result = await asyncFetch(mockApi, hooks, mockMessage)
    
    expect(result).toBe(true)
    expect(mockApi).toHaveBeenCalled()
    expect(hooks.onSuccess).toHaveBeenCalledWith({ data: 'success' })
    expect(mockMessage.success).toHaveBeenCalledWith('测试成功~')
  })
  
  it('should handle API call error', async () => {
    const mockApi = jest.fn().mockRejectedValue(new Error('API Error'))
    const mockMessage = {
      loading: jest.fn().mockReturnValue(() => {}),
      error: jest.fn()
    }
    
    const hooks = {
      loadingAction: '测试',
      onError: jest.fn()
    }
    
    const result = await asyncFetch(mockApi, hooks, mockMessage)
    
    expect(result).toBe(false)
    expect(hooks.onError).toHaveBeenCalledWith('API Error')
  })

  it('should return true on success', async () => {
    const callApi = jest.fn().mockResolvedValue('ok')
    const hooks = {
      onSuccess: jest.fn(),
      onError: jest.fn()
    }
    const mockMessage = {
      loading: jest.fn(() => jest.fn()),
      success: jest.fn(),
      error: jest.fn(),
    }
    const result = await asyncFetch(callApi, hooks, mockMessage)
    expect(result).toBe(true)
    expect(hooks.onSuccess).toHaveBeenCalledWith('ok')
  })
}) 