/**
 * 430 統考圖表分析題庫（500 題）
 * 題型：表格總和與平均、佔比與成長率、最高最低差、總額計算、依表查值、Excel/Office 操作等。
 * 正確答案均以程式計算或固定題目驗證。
 */

function opts(...lines) {
  return lines.map((t, i) => ({ key: String.fromCharCode(65 + i), text: String(t) }))
}

function q(n, question, options, correctKey, explanation) {
  return {
    id: `430-chart-${n}`,
    examType: '430',
    category: 'chart',
    question,
    options,
    correctKey,
    explanation,
  }
}

const list = []

// ---------- 表格總和 (1–60) ----------
for (let i = 1; i <= 60; i++) {
  const n = i
  const a = 10 + (n % 20)
  const b = 15 + (n % 25)
  const c = 20 + (n % 15)
  const d = 25 + (n % 10)
  const total = a + b + c + d
  const wrongs = [total - 5, total - 2, total + 2, total + 5].filter((v) => v > 0 && v !== total)
  const optsArr = [...new Set([total, wrongs[0], wrongs[1], wrongs[2]])].sort((u, v) => u - v).slice(0, 4)
  if (!optsArr.includes(total)) optsArr[0] = total
  const keys = ['A', 'B', 'C', 'D']
  const idx = optsArr.indexOf(total)
  list.push(
    q(
      i,
      `下表為某部門第一至第四季度支出（萬元）：${a}、${b}、${c}、${d}。問全年總支出多少萬元？`,
      opts(String(optsArr[0]), String(optsArr[1]), String(optsArr[2]), String(optsArr[3])),
      keys[idx >= 0 ? idx : 0],
      `全年總支出 = ${a} + ${b} + ${c} + ${d} = ${total} 萬元。`
    )
  )
}
list[0] = q(1, '下表為某部門第一至第四季度支出（萬元）：12、18、15、20。問全年總支出多少萬元？', opts('60', '65', '62', '63'), 'B', '全年總支出 = 12 + 18 + 15 + 20 = 65 萬元。')
list[1] = q(2, '圖表顯示甲、乙、丙、丁四區人數為 80、120、90、110。問四區總人數？', opts('380', '400', '390', '395'), 'B', '總人數 = 80 + 120 + 90 + 110 = 400。')

// ---------- 表格平均 (61–120) ----------
for (let i = 61; i <= 120; i++) {
  const n = i - 60
  const v1 = 20 + (n % 15)
  const v2 = 25 + (n % 20)
  const v3 = 30 + (n % 10)
  const v4 = 35 + (n % 15)
  const sum = v1 + v2 + v3 + v4
  const avg = sum / 4
  const ans = avg % 1 === 0 ? avg : Math.round(avg * 10) / 10
  const wrongs = [ans - 2, ans - 1, ans + 1, ans + 2].filter((v) => v > 0 && v !== ans)
  const optsArr = [...new Set([ans, wrongs[0], wrongs[1], wrongs[2]])].sort((u, v) => u - v).slice(0, 4)
  if (!optsArr.includes(ans)) optsArr[0] = ans
  const keys = ['A', 'B', 'C', 'D']
  const idx = optsArr.indexOf(ans)
  list.push(
    q(
      i,
      `圖表顯示某公司四個月銷量分別為 ${v1}、${v2}、${v3}、${v4} 件。問平均每月銷量？`,
      opts(String(optsArr[0]), String(optsArr[1]), String(optsArr[2]), String(optsArr[3])),
      keys[idx >= 0 ? idx : 0],
      `平均 = (${v1} + ${v2} + ${v3} + ${v4}) ÷ 4 = ${sum} ÷ 4 = ${ans}。`
    )
  )
}
list[60] = q(61, '圖表顯示五區人數為 100、120、80、90、110。問平均每區人數？', opts('98', '100', '102', '99'), 'B', '平均 = (100+120+80+90+110) ÷ 5 = 500 ÷ 5 = 100。')

