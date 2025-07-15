class CustomEvents {
  eventMap: Record<string, ((...args: any[]) => void)[]>

  constructor() {
    this.eventMap = {}
  }

  on(type: string, listener: (...args: any[]) => void) {
    this.eventMap[type] = (this.eventMap[type] || []).concat(listener)
  }

  emit(type: string) {
    if (!this.eventMap[type]) return
    this.eventMap[type].forEach((listener) => {
      listener()
    })
  }

  off(type: string, listener: (...args: any[]) => void) {
    if (!this.eventMap[type]) return
    this.eventMap[type] = this.eventMap[type].filter((fn) => fn !== listener)
  }
  once(type: string, listener: (...args: any[]) => void) {
    const handler = () => {
      listener()
      this.off(type, handler)
    }
    this.on(type, handler)
  }
}

export default class ApiLimitControl {
  limit: number
  executingQueue: any[]
  subscribeQueue: [string, (...args: any[]) => Promise<any>][]
  events: CustomEvents
  count: number

  constructor(limit: number) {
    this.count = 0
    this.limit = limit
    // 执行队列
    this.executingQueue = []
    // 订阅队列
    this.subscribeQueue = []

    this.events = new CustomEvents()
  }

  async add(apiFn: () => Promise<any>) {
    if (this.executingQueue.length < this.limit) {
      this.addExecuteQueue(apiFn)
      return await this.executeApi(apiFn, () => this.removeExecuteQueue(apiFn))
    }
    // 注册订阅
    const subscribeId = this.registerSubscribe(apiFn)
    return await this.execute(subscribeId)
  }

  async executeApi(apiFn: () => Promise<any>, finalCb?: () => void) {
    try {
      return await apiFn()
    // eslint-disable-next-line no-useless-catch
    } catch (e) {
      throw e
    } finally {
      if (finalCb) finalCb()
    }
  }

  addExecuteQueue(apiFn: () => Promise<any>) {
    this.executingQueue.push(apiFn)
  }

  removeExecuteQueue(apiFn: () => Promise<any>) {
    this.executingQueue = this.executingQueue.filter((fn) => fn !== apiFn)
    const next = this.subscribeQueue[0]
    if (!next) return
    this.events.emit(`api-${next[0]}`)
  }

  execute(subscribeId: string) {
    return new Promise((resolve) => {
      this.events.once(`api-${subscribeId}`, () => {
        const apiFnIndex = this.subscribeQueue.findIndex(([subId]) => subId === subscribeId)
        this.add(this.subscribeQueue[apiFnIndex][1]).then(resolve)
        this.removeSubscribe(apiFnIndex)
      })
    })
  }

  registerSubscribe(apiFn: () => Promise<any>) {
    this.count += 1
    const subscribeId = `${Math.random()}-${this.count}`
    this.subscribeQueue.push([subscribeId, apiFn])
    return subscribeId
  }

  removeSubscribe(index: number) {
    if (index < 0) return
    this.subscribeQueue.splice(index, 1)
  }

  reset() {
    this.events = new CustomEvents()
    this.subscribeQueue = []
    this.executingQueue = []
  }
}
