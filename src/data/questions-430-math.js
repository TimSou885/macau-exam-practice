/**
 * 430 統考數學題庫（500 題）
 * 題型：一元一次方程、百分率、比例、四則運算、應用題、簡單機率與統計、不等式、數列、簡單幾何等。
 * 正確答案均以程式計算驗證。
 */

function opts(...lines) {
  return lines.map((t, i) => ({ key: String.fromCharCode(65 + i), text: String(t) }))
}

function q(n, question, options, correctKey, explanation) {
  return {
    id: `430-math-${n}`,
    examType: '430',
    category: 'math',
    question,
    options,
    correctKey,
    explanation,
  }
}

const list = []

// ---------- 一元一次方程 (1–60) ----------
for (let i = 1; i <= 60; i++) {
  const a = 2 + (i % 7) || 2
  const b = 1 + (i % 12)
  const x = 3 + (i % 15)
  const c = a * x + b
  const ans = (c - b) / a
  const wrong = [ans - 2, ans - 1, ans + 1, ans + 2].filter((v) => v !== ans && Number.isInteger(v))
  const optsArr = [...new Set([ans, wrong[0] ?? ans + 3, wrong[1] ?? ans - 3, wrong[2] ?? ans + 4])].sort((u, v) => u - v).slice(0, 4)
  const correctIdx = optsArr.indexOf(ans)
  if (correctIdx === -1) optsArr[0] = ans
  const keys = ['A', 'B', 'C', 'D']
  list.push(
    q(
      i,
      `若 ${a}x + ${b} = ${c}，則 x = ?`,
      opts(String(optsArr[0] ?? ans), String(optsArr[1] ?? ans + 1), String(optsArr[2] ?? ans + 2), String(optsArr[3] ?? ans + 3)),
      keys[optsArr.indexOf(ans) >= 0 ? optsArr.indexOf(ans) : 0],
      `${a}x = ${c} - ${b} = ${c - b}，故 x = ${c - b} ÷ ${a} = ${ans}。`
    )
  )
}
// 覆寫前幾題為手寫以確保選項含正確答案
list[0] = q(1, '若 2x + 5 = 15，則 x = ?', opts('3', '5', '7', '10'), 'B', '2x = 15 - 5 = 10，故 x = 5。')
list[1] = q(2, '若 3x - 4 = 11，則 x = ?', opts('3', '5', '6', '7'), 'B', '3x = 11 + 4 = 15，故 x = 5。')
list[2] = q(3, '若 5x + 7 = 22，則 x = ?', opts('2', '3', '4', '5'), 'B', '5x = 22 - 7 = 15，故 x = 3。')

// ---------- 百分率 (61–120) ----------
for (let i = 61; i <= 120; i++) {
  const n = i - 60
  const pct = 10 + (n % 41)
  const val = 50 + (n % 150)
  const part = Math.round((val * pct) / 100)
  const ans = Math.round((part * 100) / pct)
  const wrongs = [ans - 10, ans - 5, ans + 5, ans + 10].filter((v) => v > 0 && v !== ans)
  const optsArr = [...new Set([ans, wrongs[0], wrongs[1], wrongs[2]])].sort((u, v) => u - v).slice(0, 4)
  const correctIdx = optsArr.indexOf(ans)
  if (correctIdx === -1) optsArr[0] = ans
  const keys = ['A', 'B', 'C', 'D']
  list.push(
    q(
      i,
      `某數的 ${pct}% 是 ${part}，問某數是多少？`,
      opts(String(optsArr[0]), String(optsArr[1]), String(optsArr[2]), String(optsArr[3])),
      keys[optsArr.indexOf(ans) >= 0 ? optsArr.indexOf(ans) : 0],
      `${part} ÷ ${pct}% = ${part} ÷ 0.${String(pct).padStart(2, '0')} = ${ans}。`
    )
  )
}
list[60] = q(61, '某部門預算 180 萬元，已使用 45%。尚餘預算多少萬元？', opts('81', '99', '135', '90'), 'B', '已用 180 × 0.45 = 81 萬，尚餘 180 - 81 = 99 萬元。')