// ---------- 佔比／百分比 (121–180) ----------
for (let i = 121; i <= 180; i++) {
  const n = i - 120
  const a = 30 + (n % 40)
  const b = 50 + (n % 30)
  const c = 40 + (n % 35)
  const total = a + b + c
  const pct = Math.round((a / total) * 100)
  const wrongs = [pct - 5, pct - 2, pct + 2, pct + 5].filter((v) => v >= 0 && v <= 100 && v !== pct)
  const optsArr = [...new Set([pct, wrongs[0], wrongs[1], wrongs[2]])].sort((u, v) => u - v).slice(0, 4)
  if (!optsArr.includes(pct)) optsArr[0] = pct
  const keys = ['A', 'B', 'C', 'D']
  const idx = optsArr.indexOf(pct)
  list.push(
    q(
      i,
      `下表為三項預算分配：A 項 ${a} 萬元、B 項 ${b} 萬元、C 項 ${c} 萬元。問 A 項佔總預算的百分之幾？`,
      opts(String(optsArr[0]) + '%', String(optsArr[1]) + '%', String(optsArr[2]) + '%', String(optsArr[3]) + '%'),
      keys[idx >= 0 ? idx : 0],
      `總預算 = ${a} + ${b} + ${c} = ${total}，A 佔比 = ${a} ÷ ${total} × 100% = ${pct}%。`
    )
  )
}

// ---------- 最高最低差 (181–240) ----------
for (let i = 181; i <= 240; i++) {
  const n = i - 180
  const v = [10 + (n % 20), 15 + (n % 25), 20 + (n % 15), 25 + (n % 20)]
  const max = Math.max(...v)
  const min = Math.min(...v)
  const diff = max - min
  const wrongs = [diff - 3, diff - 1, diff + 1, diff + 3].filter((x) => x >= 0 && x !== diff)
  const optsArr = [...new Set([diff, wrongs[0], wrongs[1], wrongs[2]])].sort((u, v) => u - v).slice(0, 4)
  if (!optsArr.includes(diff)) optsArr[0] = diff
  const keys = ['A', 'B', 'C', 'D']
  const idx = optsArr.indexOf(diff)
  list.push(
    q(
      i,
      `圖表顯示四區人數為 ${v[0]}、${v[1]}、${v[2]}、${v[3]}。問人數最多與最少的區相差多少人？`,
      opts(String(optsArr[0]), String(optsArr[1]), String(optsArr[2]), String(optsArr[3])),
      keys[idx >= 0 ? idx : 0],
      `最高 ${max}、最低 ${min}，相差 ${max} - ${min} = ${diff}。`
    )
  )
}

// ---------- 成長率 (241–300) ----------
for (let i = 241; i <= 300; i++) {
  const n = i - 240
  const base = 80 + (n % 40)
  const rate = 5 + (n % 20)
  const next = base + Math.round((base * rate) / 100)
  const ans = rate
  const wrongs = [ans - 3, ans - 1, ans + 1, ans + 3].filter((x) => x > 0 && x !== ans)
  const optsArr = [...new Set([ans, wrongs[0], wrongs[1], wrongs[2]])].sort((u, v) => u - v).slice(0, 4)
  if (!optsArr.includes(ans)) optsArr[0] = ans
  const keys = ['A', 'B', 'C', 'D']
  const idx = optsArr.indexOf(ans)
  list.push(
    q(
      i,
      `下表顯示某項目去年為 ${base} 萬元、今年為 ${next} 萬元。問今年較去年成長率約為多少？`,
      opts(String(optsArr[0]) + '%', String(optsArr[1]) + '%', String(optsArr[2]) + '%', String(optsArr[3]) + '%'),
      keys[idx >= 0 ? idx : 0],
      `成長率 = (${next} - ${base}) ÷ ${base} × 100% ≈ ${ans}%。`
    )
  )
}
list[240] = q(241, '圖表顯示某部門 2022 年預算 100 萬元、2023 年 120 萬元。問 2023 年較 2022 年成長率？', opts('18%', '20%', '22%', '25%'), 'B', '成長率 = (120 - 100) ÷ 100 × 100% = 20%。')

