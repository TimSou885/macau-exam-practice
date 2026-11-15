const formatter = new Intl.DateTimeFormat('zh-Hant-MO', {
  timeZone: 'Asia/Macau',
  month: 'numeric',
  day: 'numeric',
  hour: '2-digit',
  minute: '2-digit',
  hourCycle: 'h23',
})

/** Format a timestamp for learners in Macau (UTC+8). */
export function formatMacau(timestamp) {
  return `${formatter.format(new Date(timestamp))}（澳門時間）`
}
