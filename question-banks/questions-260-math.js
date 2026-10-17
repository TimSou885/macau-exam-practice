/**
 * 260 統考數學題庫（500 題）
 * 題型：一元一次方程、百分率、比例、四則運算、應用題（文件字數、單價數量、預算）、平均、簡單機率、面積周長、不等式與比較、數列、混合應用等。
 * 正確答案均以程式計算驗證，題型與數字與 430 數學題庫區分以增加多樣性。
 */

function opts(...lines) {
  return lines.map((t, i) => ({ key: String.fromCharCode(65 + i), text: String(t) }))
}

function q(n, question, options, correctKey, explanation) {
  return {
    id: `260-math-${n}`,
    examType: '260',
    category: 'math',
    question,
    options,
    correctKey,
    explanation,
  }
}

const list = []

// ---------- 一元一次方程 (1–55) ----------
for (let i = 1; i <= 55; i++) {
  const a = 2 + (i % 6) || 2
  const b = 1 + (i % 10)
  const x = 2 + (i % 12)
  const c = a * x + b
  const ans = (c - b) / a
  const wrong = [ans - 2, ans - 1, ans + 1, ans + 2].filter((v) => v !== ans && Number.isInteger(v))
  const optsArr = [...new Set([ans, wrong[0] ?? ans + 3, wrong[1] ?? ans - 3, wrong[2] ?? ans + 4])].sort((u, v) => u - v).slice(0, 4)
  if (optsArr.indexOf(ans) === -1) optsArr[0] = ans
  const keyIdx = optsArr.indexOf(ans) >= 0 ? optsArr.indexOf(ans) : 0
  list.push(
    q(
      i,
      `若 ${a}x + ${b} = ${c}，則 x = ?`,
      opts(String(optsArr[0]), String(optsArr[1]), String(optsArr[2]), String(optsArr[3])),
      ['A', 'B', 'C', 'D'][keyIdx],
      `${a}x = ${c} - ${b} = ${c - b}，故 x = ${c - b} ÷ ${a} = ${ans}。`
    )
  )
}
list[0] = q(1, '若 2x + 5 = 15，則 x = ?', opts('3', '5', '7', '10'), 'B', '2x = 15 - 5 = 10，故 x = 5。')
list[1] = q(2, '若 3x - 4 = 11，則 x = ?', opts('3', '5', '6', '7'), 'B', '3x = 11 + 4 = 15，故 x = 5。')
list[2] = q(3, '若 4x + 3 = 19，則 x = ?', opts('3', '4', '5', '6'), 'B', '4x = 19 - 3 = 16，故 x = 4。')

// ---------- 百分率 (56–110) ----------
for (let i = 56; i <= 110; i++) {
  const n = i - 55
  const pct = 10 + (n % 35)
  const val = 40 + (n % 120)
  const part = Math.round((val * pct) / 100)
  const ans = Math.round((part * 100) / pct)
  const wrongs = [ans - 10, ans - 5, ans + 5, ans + 10].filter((v) => v > 0 && v !== ans)
  const optsArr = [...new Set([ans, wrongs[0], wrongs[1], wrongs[2]])].sort((u, v) => u - v).slice(0, 4)
  if (!optsArr.includes(ans)) optsArr[0] = ans
  const keyIdx = optsArr.indexOf(ans) >= 0 ? optsArr.indexOf(ans) : 0
  list.push(
    q(
      i,
      `某數的 ${pct}% 是 ${part}，問某數是多少？`,
      opts(String(optsArr[0]), String(optsArr[1]), String(optsArr[2]), String(optsArr[3])),
      ['A', 'B', 'C', 'D'][keyIdx],
      `${part} ÷ ${pct}% = ${ans}。`
    )
  )
}
list[55] = q(56, '某部門預算 120 萬元，已使用 40%。尚餘預算多少萬元？', opts('48', '72', '80', '90'), 'B', '已用 120 × 0.4 = 48 萬，尚餘 120 - 48 = 72 萬元。')