// ---------- 總額 = 單價×數量 加總 (301–360) ----------
for (let i = 301; i <= 360; i++) {
  const n = i - 300
  const p1 = 10 + (n % 15)
  const q1 = 20 + (n % 30)
  const p2 = 15 + (n % 10)
  const q2 = 15 + (n % 25)
  const p3 = 20 + (n % 12)
  const q3 = 10 + (n % 20)
  const total = p1 * q1 + p2 * q2 + p3 * q3
  const wrongs = [total - 50, total - 20, total + 20, total + 50].filter((x) => x > 0 && x !== total)
  const optsArr = [...new Set([total, wrongs[0], wrongs[1], wrongs[2]])].sort((u, v) => u - v).slice(0, 4)
  if (!optsArr.includes(total)) optsArr[0] = total
  const keys = ['A', 'B', 'C', 'D']
  const idx = optsArr.indexOf(total)
  list.push(
    q(
      i,
      `下表為三種產品單價（元）與銷量：A 單價 ${p1}、銷量 ${q1}；B 單價 ${p2}、銷量 ${q2}；C 單價 ${p3}、銷量 ${q3}。問總營業額多少元？`,
      opts(String(optsArr[0]), String(optsArr[1]), String(optsArr[2]), String(optsArr[3])),
      keys[idx >= 0 ? idx : 0],
      `總額 = ${p1}×${q1} + ${p2}×${q2} + ${p3}×${q3} = ${p1 * q1} + ${p2 * q2} + ${p3 * q3} = ${total} 元。`
    )
  )
}

// ---------- 依表查值／對照 (361–400) ----------
for (let i = 361; i <= 400; i++) {
  const n = i - 360
  const speed = [60, 70, 80, 90][n % 4]
  const fuel = 8 + (n % 5)
  const dist = 100
  const wrongs = [fuel - 1, fuel + 1, fuel + 2].filter((x) => x > 0 && x !== fuel)
  const optsArr = [...new Set([fuel, wrongs[0], wrongs[1], wrongs[2]])].sort((u, v) => u - v).slice(0, 4)
  if (!optsArr.includes(fuel)) optsArr[0] = fuel
  const keys = ['A', 'B', 'C', 'D']
  const idx = optsArr.indexOf(fuel)
  list.push(
    q(
      i,
      `下表為車速與每 100 公里耗油量（公升）對照：60 km/h 對應 7、70 km/h 對應 8、80 km/h 對應 ${fuel}、90 km/h 對應 ${fuel + 1}。問車速 80 km/h 時每 100 公里耗油多少公升？`,
      opts(String(optsArr[0]), String(optsArr[1]), String(optsArr[2]), String(optsArr[3])),
      keys[idx >= 0 ? idx : 0],
      `依表，80 km/h 對應每 100 公里 ${fuel} 公升。`
    )
  )
}
list[360] = q(361, '下表為車速（km/h）與耗油（L/100km）：60→7、70→8、80→9、90→10。問 80 km/h 時每 100 公里耗油幾公升？', opts('8', '9', '10', '11'), 'B', '依表 80 km/h 對應 9 公升/100 公里。')

