/**
 * 430 統考範例題目（可擴充為從 API 或更多 JSON 載入）
 */
export const questions430 = [
  {
    id: '430-law-1',
    examType: '430',
    category: 'law',
    question: '根據《澳門特別行政區基本法》，澳門特別行政區享有下列哪項權力？',
    options: [
      { key: 'A', text: '外交權' },
      { key: 'B', text: '行政管理權' },
      { key: 'C', text: '國防權' },
      { key: 'D', text: '終審權僅限於最高人民法院' },
    ],
    correctKey: 'B',
    explanation: '根據基本法，澳門特別行政區享有行政管理權、立法權、獨立的司法權和終審權，外交與國防由中央人民政府負責。',
  },
  {
    id: '430-law-2',
    examType: '430',
    category: 'law',
    question: '《澳門公共行政工作人員通則》規定，一般職程的晉級開考屬下列何種性質？',
    options: [
      { key: 'A', text: '對外開考' },
      { key: 'B', text: '對內開考' },
      { key: 'C', text: '限制性開考' },
      { key: 'D', text: '入職開考' },
    ],
    correctKey: 'B',
    explanation: '晉級開考通常屬對內開考，僅限現職人員報考。',
  },
  {
    id: '430-math-1',
    examType: '430',
    category: 'math',
    question: '若 2x + 5 = 15，則 x = ?',
    options: [
      { key: 'A', text: '3' },
      { key: 'B', text: '5' },
      { key: 'C', text: '7' },
      { key: 'D', text: '10' },
    ],
    correctKey: 'B',
    explanation: '2x = 15 - 5 = 10，故 x = 5。',
  },
  {
    id: '430-math-2',
    examType: '430',
    category: 'math',
    question: '某部門預算 180 萬元，已使用 45%。尚餘預算多少萬元？',
    options: [
      { key: 'A', text: '81' },
      { key: 'B', text: '99' },
      { key: 'C', text: '135' },
      { key: 'D', text: '90' },
    ],
    correctKey: 'B',
    explanation: '已用 180 × 0.45 = 81 萬，尚餘 180 - 81 = 99 萬元。',
  },
  {
    id: '430-logic-1',
    examType: '430',
    category: 'logic',
    question: '數列：2, 5, 11, 23, 47, ? 下一項應為？',
    options: [
      { key: 'A', text: '91' },
      { key: 'B', text: '93' },
      { key: 'C', text: '95' },
      { key: 'D', text: '97' },
    ],
    correctKey: 'C',
    explanation: '規律為前一項 × 2 + 1，47 × 2 + 1 = 95。',
  },
  {
    id: '430-reading-1',
    examType: '430',
    category: 'reading',
    question: '「公務員須依法辦事，不得徇私。」句中「徇私」之意最接近：',
    options: [
      { key: 'A', text: '公正無私' },
      { key: 'B', text: '因私情而偏袒' },
      { key: 'C', text: '公開透明' },
      { key: 'D', text: '依法裁量' },
    ],
    correctKey: 'B',
    explanation: '「徇私」指為私情而偏袒、不公正。',
  },
]