// ---------- 比例與比 (111–165) ----------
for (let i = 111; i <= 165; i++) {
  const n = i - 110
  const a = 2 + (n % 4)
  const b = 3 + (n % 4)
  const total = (a + b) * (4 + (n % 8))
  const partA = Math.round((total * a) / (a + b))
  const wrongs = [partA - 5, partA - 2, partA + 2, partA + 5].filter((v) => v > 0 && v !== partA)
  const optsArr = [...new Set([partA, wrongs[0], wrongs[1], wrongs[2]])].sort((u, v) => u - v).slice(0, 4)
  if (!optsArr.includes(partA)) optsArr[0] = partA
  const keyIdx = optsArr.indexOf(partA) >= 0 ? optsArr.indexOf(partA) : 0
  list.push(
    q(
      i,
      `甲、乙兩數之比為 ${a}:${b}，兩數之和為 ${total}。問甲為多少？`,
      opts(String(optsArr[0]), String(optsArr[1]), String(optsArr[2]), String(optsArr[3])),
      ['A', 'B', 'C', 'D'][keyIdx],
      `甲 = ${total} × ${a}/(${a}+${b}) = ${partA}。`
    )
  )
}

// ---------- 四則與整數運算 (166–215) ----------
for (let i = 166; i <= 215; i++) {
  const n = i - 165
  const a = 8 + (n % 18)
  const b = 4 + (n % 12)
  const op = n % 4
  let ans
  if (op === 0) ans = a + b
  else if (op === 1) ans = a - b
  else if (op === 2) ans = a * b
  else ans = Math.floor(a / b)
  const wrongs = [ans - 3, ans - 1, ans + 1, ans + 3].filter((v) => v !== ans)
  const optsArr = [...new Set([ans, wrongs[0], wrongs[1], wrongs[2]])].sort((u, v) => u - v).slice(0, 4)
  if (!optsArr.includes(ans)) optsArr[0] = ans
  const sym = ['+', '-', '×', '÷'][op]
  const keyIdx = optsArr.indexOf(ans) >= 0 ? optsArr.indexOf(ans) : 0
  list.push(
    q(
      i,
      `計算：${a} ${sym} ${b} = ?`,
      opts(String(optsArr[0]), String(optsArr[1]), String(optsArr[2]), String(optsArr[3])),
      ['A', 'B', 'C', 'D'][keyIdx],
      `${a} ${sym} ${b} = ${ans}。`
    )
  )
}

// ---------- 應用題：文件頁數×字數、單價×數量 (216–270) ----------
for (let i = 216; i <= 245; i++) {
  const n = i - 215
  const pages = 15 + (n % 25)
  const wordsPerPage = 200 + (n % 200)
  const total = pages * wordsPerPage
  const wrongs = [total - 500, total - 200, total + 200, total + 500].filter((v) => v > 0 && v !== total)
  const optsArr = [...new Set([total, wrongs[0], wrongs[1], wrongs[2]])].sort((u, v) => u - v).slice(0, 4)
  if (!optsArr.includes(total)) optsArr[0] = total
  const keyIdx = optsArr.indexOf(total) >= 0 ? optsArr.indexOf(total) : 0
  list.push(
    q(
      i,
      `一份文件共 ${pages} 頁，每頁平均 ${wordsPerPage} 字。全文約多少字？`,
      opts(String(optsArr[0]), String(optsArr[1]), String(optsArr[2]), String(optsArr[3])),
      ['A', 'B', 'C', 'D'][keyIdx],
      `${pages} × ${wordsPerPage} = ${total} 字。`
    )
  )
}
list[215] = q(216, '一份文件共 24 頁，每頁平均 350 字。全文約多少字？', opts('7200', '8400', '9600', '10800'), 'B', '24 × 350 = 8400 字。')