// ---------- Excel／Office 操作 (401–450) ----------
const excelOffice = [
  ['Excel 儲存格要固定欄與列不隨複製改變，應使用？', '相對參照', '絕對參照 $A$1', '混合參照', '名稱管理員', 'B', '絕對參照以 $ 鎖定欄列，如 $A$1。'],
  ['Excel 中 B2 公式 =A1*A2，複製到 C3 後，C3 公式變為？', '=A1*A2', '=B2*B3', '=C2*C3', '=A2*A3', 'B', '相對參照：列、欄各+1，故 C3 為 B2/B3。'],
  ['下列哪種格式的影片可直接插入 PowerPoint 投影片？', 'MP3', 'WMV', 'WMA', 'MID', 'B', 'PowerPoint 支援 WMV 等視訊格式；MP3/WMA 為音訊。'],
  ['Word「合併列印」可選取的文件類型不包括？', '信函', '信封', '標籤', '目錄', 'D', '合併列印常用信函、信封、標籤，目錄通常不經合併列印產生。'],
  ['Excel 中 $A1 表示？', '絕對欄 A、相對列', '相對欄、絕對列 1', '絕對欄與列', '錯誤公式', 'A', '$A1 為混合參照：欄 A 固定、列隨複製改變。'],
  ['要讓 Excel 公式中的列不隨複製改變，應寫成？', 'A$1', '$A1', 'A1', '$A$1', 'A', 'A$1 表示列 1 固定、欄隨複製改變。'],
  ['PowerPoint 投影片可嵌入下列哪種視訊格式？', 'MP4', 'FLAC', 'WMA', 'MID', 'A', 'PowerPoint 支援 MP4、WMV 等視訊格式。'],
  ['Excel 儲存格 A1=10、A2=20，B1 公式 =A1+A2，複製 B1 到 C2 後 C2 公式為？', '=A1+A2', '=B2+B3', '=A2+A3', '=B1+B2', 'B', '相對參照：B1→C2 欄+1、列+1，故 A1→B2、A2→B3。'],
  ['Word 郵件合併時「選取收件者」不包含？', '建立新清單', '使用現有清單', '從 Outlook 連絡人選擇', '從網絡郵件連絡人選擇', 'D', 'Word 合併列印收件者來源不含「從網絡郵件連絡人選擇」。'],
  ['Excel 中若要計算 A1 到 A10 總和，公式應為？', '=SUM(A1:A10)', '=TOTAL(A1:A10)', '=ADD(A1:A10)', '=A1+A10', 'A', 'SUM 為加總函數，A1:A10 為範圍。'],
  ['下列何者為 Excel 的絕對參照寫法？', 'A1', '$A$1', 'A$1', '1A', 'B', '絕對參照以 $ 鎖定欄與列：$A$1。'],
  ['PowerPoint 可插入的媒體類型不包括？', '影片', '音訊', '螢幕錄製', '資料庫連線', 'D', '投影片可插入影片、音訊、螢幕錄製，不直接插入資料庫連線。'],
  ['Excel 儲存格顯示 #DIV/0! 表示？', '除數為零', '參照錯誤', '數值溢位', '格式錯誤', 'A', '#DIV/0! 表示公式中有除以零。'],
  ['Word 合併列印「插入合併欄位」用途為？', '插入固定文字', '插入資料來源欄位', '插入圖片', '插入表格', 'B', '合併欄位會從資料來源（如 Excel）帶入對應欄位值。'],
  ['Excel 中 A1=5、B1=3，C1 公式 =A1*B1，複製 C1 到 D2 後 D2 公式為？', '=A1*B1', '=B2*C2', '=A2*B2', '=C1*D1', 'B', '相對參照：C1→D2，A1→B2、B1→C2。'],
  ['下列哪種檔案可作為 Word 合併列印的資料來源？', 'Excel 活頁簿', 'PDF', '圖片', '影片', 'A', '合併列印常用 Excel 或 Access 等作為資料來源。'],
  ['Excel 中 A2 輸入 100，B2 公式 =$A2*2，複製 B2 到 C3 後 C3 公式為？', '=$A2*2', '=$A3*2', '=$B3*2', '=A3*2', 'B', '$A 鎖定欄、列不鎖定，故複製到 C3 仍為 $A3*2。'],
  ['PowerPoint 投影片放映時按 B 鍵會？', '下一張', '上一張', '黑屏', '結束放映', 'C', '放映時 B 鍵可切換黑屏、W 鍵可切換白屏。'],
  ['Excel 中 A1:A5 為 10,20,30,40,50，=AVERAGE(A1:A5) 結果為？', '30', '35', '150', '25', 'A', '平均 = (10+20+30+40+50)/5 = 30。'],
  ['Word 中「目錄」功能通常依據？', '手動輸入', '標題樣式', '字型大小', '粗體', 'B', '目錄依標題樣式（如標題 1、標題 2）自動產生。'],
  ['Excel 儲存格顯示 ##### 可能表示？', '除零錯誤', '欄寬不足', '參照錯誤', '公式錯誤', 'B', '數值過長、欄寬不足時會顯示 #####。'],
  ['下列何者不是 PowerPoint 可插入的物件？', '圖表', '方程式', '視訊', '資料庫查詢', 'D', '投影片可插入圖表、方程式、視訊，不直接插入資料庫查詢。'],
  ['Excel 中 =COUNT(A1:A10) 會計算？', '總和', '平均', '數值儲存格個數', '最大值', 'C', 'COUNT 計算範圍內含數值的儲存格個數。'],
  ['Word 表格中要將多個儲存格合併為一個，應使用？', '分割儲存格', '合併儲存格', '插入列', '刪除欄', 'B', '「合併儲存格」可將選取的多格合併為一格。'],
  ['Excel 中 =MAX(A1:A5) 會傳回？', '總和', '平均', '最大值', '個數', 'C', 'MAX 傳回範圍內最大值。'],
  ['PowerPoint 投影片編號可透過何處插入？', '插入→頁首及頁尾', '設計→主題', '動畫', '轉場', 'A', '「插入」→「頁首及頁尾」可勾選投影片編號。'],
  ['Excel 中 A1=8、A2=12，=A1+A2 結果為？', '8', '12', '20', '96', 'C', '8 + 12 = 20。'],
  ['Word 中要讓每頁顯示相同標題列，應使用？', '分節符號', '重複標題列', '頁首', '書籤', 'B', '表格「版面配置」→「重複標題列」可在每頁重複表頭。'],
  ['Excel 中 =MIN(A1:A5) 會傳回？', '總和', '平均', '最小值', '個數', 'C', 'MIN 傳回範圍內最小值。'],
  ['下列哪種為 Excel 的範圍參照？', 'A1', 'A1:A10', '$A$1', 'A1+B1', 'B', 'A1:A10 表示從 A1 到 A10 的範圍。'],
  ['PowerPoint 中「母片」的用途為？', '單張投影片動畫', '統一設定所有投影片版式', '插入影片', '轉場效果', 'B', '母片可統一設定版式、字型、位置等。'],
  ['Excel 中 =SUM(A1,A3,A5) 會計算？', 'A1 到 A5 總和', 'A1、A3、A5 三格總和', '平均', '個數', 'B', 'SUM(A1,A3,A5) 只加總這三個儲存格。'],
  ['Word 中「分欄」功能在何處？', '插入', '版面配置', '參考資料', '校閱', 'B', '「版面配置」→「欄」可設定分欄。'],
  ['Excel 儲存格格式為「數值」、輸入 0.5，若顯示 50%，表示？', '格式錯誤', '儲存格格式為百分比', '公式錯誤', '參照錯誤', 'B', '百分比格式會將 0.5 顯示為 50%。'],
  ['PowerPoint 投影片可設定「切換」效果，即？', '動畫', '轉場', '母片', '版面配置', 'B', '「切換」或「轉場」為投影片之間的過場效果。'],
  ['Excel 中 =ROUND(3.14159,2) 結果為？', '3', '3.14', '3.141', '3.1', 'B', 'ROUND(數值,2) 四捨五入到小數第 2 位。'],
  ['Word 中「醒目提示」用途為？', '標記文字背景色', '插入註解', '追蹤修訂', '字型顏色', 'A', '醒目提示可為文字加上背景色標記。'],
  ['Excel 中 A1=100，B1 公式 =A1*0.1，則 B1 顯示？', '10', '100', '0.1', '1000', 'A', '100 × 0.1 = 10。'],
  ['PowerPoint 中「動畫」與「轉場」的差異為？', '相同', '動畫作用於物件、轉場作用於投影片切換', '僅轉場可設定', '僅動畫可設定', 'B', '動畫用於單一物件；轉場用於投影片之間的切換。'],
  ['Excel 中 =IF(A1>60,"及格","不及格")，若 A1=70 則結果為？', '不及格', '及格', '70', '錯誤', 'B', '70>60 為真，故傳回「及格」。'],
  ['Word 中「追蹤修訂」功能在何索引標籤？', '插入', '校閱', '檢視', '設計', 'B', '「校閱」→「追蹤修訂」可記錄修改。'],
  ['Excel 中 =COUNTIF(A1:A10,">50") 會計算？', '總和', '大於 50 的儲存格個數', '平均', '最大值', 'B', 'COUNTIF 依條件計算符合的儲存格個數。'],
  ['PowerPoint 投影片可插入「螢幕錄製」，錄製內容為？', '僅音訊', '僅視訊', '螢幕畫面與選用音訊', '僅投影片', 'C', '螢幕錄製可錄製螢幕畫面並可包含音訊。'],
  ['Excel 中 A1 到 A4 為 2,4,6,8，=SUM(A1:A4)/4 結果為？', '5', '20', '4', '6', 'A', '總和 20，20/4 = 5。'],
  ['Word 中「目錄」更新時可選擇？', '僅更新頁碼', '更新整個目錄', '以上皆是', '無法更新', 'C', '更新目錄時可選只更新頁碼或更新整個目錄。'],
  ['Excel 中 =ROUND(2.5,0) 結果為？（依 Excel 四捨五入規則）', '2', '3', '2.5', '0', 'B', 'ROUND(2.5,0) 四捨五入到整數為 3。'],
  ['PowerPoint 中「投影片放映」從目前投影片開始的快速鍵為？', 'F5', 'Shift+F5', 'Ctrl+F5', 'Alt+F5', 'B', 'Shift+F5 從目前投影片開始放映；F5 從第一張開始。'],
  ['Excel 中 =AVERAGE(10,20,30) 結果為？', '20', '60', '30', '15', 'A', '平均 = (10+20+30)/3 = 20。'],
  ['Word 中「插入」→「表格」可？', '僅插入固定欄列', '插入表格或手繪', '僅手繪', '僅從 Excel 貼上', 'B', '可插入指定欄列數的表格或手繪表格。'],
  ['Excel 中 B2 公式 =$A$1+1，複製 B2 到 C4 後 C4 公式為？', '=$A$1+1', '=$B$3+1', '=A1+1', '=B3+1', 'A', '絕對參照 $A$1 不變，故仍為 =$A$1+1。'],
  ['PowerPoint 投影片「備忘稿」的用途為？', '投影片上的文字', '講者備忘、觀眾看不到', '標題', '動畫', 'B', '備忘稿供講者檢視，放映時觀眾看不到。'],
]
excelOffice.forEach((row, idx) => {
  const [question, a, b, c, d, correctKey, explanation] = row
  list.push(q(401 + idx, question, opts(a, b, c, d), correctKey, explanation))
})

