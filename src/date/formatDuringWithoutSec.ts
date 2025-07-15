/**
 * 将毫秒格式化为天、时、分
 * @param t 毫秒
 * @returns 格式化后的时间字符串
 */
const formatDuringWithoutSec = (t: number): { d: number; h: number; m: number } => {
  if (t <= 0) return { d: 0, h: 0, m: 0 }
  const hour = 1000 * 60 * 60
  const d = Math.floor(t / (hour * 24))
  const h = Math.floor((t % (hour * 24)) / hour)
  const m = Math.floor((t % hour) / (1000 * 60))
  return { d, h, m }
}

export default formatDuringWithoutSec 