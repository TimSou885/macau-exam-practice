/**
 * 260 統考圖表分析題庫（500 題）
 * 題型：表格總和與平均、佔比與成長率、最高最低差、總額計算、依表查值、表格排序與欄位、Excel/Office 操作等。
 * 正確答案以程式計算或固定題目驗證，題型與數字與 430 圖表題庫區分以增加多樣性。
 */

function opts(...lines) {
  return lines.map((t, i) => ({ key: String.fromCharCode(65 + i), text: String(t) }))
}

function q(n, question, options, correctKey, explanation) {
  return {
    id: `260-chart-${n}`,
    examType: '260',
    category: 'chart',
    question,
    options,
    correctKey,
    explanation,
  }
}

const list = []

// ---------- 表格總和 (1–55) ----------
for (let i = 1; i <= 55; i++) {
  const n = i
  const a = 8 + (n % 18)
  const b = 12 + (n % 22)
  const c = 15 + (n % 12)
  const d = 18 + (n % 10)
  const total = a + b + c + d
  const wrongs = [total - 5, total - 2, total + 2, total + 5].filter((v) => v > 0 && v !== total)
  const optsArr = [...new Set([total, wrongs[0], wrongs[1], wrongs[2]])].sort((u, v) => u - v).slice(0, 4)
  if (!optsArr.includes(total)) optsArr[0] = total
  const idx = optsArr.indexOf(total)
  list.push(
    q(
      i,
      `下表為某單位第一至第四季度支出（萬元）：${a}、${b}、${c}、${d}。問全年總支出多少萬元？`,
      opts(String(optsArr[0]), String(optsArr[1]), String(optsArr[2]), String(optsArr[3])),
      ['A', 'B', 'C', 'D'][idx >= 0 ? idx : 0],
      `全年總支出 = ${a} + ${b} + ${c} + ${d} = ${total} 萬元。`
    )
  )
}
list[0] = q(1, '某表格欄位依序為：日期、部門、數量、備註。若要依「數量」由高至低排序，應以哪一欄為準？', opts('日期', '部門', '數量', '備註'), 'C', '由高至低排序應以「數量」欄為排序鍵。')
list[1] = q(2, '下表為某部門第一至第四季度支出（萬元）：10、14、16、18。問全年總支出多少萬元？', opts('54', '58', '56', '60'), 'B', '全年總支出 = 10 + 14 + 16 + 18 = 58 萬元。')

// ---------- 表格平均 (56–110) ----------
for (let i = 56; i <= 110; i++) {
  const n = i - 55
  const v1 = 15 + (n % 18)
  const v2 = 20 + (n % 18)
  const v3 = 25 + (n % 12)
  const v4 = 30 + (n % 12)
  const sum = v1 + v2 + v3 + v4
  const avg = sum / 4
  const ans = avg % 1 === 0 ? avg : Math.round(avg * 10) / 10
  const wrongs = [ans - 2, ans - 1, ans + 1, ans + 2].filter((v) => v > 0 && v !== ans)
  const optsArr = [...new Set([ans, wrongs[0], wrongs[1], wrongs[2]])].sort((u, v) => u - v).slice(0, 4)
  if (!optsArr.includes(ans)) optsArr[0] = ans
  const idx = optsArr.indexOf(ans) >= 0 ? optsArr.indexOf(ans) : 0
  list.push(
    q(
      i,
      `圖表顯示某單位四個月銷量分別為 ${v1}、${v2}、${v3}、${v4} 件。問平均每月銷量？`,
      opts(String(optsArr[0]), String(optsArr[1]), String(optsArr[2]), String(optsArr[3])),
      ['A', 'B', 'C', 'D'][idx],
      `平均 = (${v1} + ${v2} + ${v3} + ${v4}) ÷ 4 = ${sum} ÷ 4 = ${ans}。`
    )
  )
}