for (let i = 246; i <= 270; i++) {
  const n = i - 245
  const price = 6 + (n % 18)
  const qty = 4 + (n % 15)
  const total = price * qty
  const wrongs = [total - 15, total - 5, total + 5, total + 15].filter((v) => v > 0 && v !== total)
  const optsArr = [...new Set([total, wrongs[0], wrongs[1], wrongs[2]])].sort((u, v) => u - v).slice(0, 4)
  if (!optsArr.includes(total)) optsArr[0] = total
  const keyIdx = optsArr.indexOf(total) >= 0 ? optsArr.indexOf(total) : 0
  list.push(
    q(
      i,
      `每件物品 ${price} 元，買 ${qty} 件共需多少元？`,
      opts(String(optsArr[0]), String(optsArr[1]), String(optsArr[2]), String(optsArr[3])),
      ['A', 'B', 'C', 'D'][keyIdx],
      `${price} × ${qty} = ${total} 元。`
    )
  )
}

// ---------- 平均數 (271–310) ----------
for (let i = 271; i <= 310; i++) {
  const n = i - 270
  const count = 4 + (n % 6)
  const mean = 12 + (n % 18)
  const total = mean * count
  const wrongs = [mean - 2, mean - 1, mean + 1, mean + 2].filter((v) => v !== mean)
  const optsArr = [...new Set([mean, wrongs[0], wrongs[1], wrongs[2]])].sort((u, v) => u - v).slice(0, 4)
  if (!optsArr.includes(mean)) optsArr[0] = mean
  const keyIdx = optsArr.indexOf(mean) >= 0 ? optsArr.indexOf(mean) : 0
  list.push(
    q(
      i,
      `${count} 個數之和為 ${total}，問平均數是多少？`,
      opts(String(optsArr[0]), String(optsArr[1]), String(optsArr[2]), String(optsArr[3])),
      ['A', 'B', 'C', 'D'][keyIdx],
      `平均 = ${total} ÷ ${count} = ${mean}。`
    )
  )
}

// ---------- 簡單機率 (311–350) ----------
for (let i = 311; i <= 350; i++) {
  const n = i - 310
  const num = 2 + (n % 5)
  const den = 6 + (n % 7)
  const pct = Math.round((num / den) * 100)
  const wrongs = [pct - 15, pct - 5, pct + 5, pct + 15].filter((v) => v >= 0 && v <= 100 && v !== pct)
  const optsArr = [...new Set([pct, wrongs[0], wrongs[1], wrongs[2]])].sort((u, v) => u - v).slice(0, 4)
  if (!optsArr.includes(pct)) optsArr[0] = pct
  const keyIdx = optsArr.indexOf(pct) >= 0 ? optsArr.indexOf(pct) : 0
  list.push(
    q(
      i,
      `一袋中有 ${den} 個球，其中 ${num} 個為紅球。隨機抽一個是紅球的機率為百分之幾？`,
      opts(String(optsArr[0]) + '%', String(optsArr[1]) + '%', String(optsArr[2]) + '%', String(optsArr[3]) + '%'),
      ['A', 'B', 'C', 'D'][keyIdx],
      `機率 = ${num}/${den} ≈ ${pct}%。`
    )
  )
}

// ---------- 面積與周長 (351–395) ----------
for (let i = 351; i <= 395; i++) {
  const n = i - 350
  const w = 3 + (n % 9)
  const h = 4 + (n % 7)
  const area = w * h
  const perim = 2 * (w + h)
  const isArea = n % 2 === 0
  const ans = isArea ? area : perim
  const wrongs = [ans - 4, ans - 2, ans + 2, ans + 4].filter((v) => v !== ans && v > 0)
  const optsArr = [...new Set([ans, wrongs[0], wrongs[1], wrongs[2]])].sort((u, v) => u - v).slice(0, 4)
  if (!optsArr.includes(ans)) optsArr[0] = ans
  const keyIdx = optsArr.indexOf(ans) >= 0 ? optsArr.indexOf(ans) : 0
  list.push(
    q(
      i,
      isArea ? `長方形長 ${w}、寬 ${h}，面積為多少？` : `長方形長 ${w}、寬 ${h}，周長為多少？`,
      opts(String(optsArr[0]), String(optsArr[1]), String(optsArr[2]), String(optsArr[3])),
      ['A', 'B', 'C', 'D'][keyIdx],
      isArea ? `面積 = ${w} × ${h} = ${area}。` : `周長 = 2×(${w}+${h}) = ${perim}。`
    )
  )
}