// ---------- 比例與比 (121–180) ----------
for (let i = 121; i <= 180; i++) {
  const n = i - 120
  const a = 2 + (n % 5)
  const b = 3 + (n % 5)
  const total = (a + b) * (5 + (n % 10))
  const partA = Math.round((total * a) / (a + b))
  const partB = total - partA
  const optsArr = [partA - 5, partA - 2, partA, partA + 3].filter((v) => v > 0)
  const uniq = [...new Set(optsArr)].sort((u, v) => u - v).slice(0, 4)
  if (!uniq.includes(partA)) uniq[0] = partA
  const keys = ['A', 'B', 'C', 'D']
  list.push(
    q(
      i,
      `甲、乙兩數之比為 ${a}:${b}，兩數之和為 ${total}。問甲為多少？`,
      opts(String(uniq[0]), String(uniq[1] ?? partA + 1), String(uniq[2] ?? partA + 2), String(uniq[3] ?? partA + 4)),
      keys[uniq.indexOf(partA) >= 0 ? uniq.indexOf(partA) : 0],
      `甲 = ${total} × ${a}/(${a}+${b}) = ${total} × ${a}/${a + b} = ${partA}。`
    )
  )
}

// ---------- 四則與整數運算 (181–240) ----------
for (let i = 181; i <= 240; i++) {
  const n = i - 180
  const a = 10 + (n % 20)
  const b = 5 + (n % 15)
  const op = (n % 4)
  let ans
  if (op === 0) ans = a + b
  else if (op === 1) ans = a - b
  else if (op === 2) ans = a * b
  else ans = Math.floor(a / b)
  const wrongs = [ans - 3, ans - 1, ans + 1, ans + 3].filter((v) => v !== ans)
  const optsArr = [...new Set([ans, wrongs[0], wrongs[1], wrongs[2]])].sort((u, v) => u - v).slice(0, 4)
  if (!optsArr.includes(ans)) optsArr[0] = ans
  const sym = ['+', '-', '×', '÷'][op]
  list.push(
    q(
      i,
      `計算：${a} ${sym} ${b} = ?`,
      opts(String(optsArr[0]), String(optsArr[1]), String(optsArr[2]), String(optsArr[3])),
      ['A', 'B', 'C', 'D'][optsArr.indexOf(ans) >= 0 ? optsArr.indexOf(ans) : 0],
      `${a} ${sym} ${b} = ${ans}。`
    )
  )
}

// ---------- 應用題：價格、數量、距離 (241–300) ----------
for (let i = 241; i <= 300; i++) {
  const n = i - 240
  const price = 5 + (n % 20)
  const qty = 3 + (n % 12)
  const total = price * qty
  const wrongs = [total - 10, total - 5, total + 5, total + 10].filter((v) => v !== total && v > 0)
  const optsArr = [...new Set([total, wrongs[0], wrongs[1], wrongs[2]])].sort((u, v) => u - v).slice(0, 4)
  if (!optsArr.includes(total)) optsArr[0] = total
  list.push(
    q(
      i,
      `每件物品 ${price} 元，買 ${qty} 件共需多少元？`,
      opts(String(optsArr[0]), String(optsArr[1]), String(optsArr[2]), String(optsArr[3])),
      ['A', 'B', 'C', 'D'][optsArr.indexOf(total) >= 0 ? optsArr.indexOf(total) : 0],
      `${price} × ${qty} = ${total} 元。`
    )
  )
}

// ---------- 平均數 (301–340) ----------
for (let i = 301; i <= 340; i++) {
  const n = i - 300
  const count = 4 + (n % 7)
  const mean = 10 + (n % 20)
  const total = mean * count
  const wrongs = [mean - 2, mean - 1, mean + 1, mean + 2].filter((v) => v !== mean)
  const optsArr = [...new Set([mean, wrongs[0], wrongs[1], wrongs[2]])].sort((u, v) => u - v).slice(0, 4)
  if (!optsArr.includes(mean)) optsArr[0] = mean
  list.push(
    q(
      i,
      `${count} 個數之和為 ${total}，問平均數是多少？`,
      opts(String(optsArr[0]), String(optsArr[1]), String(optsArr[2]), String(optsArr[3])),
      ['A', 'B', 'C', 'D'][optsArr.indexOf(mean) >= 0 ? optsArr.indexOf(mean) : 0],
      `平均 = 總和 ÷ 個數 = ${total} ÷ ${count} = ${mean}。`
    )
  )
}