// ---------- 佔比／百分比 (111–165) ----------
for (let i = 111; i <= 165; i++) {
  const n = i - 110
  const a = 25 + (n % 35)
  const b = 40 + (n % 28)
  const c = 35 + (n % 30)
  const total = a + b + c
  const pct = Math.round((a / total) * 100)
  const wrongs = [pct - 5, pct - 2, pct + 2, pct + 5].filter((v) => v >= 0 && v <= 100 && v !== pct)
  const optsArr = [...new Set([pct, wrongs[0], wrongs[1], wrongs[2]])].sort((u, v) => u - v).slice(0, 4)
  if (!optsArr.includes(pct)) optsArr[0] = pct
  const idx = optsArr.indexOf(pct) >= 0 ? optsArr.indexOf(pct) : 0
  list.push(
    q(
      i,
      `下表為三項預算分配：A 項 ${a} 萬元、B 項 ${b} 萬元、C 項 ${c} 萬元。問 A 項佔總預算的百分之幾？`,
      opts(String(optsArr[0]) + '%', String(optsArr[1]) + '%', String(optsArr[2]) + '%', String(optsArr[3]) + '%'),
      ['A', 'B', 'C', 'D'][idx],
      `總預算 = ${a} + ${b} + ${c} = ${total}，A 佔比 = ${a} ÷ ${total} × 100% = ${pct}%。`
    )
  )
}

// ---------- 最高最低差 (166–215) ----------
for (let i = 166; i <= 215; i++) {
  const n = i - 165
  const v = [8 + (n % 18), 12 + (n % 20), 16 + (n % 14), 20 + (n % 18)]
  const max = Math.max(...v)
  const min = Math.min(...v)
  const diff = max - min
  const wrongs = [diff - 3, diff - 1, diff + 1, diff + 3].filter((x) => x >= 0 && x !== diff)
  const optsArr = [...new Set([diff, wrongs[0], wrongs[1], wrongs[2]])].sort((u, v) => u - v).slice(0, 4)
  if (!optsArr.includes(diff)) optsArr[0] = diff
  const idx = optsArr.indexOf(diff) >= 0 ? optsArr.indexOf(diff) : 0
  list.push(
    q(
      i,
      `圖表顯示四區人數為 ${v[0]}、${v[1]}、${v[2]}、${v[3]}。問人數最多與最少的區相差多少人？`,
      opts(String(optsArr[0]), String(optsArr[1]), String(optsArr[2]), String(optsArr[3])),
      ['A', 'B', 'C', 'D'][idx],
      `最高 ${max}、最低 ${min}，相差 ${max} - ${min} = ${diff}。`
    )
  )
}

// ---------- 成長率 (216–265) ----------
for (let i = 216; i <= 265; i++) {
  const n = i - 215
  const base = 60 + (n % 45)
  const rate = 5 + (n % 18)
  const next = base + Math.round((base * rate) / 100)
  const ans = rate
  const wrongs = [ans - 3, ans - 1, ans + 1, ans + 3].filter((x) => x > 0 && x !== ans)
  const optsArr = [...new Set([ans, wrongs[0], wrongs[1], wrongs[2]])].sort((u, v) => u - v).slice(0, 4)
  if (!optsArr.includes(ans)) optsArr[0] = ans
  const idx = optsArr.indexOf(ans) >= 0 ? optsArr.indexOf(ans) : 0
  list.push(
    q(
      i,
      `下表顯示某項目去年為 ${base} 萬元、今年為 ${next} 萬元。問今年較去年成長率約為多少？`,
      opts(String(optsArr[0]) + '%', String(optsArr[1]) + '%', String(optsArr[2]) + '%', String(optsArr[3]) + '%'),
      ['A', 'B', 'C', 'D'][idx],
      `成長率 = (${next} - ${base}) ÷ ${base} × 100% ≈ ${ans}%。`
    )
  )
}

