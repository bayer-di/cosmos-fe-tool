/**
 * 将毫秒格式化为天、时、分
 * @param t 毫秒
 * @returns 格式化后的时间字符串
 */
const formatDuringWithoutSec = (t: number): string => {
  const hour = 1000 * 60 * 60
  const d = parseInt(`${t / (hour * 24)}`)
  const h = parseInt(`${(t % (hour * 24)) / hour}`)
  const m = parseInt(`${(t % hour) / (1000 * 60)}`)
  // const s = parseInt(`${(t % (1000 * 60)) / 1000}`)

  let text = ''
  if (d) text += `${d}天`
  if (h) text += `${h}小时`
  if (m) text += `${m}分钟`
  // if (s) text += `${s}秒`
  return text || '-'
}

export default formatDuringWithoutSec 