// ---------- 更多數據分析：總和、平均、比例 (451–500) ----------
for (let i = 451; i <= 500; i++) {
  const n = i - 450
  const a = 5 + (n % 15)
  const b = 10 + (n % 20)
  const c = 15 + (n % 10)
  const d = 20 + (n % 15)
  const e = 8 + (n % 12)
  const total = a + b + c + d + e
  const avg = total / 5
  const ans = avg % 1 === 0 ? avg : Math.round(avg * 10) / 10
  const wrongs = [ans - 2, ans - 1, ans + 1, ans + 2].filter((v) => v > 0 && v !== ans)
  const optsArr = [...new Set([ans, wrongs[0], wrongs[1], wrongs[2]])].sort((u, v) => u - v).slice(0, 4)
  if (!optsArr.includes(ans)) optsArr[0] = ans
  const keys = ['A', 'B', 'C', 'D']
  const idx = optsArr.indexOf(ans)
  list.push(
    q(
      i,
      `下表為五個分項的數值：${a}、${b}、${c}、${d}、${e}。問五項的平均值？`,
      opts(String(optsArr[0]), String(optsArr[1]), String(optsArr[2]), String(optsArr[3])),
      keys[idx >= 0 ? idx : 0],
      `總和 = ${a}+${b}+${c}+${d}+${e} = ${total}，平均 = ${total} ÷ 5 = ${ans}。`
    )
  )
}

// 確保長度為 500
const finalList = list.slice(0, 500)
while (finalList.length < 500) {
  const i = finalList.length + 1
  const a = 10 + (i % 20)
  const b = 20 + (i % 15)
  const total = a + b
  finalList.push(
    q(i, `圖表顯示兩項數據為 ${a} 與 ${b}。問兩項合計？`, opts(String(total - 2), String(total), String(total + 2), String(total + 5)), 'B', `合計 = ${a} + ${b} = ${total}。`)
  )
}

export const questions430Chart = finalList.slice(0, 500)