// ---------- 總額 = 單價×數量 加總 (266–315) ----------
for (let i = 266; i <= 315; i++) {
  const n = i - 265
  const p1 = 8 + (n % 14)
  const q1 = 15 + (n % 25)
  const p2 = 12 + (n % 10)
  const q2 = 12 + (n % 20)
  const p3 = 16 + (n % 10)
  const q3 = 8 + (n % 18)
  const total = p1 * q1 + p2 * q2 + p3 * q3
  const wrongs = [total - 50, total - 20, total + 20, total + 50].filter((x) => x > 0 && x !== total)
  const optsArr = [...new Set([total, wrongs[0], wrongs[1], wrongs[2]])].sort((u, v) => u - v).slice(0, 4)
  if (!optsArr.includes(total)) optsArr[0] = total
  const idx = optsArr.indexOf(total) >= 0 ? optsArr.indexOf(total) : 0
  list.push(
    q(
      i,
      `下表為三種產品單價（元）與銷量：A 單價 ${p1}、銷量 ${q1}；B 單價 ${p2}、銷量 ${q2}；C 單價 ${p3}、銷量 ${q3}。問總營業額多少元？`,
      opts(String(optsArr[0]), String(optsArr[1]), String(optsArr[2]), String(optsArr[3])),
      ['A', 'B', 'C', 'D'][idx],
      `總額 = ${p1}×${q1} + ${p2}×${q2} + ${p3}×${q3} = ${total} 元。`
    )
  )
}

// ---------- 依表查值／對照 (316–355) ----------
for (let i = 316; i <= 355; i++) {
  const n = i - 315
  const fuel = 7 + (n % 5)
  const wrongs = [fuel - 1, fuel + 1, fuel + 2].filter((x) => x > 0 && x !== fuel)
  const optsArr = [...new Set([fuel, wrongs[0], wrongs[1], wrongs[2]])].sort((u, v) => u - v).slice(0, 4)
  if (!optsArr.includes(fuel)) optsArr[0] = fuel
  const idx = optsArr.indexOf(fuel) >= 0 ? optsArr.indexOf(fuel) : 0
  list.push(
    q(
      i,
      `下表為車速與每 100 公里耗油量（公升）對照：60 km/h→6、70 km/h→7、80 km/h→${fuel}、90 km/h→${fuel + 1}。問車速 80 km/h 時每 100 公里耗油多少公升？`,
      opts(String(optsArr[0]), String(optsArr[1]), String(optsArr[2]), String(optsArr[3])),
      ['A', 'B', 'C', 'D'][idx],
      `依表，80 km/h 對應每 100 公里 ${fuel} 公升。`
    )
  )
}

