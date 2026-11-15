/**
 * Practice percentage versus the official 430 paper (about 58 questions, 50/100).
 * Short drills must not be described as an exam pass.
 *
 * @param {{ correct: number, total: number }} input
 */
export function practiceScoreSummary({ correct, total }) {
  const safeTotal = Number(total) || 0
  const safeCorrect = Number(correct) || 0
  const score = safeTotal > 0 ? Math.round((safeCorrect / safeTotal) * 100) : 0
  const nearOfficialLength = safeTotal >= 40 && safeTotal <= 80
  const passed = score >= 50

  let headline = '尚無作答紀錄'
  if (safeTotal > 0 && nearOfficialLength && passed) {
    headline = '這一輪正確率達到 50% 合格參考'
  } else if (safeTotal > 0 && nearOfficialLength) {
    headline = '這一輪正確率未到 50% 合格參考'
  } else if (safeTotal > 0) {
    headline = `這一輪正確率 ${score}%`
  }

  const detail = nearOfficialLength
    ? '題量接近 430 筆試約 58 題。正式合格標準以公職局公告為準。'
    : '這是這一輪的正確率。正式 430 約 58 題、滿分 100、50 分合格；題數不同時，不要把這個百分比當成開考成績。'

  return { score, passed, headline, detail, nearOfficialLength }
}
