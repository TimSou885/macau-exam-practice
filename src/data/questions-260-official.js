/**
 * 260 綜合能力評估考試題目
 * 來源：Scribd「260綜合能力評估考試」共 34 頁
 * https://www.scribd.com/document/708054220/260綜合能力評估考試
 *
 * 匯入方式：請從上述連結下載或複製題目內容後，
 * 依下列格式逐題加入下方陣列。每題需：id、examType、category、question、options、correctKey、explanation（可選）。
 * 若題目為法律類可填 'law'，數學 'math'，圖表 'chart'，邏輯 'logic'，閱讀 'reading'。
 */
function q(uid, question, options, correctKey, explanation, category = 'law') {
  return {
    id: `260-official-${uid}`,
    examType: '260',
    category, // 'law' | 'math' | 'chart' | 'logic' | 'reading'
    question,
    options: options.map((t, i) => ({ key: String.fromCharCode(65 + i), text: t })),
    correctKey,
    explanation: explanation || '',
  }
}

export const questions260Official = [
  // 範例（可刪除）：若 PDF 題型為「下列何者正確？ A.… B.… C.… D.…」答案 B，則寫：
  // q(1, '下列何者正確？', ['選項A', '選項B', '選項C', '選項D'], 'B', '解析（可省略）'),
  //
  // 請從第 1 頁起依序加入 34 頁題目，例如：
  // q(1, '題幹…', ['A內容', 'B內容', 'C內容', 'D內容'], 'A', '條文或解析'),
  // q(2, '題幹…', ['A內容', 'B內容', 'C內容', 'D內容'], 'C', ''),
  // …
]