// ---------- 表格排序與欄位 (356–380)：260 風格 ----------
const sortFieldQuestions = [
  ['某表格欄位依序為：姓名、部門、到職日、薪級。若要依「到職日」由早到晚排序，應以哪一欄為準？', '姓名', '部門', '到職日', '薪級', 'C', '由早到晚排序應以「到職日」欄為排序鍵。'],
  ['某表格欄位依序為：編號、品名、單價、庫存。若要依「庫存」由低至高排序，應以哪一欄為準？', '編號', '品名', '單價', '庫存', 'D', '由低至高排序應以「庫存」欄為排序鍵。'],
  ['某表格欄位依序為：日期、類別、金額、備註。若要依「金額」由高至低排序，應以哪一欄為準？', '日期', '類別', '金額', '備註', 'C', '由高至低排序應以「金額」欄為排序鍵。'],
  ['某表格欄位依序為：序號、項目、數量、單位。若要依「數量」由少至多排序，應以哪一欄為準？', '序號', '項目', '數量', '單位', 'C', '由少至多排序應以「數量」欄為排序鍵。'],
  ['某表格欄位依序為：代碼、名稱、預算、執行率。若要依「執行率」由高至低排序，應以哪一欄為準？', '代碼', '名稱', '預算', '執行率', 'D', '由高至低排序應以「執行率」欄為排序鍵。'],
  ['某表格欄位依序為：月份、收入、支出、結餘。若要依「結餘」由低至高排序，應以哪一欄為準？', '月份', '收入', '支出', '結餘', 'D', '由低至高排序應以「結餘」欄為排序鍵。'],
  ['某表格欄位依序為：編號、標題、字數、狀態。若要依「字數」由多至少排序，應以哪一欄為準？', '編號', '標題', '字數', '狀態', 'C', '由多至少排序應以「字數」欄為排序鍵。'],
  ['某表格欄位依序為：代號、說明、數量、備註。若要依「數量」由高至低排序，應以哪一欄為準？', '代號', '說明', '數量', '備註', 'C', '由高至低排序應以「數量」欄為排序鍵。'],
  ['某表格欄位依序為：日期、部門、數量、備註。若要依「部門」筆畫或字母排序，應以哪一欄為準？', '日期', '部門', '數量', '備註', 'B', '依部門排序應以「部門」欄為排序鍵。'],
  ['某表格欄位依序為：序號、名稱、單價、小計。若要依「小計」由大至小排序，應以哪一欄為準？', '序號', '名稱', '單價', '小計', 'D', '由大至小排序應以「小計」欄為排序鍵。'],
  ['某表格欄位依序為：編號、類別、件數、日期。若要依「日期」由新至舊排序，應以哪一欄為準？', '編號', '類別', '件數', '日期', 'D', '由新至舊排序應以「日期」欄為排序鍵。'],
  ['某表格欄位依序為：代碼、品項、庫存、單位。若要依「庫存」由高至低排序，應以哪一欄為準？', '代碼', '品項', '庫存', '單位', 'C', '由高至低排序應以「庫存」欄為排序鍵。'],
  ['某表格欄位依序為：年度、預算、實支、餘額。若要依「餘額」由少至多排序，應以哪一欄為準？', '年度', '預算', '實支', '餘額', 'D', '由少至多排序應以「餘額」欄為排序鍵。'],
  ['某表格欄位依序為：序號、內容、字數、狀態。若要依「字數」由少至多排序，應以哪一欄為準？', '序號', '內容', '字數', '狀態', 'C', '由少至多排序應以「字數」欄為排序鍵。'],
  ['某表格欄位依序為：編號、名稱、數量、備註。若要依「名稱」筆畫或字母排序，應以哪一欄為準？', '編號', '名稱', '數量', '備註', 'B', '依名稱排序應以「名稱」欄為排序鍵。'],
  ['某表格欄位依序為：日期、類別、金額、備註。若要依「類別」排序，應以哪一欄為準？', '日期', '類別', '金額', '備註', 'B', '依類別排序應以「類別」欄為排序鍵。'],
  ['某表格欄位依序為：代碼、項目、預算、執行率。若要依「預算」由大至小排序，應以哪一欄為準？', '代碼', '項目', '預算', '執行率', 'C', '由大至小排序應以「預算」欄為排序鍵。'],
  ['某表格欄位依序為：序號、標題、頁數、狀態。若要依「頁數」由多至少排序，應以哪一欄為準？', '序號', '標題', '頁數', '狀態', 'C', '由多至少排序應以「頁數」欄為排序鍵。'],
  ['某表格欄位依序為：編號、部門、人數、備註。若要依「人數」由高至低排序，應以哪一欄為準？', '編號', '部門', '人數', '備註', 'C', '由高至低排序應以「人數」欄為排序鍵。'],
  ['某表格欄位依序為：代號、說明、單價、數量。若要依「單價」由低至高排序，應以哪一欄為準？', '代號', '說明', '單價', '數量', 'C', '由低至高排序應以「單價」欄為排序鍵。'],
]
for (let i = 356; i <= 380; i++) {
  const row = sortFieldQuestions[(i - 356) % sortFieldQuestions.length]
  list.push(q(i, row[0], opts(row[1], row[2], row[3], row[4]), row[5], row[6]))
}

