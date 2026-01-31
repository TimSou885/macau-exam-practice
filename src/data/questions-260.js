/**
 * 260 統考範例題目
 */
export const questions260 = [
  {
    id: '260-law-1',
    examType: '260',
    category: 'law',
    question: '澳門特別行政區的官方語文為？',
    options: [
      { key: 'A', text: '僅中文' },
      { key: 'B', text: '僅葡文' },
      { key: 'C', text: '中文和葡文' },
      { key: 'D', text: '中文、葡文和英文' },
    ],
    correctKey: 'C',
    explanation: '根據《基本法》第九條，澳門特別行政區的行政機關、立法機關和司法機關除使用中文外，還可使用葡文，葡文也是正式語文。',
  },
  {
    id: '260-math-1',
    examType: '260',
    category: 'math',
    question: '一份文件共 24 頁，每頁平均 350 字。全文約多少字？',
    options: [
      { key: 'A', text: '7200' },
      { key: 'B', text: '8400' },
      { key: 'C', text: '9600' },
      { key: 'D', text: '10800' },
    ],
    correctKey: 'B',
    explanation: '24 × 350 = 8400 字。',
  },
  {
    id: '260-logic-1',
    examType: '260',
    category: 'logic',
    question: '若「所有 A 都是 B」且「有些 B 是 C」，則可確定：',
    options: [
      { key: 'A', text: '所有 A 都是 C' },
      { key: 'B', text: '有些 A 可能是 C' },
      { key: 'C', text: '所有 B 都是 A' },
      { key: 'D', text: '有些 C 不是 B' },
    ],
    correctKey: 'B',
    explanation: '由「所有 A 都是 B」與「有些 B 是 C」，只能推得「有些 A 可能是 C」，無法推出「所有 A 都是 C」。',
  },
  {
    id: '260-reading-1',
    examType: '260',
    category: 'reading',
    question: '「本局收到申請後，將於法定期限內作出決定。」「法定期限」意指：',
    options: [
      { key: 'A', text: '申請人自訂的期限' },
      { key: 'B', text: '法律規定的期限' },
      { key: 'C', text: '行政長官指定的期限' },
      { key: 'D', text: '無固定期限' },
    ],
    correctKey: 'B',
    explanation: '「法定期限」指法律所規定的期限。',
  },
  {
    id: '260-chart-1',
    examType: '260',
    category: 'chart',
    question: '某表格欄位依序為：日期、部門、數量、備註。若要依「數量」由高至低排序，應以哪一欄為準？',
    options: [
      { key: 'A', text: '日期' },
      { key: 'B', text: '部門' },
      { key: 'C', text: '數量' },
      { key: 'D', text: '備註' },
    ],
    correctKey: 'C',
    explanation: '由高至低排序應以「數量」欄為排序鍵。',
  },
]