// ---------- 不等式與比較 (396–435) ----------
for (let i = 396; i <= 435; i++) {
  const n = i - 395
  const a = 4 + (n % 14)
  const b = 2 + (n % 9)
  const sum = a + b
  const diff = a - b
  const prod = a * b
  const vals = [sum, diff, prod].filter((v) => Number.isInteger(v) && v > 0)
  const ans = Math.max(...vals)
  const optsArr = [...new Set([sum, diff, prod, ans + 3])].sort((u, v) => u - v).slice(0, 4)
  const keyIdx = optsArr.indexOf(ans) >= 0 ? optsArr.indexOf(ans) : 0
  list.push(
    q(
      i,
      `若 a = ${a}，b = ${b}，則 a + b、a - b、a × b 三者中最大的是多少？`,
      opts(String(optsArr[0]), String(optsArr[1]), String(optsArr[2]), String(optsArr[3])),
      ['A', 'B', 'C', 'D'][keyIdx],
      `a+b=${sum}，a-b=${diff}，a×b=${prod}，最大為 ${ans}。`
    )
  )
}

// ---------- 數列規律 (436–475) ----------
for (let i = 436; i <= 475; i++) {
  const n = i - 435
  const d = 2 + (n % 5)
  const start = 1 + (n % 9)
  const fifth = start + 4 * d
  const wrongs = [fifth - 2, fifth - 1, fifth + 1, fifth + 2].filter((v) => v !== fifth)
  const optsArr = [...new Set([fifth, wrongs[0], wrongs[1], wrongs[2]])].sort((u, v) => u - v).slice(0, 4)
  if (!optsArr.includes(fifth)) optsArr[0] = fifth
  const seq = [start, start + d, start + 2 * d, start + 3 * d].join('、')
  const keyIdx = optsArr.indexOf(fifth) >= 0 ? optsArr.indexOf(fifth) : 0
  list.push(
    q(
      i,
      `等差數列：${seq}、？。問第五項為多少？`,
      opts(String(optsArr[0]), String(optsArr[1]), String(optsArr[2]), String(optsArr[3])),
      ['A', 'B', 'C', 'D'][keyIdx],
      `公差為 ${d}，第五項 = 第四項 + ${d} = ${fifth}。`
    )
  )
}

// ---------- 混合應用：剩餘預算 (476–500) ----------
for (let i = 476; i <= 500; i++) {
  const n = i - 475
  const total = 100 + (n % 60)
  const used = 25 + (n % 35)
  const remain = total - used
  const wrongs = [remain - 5, remain - 2, remain + 2, remain + 5].filter((v) => v > 0 && v !== remain)
  const optsArr = [...new Set([remain, wrongs[0], wrongs[1], wrongs[2]])].sort((u, v) => u - v).slice(0, 4)
  if (!optsArr.includes(remain)) optsArr[0] = remain
  const keyIdx = optsArr.indexOf(remain) >= 0 ? optsArr.indexOf(remain) : 0
  list.push(
    q(
      i,
      `某筆預算共 ${total} 萬元，已使用 ${used} 萬元。尚餘多少萬元？`,
      opts(String(optsArr[0]), String(optsArr[1]), String(optsArr[2]), String(optsArr[3])),
      ['A', 'B', 'C', 'D'][keyIdx],
      `尚餘 = ${total} - ${used} = ${remain} 萬元。`
    )
  )
}

// 若混合應用不足 25 題，用填空補足
while (list.length < 500) {
  const i = list.length + 1
  const a = 3 + (i % 6)
  const b = 2 + (i % 5)
  const ans = a + b
  list.push(
    q(
      i,
      `${a} + ${b} = ?`,
      opts(String(ans - 1), String(ans), String(ans + 1), String(ans + 2)),
      'B',
      `${a} + ${b} = ${ans}。`
    )
  )
}

export const questions260Math = list.slice(0, 500)