// ---------- Excel／Office 操作 (381–430) ----------
const excelOffice = [
  ['Excel 複製貼上時要令儲存格參照不變（如 A2），應使用？', '相對參照', '絕對參照 $A$2', '混合參照', '名稱管理員', 'B', '絕對參照以 $ 鎖定欄列，如 $A$2。'],
  ['Excel 儲存格 B1 公式 =A1/A2，複製貼上到 C2 後，C2 公式為？', 'A1/A2', 'B2/B3', 'C1/C2', 'A2/A3', 'B', '相對參照：列、欄各+1，故 C2 為 B2/B3。'],
  ['以下哪種格式的影音文檔能放進 PowerPoint？', 'MP3', 'WMV', 'WMA', 'MID', 'B', 'PowerPoint 支援 WMV 等視訊格式；MP3/WMA 為音訊。'],
  ['以下不屬於 MS Word「合併列印」中可選取的文件類型為？', '日曆', '標籤', '信封', '目錄', 'D', '合併列印常用信函、信封、標籤等，目錄通常不經合併列印產生。'],
  ['Excel 中 $A1 表示？', '絕對欄 A、相對列', '相對欄、絕對列 1', '絕對欄與列', '錯誤公式', 'A', '$A1 為混合參照：欄 A 固定、列隨複製改變。'],
  ['要讓 Excel 公式中的列不隨複製改變，應寫成？', 'A$1', '$A1', 'A1', '$A$1', 'A', 'A$1 表示列 1 固定、欄隨複製改變。'],
  ['Excel 中若要計算 A1 到 A10 總和，公式應為？', '=SUM(A1:A10)', '=TOTAL(A1:A10)', '=ADD(A1:A10)', '=A1+A10', 'A', 'SUM 為加總函數，A1:A10 為範圍。'],
  ['下列何者為 Excel 的絕對參照寫法？', 'A1', '$A$1', 'A$1', '1A', 'B', '絕對參照以 $ 鎖定欄與列：$A$1。'],
  ['Excel 儲存格顯示 #DIV/0! 表示？', '除數為零', '參照錯誤', '數值溢位', '格式錯誤', 'A', '#DIV/0! 表示公式中有除以零。'],
  ['Word 合併列印「插入合併欄位」用途為？', '插入固定文字', '插入資料來源欄位', '插入圖片', '插入表格', 'B', '合併欄位會從資料來源帶入對應欄位值。'],
  ['Word「郵件」選取收件者，下列哪項不正確？', '建立新清單', '使用現有清單', '從 Outlook 連絡人選擇', '從網絡郵件連絡人選擇', 'D', '從網絡郵件連絡人選擇不屬 Word 合併列印收件者選項。'],
  ['下列哪種檔案可作為 Word 合併列印的資料來源？', 'Excel 活頁簿', 'PDF', '圖片', '影片', 'A', '合併列印常用 Excel 或 Access 等作為資料來源。'],
  ['Excel 中 A1:A5 為 10,20,30,40,50，=AVERAGE(A1:A5) 結果為？', '30', '35', '150', '25', 'A', '平均 = (10+20+30+40+50)/5 = 30。'],
  ['Excel 儲存格顯示 ##### 可能表示？', '除零錯誤', '欄寬不足', '參照錯誤', '公式錯誤', 'B', '數值過長、欄寬不足時會顯示 #####。'],
  ['Excel 中 =COUNT(A1:A10) 會計算？', '總和', '平均', '數值儲存格個數', '最大值', 'C', 'COUNT 計算範圍內含數值的儲存格個數。'],
  ['Word 表格中要將多個儲存格合併為一個，應使用？', '分割儲存格', '合併儲存格', '插入列', '刪除欄', 'B', '「合併儲存格」可將選取的多格合併為一格。'],
  ['Excel 中 =MAX(A1:A5) 會傳回？', '總和', '平均', '最大值', '個數', 'C', 'MAX 傳回範圍內最大值。'],
  ['Excel 中 =MIN(A1:A5) 會傳回？', '總和', '平均', '最小值', '個數', 'C', 'MIN 傳回範圍內最小值。'],
  ['下列哪種為 Excel 的範圍參照？', 'A1', 'A1:A10', '$A$1', 'A1+B1', 'B', 'A1:A10 表示從 A1 到 A10 的範圍。'],
  ['Excel 中 =SUM(A1,A3,A5) 會計算？', 'A1 到 A5 總和', 'A1、A3、A5 三格總和', '平均', '個數', 'B', 'SUM(A1,A3,A5) 只加總這三個儲存格。'],
  ['政府某部門舉行活動人手不足，需各局派人幫手，用哪種文件？', '內部通知', '建議書', '申請書', '公函', 'D', '跨部門協調通常用公函。'],
  ['政府某部門要買影印機，現向主管回報以向商家報價，用哪種文件？', '部門公告', '通知', '建議書', '申請書', 'C', '向上級建議採購用建議書。'],
  ['PowerPoint 投影片可嵌入下列哪種視訊格式？', 'MP4', 'FLAC', 'WMA', 'MID', 'A', 'PowerPoint 支援 MP4、WMV 等視訊格式。'],
  ['Excel 中 =IF(A1>60,"及格","不及格")，若 A1=70 則結果為？', '不及格', '及格', '70', '錯誤', 'B', '70>60 為真，故傳回「及格」。'],
  ['Word 中「目錄」功能通常依據？', '手動輸入', '標題樣式', '字型大小', '粗體', 'B', '目錄依標題樣式自動產生。'],
  ['Excel 中 =ROUND(3.14159,2) 結果為？', '3', '3.14', '3.141', '3.1', 'B', 'ROUND(數值,2) 四捨五入到小數第 2 位。'],
  ['Excel 中 A1=100，B1 公式 =A1*0.1，則 B1 顯示？', '10', '100', '0.1', '1000', 'A', '100 × 0.1 = 10。'],
  ['PowerPoint 投影片放映時按 B 鍵會？', '下一張', '上一張', '黑屏', '結束放映', 'C', '放映時 B 鍵可切換黑屏。'],
  ['Excel 中 B2 公式 =$A$1+1，複製 B2 到 C4 後 C4 公式為？', '=$A$1+1', '=$B$3+1', '=A1+1', '=B3+1', 'A', '絕對參照 $A$1 不變，故仍為 =$A$1+1。'],
  ['Word 中要讓每頁顯示相同標題列，應使用？', '分節符號', '重複標題列', '頁首', '書籤', 'B', '表格「版面配置」→「重複標題列」可在每頁重複表頭。'],
  ['Excel 中 =AVERAGE(10,20,30) 結果為？', '20', '60', '30', '15', 'A', '平均 = (10+20+30)/3 = 20。'],
  ['Word 中「插入」→「表格」可？', '僅插入固定欄列', '插入表格或手繪', '僅手繪', '僅從 Excel 貼上', 'B', '可插入指定欄列數的表格或手繪表格。'],
  ['PowerPoint 投影片「備忘稿」的用途為？', '投影片上的文字', '講者備忘、觀眾看不到', '標題', '動畫', 'B', '備忘稿供講者檢視，放映時觀眾看不到。'],
  ['Excel 中 =COUNTIF(A1:A10,">50") 會計算？', '總和', '大於 50 的儲存格個數', '平均', '最大值', 'B', 'COUNTIF 依條件計算符合的儲存格個數。'],
  ['Word 中「分欄」功能在何處？', '插入', '版面配置', '參考資料', '校閱', 'B', '「版面配置」→「欄」可設定分欄。'],
  ['PowerPoint 投影片可設定「切換」效果，即？', '動畫', '轉場', '母片', '版面配置', 'B', '「切換」或「轉場」為投影片之間的過場效果。'],
  ['Excel 儲存格格式為「數值」、輸入 0.5，若顯示 50%，表示？', '格式錯誤', '儲存格格式為百分比', '公式錯誤', '參照錯誤', 'B', '百分比格式會將 0.5 顯示為 50%。'],
  ['PowerPoint 中「投影片放映」從目前投影片開始的快速鍵為？', 'F5', 'Shift+F5', 'Ctrl+F5', 'Alt+F5', 'B', 'Shift+F5 從目前投影片開始放映；F5 從第一張開始。'],
  ['Excel 中 A1 到 A4 為 2,4,6,8，=SUM(A1:A4)/4 結果為？', '5', '20', '4', '6', 'A', '總和 20，20/4 = 5。'],
  ['PowerPoint 中「母片」的用途為？', '單張投影片動畫', '統一設定所有投影片版式', '插入影片', '轉場效果', 'B', '母片可統一設定版式、字型、位置等。'],
  ['Excel 中 A1=8、A2=12，=A1+A2 結果為？', '8', '12', '20', '96', 'C', '8 + 12 = 20。'],
  ['Word 中「追蹤修訂」功能在何索引標籤？', '插入', '校閱', '檢視', '設計', 'B', '「校閱」→「追蹤修訂」可記錄修改。'],
  ['PowerPoint 投影片編號可透過何處插入？', '插入→頁首及頁尾', '設計→主題', '動畫', '轉場', 'A', '「插入」→「頁首及頁尾」可勾選投影片編號。'],
]
excelOffice.forEach((row, idx) => {
  const [question, a, b, c, d, correctKey, explanation] = row
  list.push(q(381 + idx, question, opts(a, b, c, d), correctKey, explanation))
})

