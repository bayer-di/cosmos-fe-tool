/**
 * 异步请求工具
 */
export interface AsyncFetchHooks {
  loadingAction?: string;
  onRequest?: () => void;
  onSuccess?: (response: any) => void;
  onError?: (errorMessage: string) => void;
  onFinish?: () => void;
}

export interface MessageInstance {
  loading?: (message: string) => (() => void) | null;
  success?: (message: string) => void;
  error?: (message: string) => void;
}

const asyncFetch = async (
  callApi: () => Promise<any>,
  hooks: AsyncFetchHooks = {},
  messageInstance?: MessageInstance
): Promise<boolean> => {
  const {
    loadingAction,
    onRequest,
    onSuccess,
    onError = (errorMessage: string) => {
      messageInstance?.error?.(errorMessage)
    },
    onFinish,
  } = hooks
  
  let messageLoadingDestroyer: (() => void) | null = null
  
  try {
    if (loadingAction && messageInstance?.loading) {
      messageLoadingDestroyer = messageInstance.loading(`正在${loadingAction}...`)
    }
    
    onRequest?.()
    const response = await callApi()
    onSuccess?.(response)
    
    if (loadingAction && messageInstance?.success) {
      messageInstance.success(`${loadingAction}成功~`)
    }
    
    return true
  } catch (e: any) {
    const errorMessage = typeof e === 'string' ? e : e?.message?.replace('Error: ', '') || '出错了'
    onError?.(errorMessage)
  } finally {
    messageLoadingDestroyer?.()
    onFinish?.()
  }
  
  return false
}

export default asyncFetch 