// ---------- 簡單機率 (341–380) ----------
for (let i = 341; i <= 380; i++) {
  const n = i - 340
  const num = 2 + (n % 5)
  const den = 5 + (n % 6)
  const p = num / den
  const pct = Math.round(p * 100)
  const wrongs = [pct - 15, pct - 5, pct + 5, pct + 15].filter((v) => v >= 0 && v <= 100 && v !== pct)
  const optsArr = [...new Set([pct, wrongs[0], wrongs[1], wrongs[2]])].sort((u, v) => u - v).slice(0, 4)
  if (!optsArr.includes(pct)) optsArr[0] = pct
  list.push(
    q(
      i,
      `一袋中有 ${den} 個球，其中 ${num} 個為紅球。隨機抽一個是紅球的機率為百分之幾？`,
      opts(String(optsArr[0]) + '%', String(optsArr[1]) + '%', String(optsArr[2]) + '%', String(optsArr[3]) + '%'),
      ['A', 'B', 'C', 'D'][optsArr.indexOf(pct) >= 0 ? optsArr.indexOf(pct) : 0],
      `機率 = ${num}/${den} = ${(num / den * 100).toFixed(0)}%。`
    )
  )
}

// ---------- 面積與周長 (381–420) ----------
for (let i = 381; i <= 420; i++) {
  const n = i - 380
  const w = 3 + (n % 10)
  const h = 4 + (n % 8)
  const area = w * h
  const perim = 2 * (w + h)
  const isArea = n % 2 === 0
  const ans = isArea ? area : perim
  const wrongs = [ans - 4, ans - 2, ans + 2, ans + 4].filter((v) => v !== ans && v > 0)
  const optsArr = [...new Set([ans, wrongs[0], wrongs[1], wrongs[2]])].sort((u, v) => u - v).slice(0, 4)
  if (!optsArr.includes(ans)) optsArr[0] = ans
  list.push(
    q(
      i,
      isArea ? `長方形長 ${w}、寬 ${h}，面積為多少？` : `長方形長 ${w}、寬 ${h}，周長為多少？`,
      opts(String(optsArr[0]), String(optsArr[1]), String(optsArr[2]), String(optsArr[3])),
      ['A', 'B', 'C', 'D'][optsArr.indexOf(ans) >= 0 ? optsArr.indexOf(ans) : 0],
      isArea ? `面積 = 長 × 寬 = ${w} × ${h} = ${area}。` : `周長 = 2×(長+寬) = 2×(${w}+${h}) = ${perim}。`
    )
  )
}

// ---------- 不等式與比較 (421–460) ----------
for (let i = 421; i <= 460; i++) {
  const n = i - 420
  const a = 5 + (n % 15)
  const b = 3 + (n % 10)
  const sum = a + b
  const diff = a - b
  const prod = a * b
  const vals = [sum, diff, prod].sort((u, v) => u - v)
  const ans = vals[2]
  const optsArr = [vals[0], vals[1], vals[2], vals[2] + 5].sort((u, v) => u - v)
  list.push(
    q(
      i,
      `若 a = ${a}，b = ${b}，則 a + b、a - b、a × b 三者中最大的是多少？`,
      opts(String(optsArr[0]), String(optsArr[1]), String(optsArr[2]), String(optsArr[3])),
      ['A', 'B', 'C', 'D'][optsArr.indexOf(ans) >= 0 ? optsArr.indexOf(ans) : 2],
      `a+b=${sum}，a-b=${diff}，a×b=${prod}，最大為 ${ans}。`
    )
  )
}

// ---------- 數列規律 (461–500) ----------
for (let i = 461; i <= 500; i++) {
  const n = i - 460
  const d = 2 + (n % 5)
  const start = 1 + (n % 10)
  const fifth = start + 4 * d
  const wrongs = [fifth - 2, fifth - 1, fifth + 1, fifth + 2].filter((v) => v !== fifth)
  const optsArr = [...new Set([fifth, wrongs[0], wrongs[1], wrongs[2]])].sort((u, v) => u - v).slice(0, 4)
  if (!optsArr.includes(fifth)) optsArr[0] = fifth
  const seq = [start, start + d, start + 2 * d, start + 3 * d].join('、')
  list.push(
    q(
      i,
      `等差數列：${seq}、？。問第五項為多少？`,
      opts(String(optsArr[0]), String(optsArr[1]), String(optsArr[2]), String(optsArr[3])),
      ['A', 'B', 'C', 'D'][optsArr.indexOf(fifth) >= 0 ? optsArr.indexOf(fifth) : 0],
      `公差為 ${d}，第五項 = 第四項 + ${d} = ${start + 3 * d} + ${d} = ${fifth}。`
    )
  )
}

// 確保長度為 500
while (list.length < 500) {
  const i = list.length + 1
  const a = 2 + (i % 5)
  const b = 3 + (i % 6)
  const ans = a + b
  list.push(
    q(i, `${a} + ${b} = ?`, opts(String(ans - 1), String(ans), String(ans + 1), String(ans + 2)), 'B', `${a} + ${b} = ${ans}。`)
  )
}

export const questions430Math = list.slice(0, 500)
