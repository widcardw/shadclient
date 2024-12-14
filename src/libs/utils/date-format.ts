/**
 * Get the hour and minute from the seconds
 * @param time the seconds since 1970-01-01T00:00:00
 */
function timeToHourMinute(time: number): string {
  return new Date(time * 1000).toLocaleTimeString('zh-CN', {
    hour: '2-digit',
    minute: '2-digit',
  })
}

export { timeToHourMinute }
