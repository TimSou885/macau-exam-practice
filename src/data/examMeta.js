/**
 * 澳門政府 430 / 260 統考資訊
 * 430：學士學位程度綜合能力評估（高級技術員薪俸點）
 * 260：技術員等職程綜合能力評估
 */
export const EXAM_TYPES = {
  '430': {
    id: '430',
    name: '430 統考',
    fullName: '學士學位程度綜合能力評估開考',
    description: '高級技術員薪俸點水平，筆試 1.5 小時，約 58 題，滿分 100，50 分合格。',
    categories: [
      { id: 'law', name: '法律' },
      { id: 'math', name: '數學' },
      { id: 'chart', name: '圖表分析' },
      { id: 'logic', name: '推理邏輯' },
      { id: 'reading', name: '閱讀理解' },
    ],
  },
  '260': {
    id: '260',
    name: '260 統考',
    fullName: '技術員程度綜合能力評估開考',
    description: '技術員、技術輔導員等職程，題型涵蓋邏輯、語文、數學與常識。',
    categories: [
      { id: 'law', name: '法律' },
      { id: 'math', name: '數學' },
      { id: 'chart', name: '圖表分析' },
      { id: 'logic', name: '推理邏輯' },
      { id: 'reading', name: '閱讀理解' },
    ],
  },
}

export const STORAGE_KEYS = {
  wrongAnswers: 'macau-exam-wrong',
  stats: 'macau-exam-stats',
  settings: 'macau-exam-settings',
  reviewSchedule: 'macau-exam-review-schedule',
}

/** 艾賓浩斯遺忘曲線複習間隔（天）：第 1、3、7、15、30 天 */
export const REVIEW_INTERVAL_DAYS = [1, 3, 7, 15, 30]
