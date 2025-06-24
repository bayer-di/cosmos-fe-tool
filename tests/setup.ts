// 测试环境设置

// 设置测试超时时间
jest.setTimeout(10000)

// 全局测试配置
global.console = {
  ...console,
  // 在测试中忽略某些 console 输出
  log: jest.fn(),
  debug: jest.fn(),
  info: jest.fn(),
  warn: jest.fn(),
  error: jest.fn(),
}

// 模拟 fetch API（如果不存在）
if (typeof global.fetch === 'undefined') {
  global.fetch = jest.fn()
}

// 清理所有模拟
afterEach(() => {
  jest.clearAllMocks()
}) 