// ---------- 五項平均與兩項合計 (431–500) ----------
for (let i = 431; i <= 500; i++) {
  const n = i - 430
  if (n <= 50) {
    const a = 4 + (n % 14)
    const b = 8 + (n % 18)
    const c = 12 + (n % 10)
    const d = 16 + (n % 12)
    const e = 6 + (n % 12)
    const total = a + b + c + d + e
    const avg = total / 5
    const ans = avg % 1 === 0 ? avg : Math.round(avg * 10) / 10
    const wrongs = [ans - 2, ans - 1, ans + 1, ans + 2].filter((v) => v > 0 && v !== ans)
    const optsArr = [...new Set([ans, wrongs[0], wrongs[1], wrongs[2]])].sort((u, v) => u - v).slice(0, 4)
    if (!optsArr.includes(ans)) optsArr[0] = ans
    const idx = optsArr.indexOf(ans) >= 0 ? optsArr.indexOf(ans) : 0
    list.push(
      q(
        i,
        `下表為五個分項的數值：${a}、${b}、${c}、${d}、${e}。問五項的平均值？`,
        opts(String(optsArr[0]), String(optsArr[1]), String(optsArr[2]), String(optsArr[3])),
        ['A', 'B', 'C', 'D'][idx],
        `總和 = ${a}+${b}+${c}+${d}+${e} = ${total}，平均 = ${total} ÷ 5 = ${ans}。`
      )
    )
  } else {
    const a = 10 + ((n - 50) % 18)
    const b = 18 + ((n - 50) % 14)
    const total = a + b
    const wrongs = [total - 3, total - 1, total + 1, total + 3].filter((v) => v > 0 && v !== total)
    const optsArr = [...new Set([total, wrongs[0], wrongs[1], wrongs[2]])].sort((u, v) => u - v).slice(0, 4)
    if (!optsArr.includes(total)) optsArr[0] = total
    const idx = optsArr.indexOf(total) >= 0 ? optsArr.indexOf(total) : 0
    list.push(
      q(
        i,
        `圖表顯示兩項數據為 ${a} 與 ${b}。問兩項合計？`,
        opts(String(optsArr[0]), String(optsArr[1]), String(optsArr[2]), String(optsArr[3])),
        ['A', 'B', 'C', 'D'][idx],
        `合計 = ${a} + ${b} = ${total}。`
      )
    )
  }
}

// 確保長度為 500
const finalList = list.slice(0, 500)
while (finalList.length < 500) {
  const i = finalList.length + 1
  const a = 10 + (i % 18)
  const b = 20 + (i % 12)
  const total = a + b
  finalList.push(
    q(i, `圖表顯示兩項數據為 ${a} 與 ${b}。問兩項合計？`, opts(String(total - 2), String(total), String(total + 2), String(total + 5)), 'B', `合計 = ${a} + ${b} = ${total}。`)
  )
}

export const questions260Chart = finalList.slice(0, 500)
