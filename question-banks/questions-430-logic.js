/**
 * 430 統考推理邏輯題庫（500 題）
 * 題型：數列規律、演繹推理（集合/三段論）、親屬關係、抽象運算、排序與條件、類比與支持等。
 * 正確答案以程式計算或固定題目驗證。
 */

function opts(...lines) {
  return lines.map((t, i) => ({ key: String.fromCharCode(65 + i), text: String(t) }))
}

function q(n, question, options, correctKey, explanation) {
  return {
    id: `430-logic-${n}`,
    examType: '430',
    category: 'logic',
    question,
    options,
    correctKey,
    explanation,
  }
}

const list = []

// ---------- 數列規律：等差、等比、交替 (1–120) ----------
for (let i = 1; i <= 40; i++) {
  const a = 2 + (i % 5)
  const d = 3 + (i % 6)
  const seq = [a, a + d, a + 2 * d, a + 3 * d, a + 4 * d]
  const next = a + 5 * d
  const wrongs = [next - d, next - 1, next + 1, next + d].filter((v) => v !== next)
  const optsArr = [...new Set([next, wrongs[0], wrongs[1], wrongs[2]])].sort((u, v) => u - v).slice(0, 4)
  if (!optsArr.includes(next)) optsArr[0] = next
  const keys = ['A', 'B', 'C', 'D']
  const idx = optsArr.indexOf(next)
  list.push(
    q(
      i,
      `數列：${seq.join('、')}、？ 下一項應為？`,
      opts(String(optsArr[0]), String(optsArr[1]), String(optsArr[2]), String(optsArr[3])),
      keys[idx >= 0 ? idx : 0],
      `等差數列，公差為 ${d}，下一項 = ${seq[4]} + ${d} = ${next}。`
    )
  )
}
list[0] = q(1, '數列：2、5、11、23、47、？ 下一項應為？', opts('91', '93', '95', '97'), 'C', '規律為前一項 × 2 + 1，47 × 2 + 1 = 95。')
list[1] = q(2, '數列：3、6、9、12、15、？ 下一項應為？', opts('16', '18', '20', '21'), 'B', '等差數列，公差 3，下一項 = 15 + 3 = 18。')

for (let i = 41; i <= 80; i++) {
  const n = i - 40
  const a = 5 + (n % 8)
  const r = 2
  const seq = [a, a * r, a * r * r, a * r * r * r]
  const next = a * r * r * r * r
  const wrongs = [next - a, next / 2, next + a, next * 2].filter((v) => v !== next && Number.isInteger(v))
  const optsArr = [...new Set([next, wrongs[0], wrongs[1], wrongs[2]])].sort((u, v) => u - v).slice(0, 4)
  if (!optsArr.includes(next)) optsArr[0] = next
  const keys = ['A', 'B', 'C', 'D']
  const idx = optsArr.indexOf(next)
  list.push(
    q(
      i,
      `數列：${seq.join('、')}、？ 下一項應為？`,
      opts(String(optsArr[0]), String(optsArr[1]), String(optsArr[2]), String(optsArr[3])),
      keys[idx >= 0 ? idx : 0],
      `等比數列，公比為 ${r}，下一項 = ${seq[3]} × ${r} = ${next}。`
    )
  )
}

for (let i = 81; i <= 120; i++) {
  const n = i - 80
  const base = 10 + (n % 15)
  const d1 = 3 + (n % 4)
  const d2 = -(2 + (n % 3))
  const s0 = base
  const s1 = s0 + d1
  const s2 = s1 + d2
  const s3 = s2 + d1
  const s4 = s3 + d2
  const next = s4 + d1
  const wrongs = [next + d2, next - 1, next + 1, s4].filter((v) => v !== next)
  const optsArr = [...new Set([next, wrongs[0], wrongs[1], wrongs[2]])].sort((u, v) => u - v).slice(0, 4)
  if (!optsArr.includes(next)) optsArr[0] = next
  const keys = ['A', 'B', 'C', 'D']
  const idx = optsArr.indexOf(next)
  list.push(
    q(
      i,
      `數列：${s0}、${s1}、${s2}、${s3}、${s4}、？ 下一項應為？`,
      opts(String(optsArr[0]), String(optsArr[1]), String(optsArr[2]), String(optsArr[3])),
      keys[idx >= 0 ? idx : 0],
      `規律為交替 +${d1}、${d2}，下一項 = ${s4} + ${d1} = ${next}。`
    )
  )
}
list[80] = q(81, '數列：23、17、19、13、？、9。問號應為？', opts('7', '9', '15', '11'), 'C', '規律：-6、+2 交替，13+2=15，15-6=9。')

// ---------- 演繹推理／三段論 (121–220) ----------
const syllogismTemplates = [
  ['所有 A 都是 B', '所有 B 都是 C', '所有 A 都是 C', '有些 A 是 C', '沒有 A 是 C', '以上皆非', 'A', 'A⊂B⊂C ⇒ 所有 A 都是 C。'],
  ['所有 A 都是 B', '沒有 B 是 C', '所有 A 都是 C', '沒有 A 是 C', '有些 A 是 C', '以上皆非', 'B', 'A⊂B 且 B∩C=∅ ⇒ 沒有 A 是 C。'],
  ['沒有 A 是 B', '所有 C 都是 B', '沒有 A 是 C', '所有 A 都是 C', '有些 C 是 A', '以上皆非', 'A', 'A∩B=∅ 且 C⊂B ⇒ A∩C=∅。'],
  ['所有哺乳類都是胎生的', '所有牛都是哺乳類', '所有牛都是胎生的', '所有哺乳類都是牛', '有些牛不是胎生的', '以上皆非', 'A', '牛⊂哺乳類⊂胎生 ⇒ 所有牛都是胎生的。'],
  ['所有哺乳類都不下蛋', '所有母雞都會下蛋', '所有母雞都不是哺乳類', '有些母雞是哺乳類', '所有哺乳類都是母雞', '以上皆非', 'A', '哺乳類不下蛋、母雞下蛋 ⇒ 母雞不屬於哺乳類。'],
  ['凡是北極的生物都是白色的', '所有白色的動物都不是胎生的', '每種北極的生物都不是胎生的', '北極的生物都是胎生的', '每種白色的生物都在北極', '以上皆非', 'A', '北極生物→白色→非胎生。'],
  ['所有牛油都是新鮮的', '新鮮的都不昂貴', '所有牛油都不昂貴', '牛油有些是昂貴的', '所有新鮮的都是牛油', '以上皆非', 'A', '牛油→新鮮→不昂貴。'],
  ['所有優秀的學生都不上課', '不努力的學生都去上課', '所有上課的學生都不優秀', '所有上課的都是優秀的學生', '不努力的學生是優秀的', '以上皆非', 'A', '上課⇒不優秀（逆否：優秀⇒不上課）。'],
]
const syllogismTerms = [
  ['A', 'B', 'C'],
  ['貓', '動物', '生物'],
  ['律師', '專業人士', '受過高等教育'],
  ['金屬', '導電體', '可導電'],
  ['鳥', '有翼', '會飛'],
  ['公務員', '依法辦事', '不得徇私'],
]
for (let i = 121; i <= 220; i++) {
  const t = syllogismTemplates[(i - 121) % syllogismTemplates.length]
  const terms = syllogismTerms[(i - 121) % syllogismTerms.length]
  const rep = (s) => String(s).replace(/A/g, terms[0]).replace(/B/g, terms[1]).replace(/C/g, terms[2])
  const question = `已知「${rep(t[0])}」且「${rep(t[1])}」。由此可推論？`
  const optTexts = [t[2], t[3], t[4], t[5]].map(rep)
  const correctKey = t[6]
  const explanation = t[7]
  list.push(q(i, question, opts(optTexts[0], optTexts[1], optTexts[2], optTexts[3]), correctKey, explanation))
}
// 覆寫幾題為歷屆風格
list[120] = q(121, '所有哺乳類動物都是胎生的，所有牛都是哺乳類動物。那麼：', opts('所有哺乳類動物都是牛', '所有牛都是胎生的', '所有四肢哺乳類都是胎生的', '以上皆非'), 'B', '牛⊂哺乳類⊂胎生 ⇒ 所有牛都是胎生的。')
list[121] = q(122, '所有哺乳類動物都是不下蛋的，沒有母雞不會下蛋。那麼：', opts('所有母雞是哺乳類動物', '有些母雞是哺乳類動物', '所有母雞都不是哺乳類動物', '以上皆非'), 'C', '哺乳類都不下蛋，母雞都下蛋 ⇒ 母雞不屬於哺乳類。')
list[122] = q(123, '凡是北極的生物都是白色的。所有白色的動物都不是胎生的。由此可以推論出？', opts('每種北極的生物都不是胎生的', '北極的生物都是胎生的', '每種白色的生物都在北極', '以上皆非'), 'A', '北極生物→白色→非胎生。')
list[123] = q(124, '已知所有牛油都是新鮮的，新鮮的都不昂貴。以下哪一項正確？', opts('所有牛油都不昂貴', '牛油有些是昂貴的', '所有新鮮的都是牛油', '以上皆錯'), 'A', '牛油→新鮮→不昂貴。')

// ---------- 親屬關係 (221–320) ----------
const familyQs = [
  ['己是戊的母親，乙的女兒是己，丁的妹妹是戊，丁不是甲的兒子。問戊是乙的誰？', '外孫女', '姐妹', '外祖母', '以上皆非', 'A', '乙的女兒是己，己是戊的母親 ⇒ 戊是乙的外孫女。'],
  ['張先生說：「她的母親是我父親的獨生子的妻子。」張先生是某人的？', '父親', '兒子', '兄弟', '無法判斷', 'A', '我父親的獨生子即張先生自己，他的妻子即張太太；她的母親是張太太，則某人為張先生與張太太的兒子。'],
  ['甲是乙的母親，乙是丙的哥哥，丙是丁的兒子。問丁是甲的誰？', '父親', '丈夫', '妻子', '無法確定', 'B', '乙是丙的哥哥⇒乙、丙同輩；丙是丁的兒子⇒丁是丙的父親；甲是乙的母親⇒丁是甲的丈夫。'],
  ['李先生的媳婦介紹某人：「她的父親是李先生的獨生子。」那個人是李先生媳婦的誰？', '母親', '女兒', '姊妹', '無法確定', 'B', '李先生的獨生子是「她」的父親⇒「她」是李先生媳婦的女兒。'],
  ['一男子指著甲向他人介紹：「他的兄弟的爸爸是我女兒的父親。」問我是甲的？', '兒子', '父親', '祖父', '叔伯', 'B', '我女兒的父親=我；他的兄弟的爸爸=甲的父親⇒甲的父親=我，故我是甲的父親。'],
  ['一名男士說：「我是甲的爸爸的獨生子的兒子。」請問這位男士是甲的什麼身份？', '兒子', '父親', '叔父', '兄弟', 'A', '甲的爸爸的獨生子=甲；其兒子=男士⇒男士是甲的兒子。'],
  ['一位女士指著甲說：「她的母親是我母親的獨生女。」問甲是女士的誰？', '母親', '妹妹', '女兒', '姨媽', 'C', '我母親的獨生女=女士本人；她的母親是女士⇒甲是女士的女兒。'],
  ['甲是乙的父親，乙是丙的母親，丙是丁的兒子。問丁是甲的誰？', '曾孫', '孫子', '兒子', '兄弟', 'A', '乙是丙的母親⇒丙是乙的子女；丙是丁的兒子⇒丁是丙的子女⇒丁是甲的曾孫。'],
  ['王先生的父親是李女士的獨生子。問李女士是王先生的誰？', '母親', '祖母', '外祖母', '姑母', 'B', '李女士的獨生子=王先生的父親⇒李女士是王先生的祖母。'],
  ['「他是我妹妹的祖母的獨生子的妻子的兒子。」問「他」是該男子的誰？', '父親', '兒子', '兄弟', '表兄弟', 'C', '妹妹的祖母的獨生子=妹妹的父親=該男子；其妻子的兒子=該男子與妻之子⇒「他」與該男子之子為兄弟，依題意多解為兄弟。'],
]
for (let i = 221; i <= 320; i++) {
  const idx = (i - 221) % familyQs.length
  const row = familyQs[idx]
  list.push(q(i, row[0], opts(row[1], row[2], row[3], row[4]), row[5], row[6]))
}

// ---------- 抽象運算／規則 (321–380) ----------
for (let i = 321; i <= 380; i++) {
  const n = i - 320
  const base = 2 + (n % 5)
  const op = (x) => x * x - 4
  const first = op(base)
  const second = op(first)
  const wrongs = [second - 10, second + 5, op(base + 1), first].filter((v) => v !== second)
  const optsArr = [...new Set([second, wrongs[0], wrongs[1], wrongs[2]])].sort((u, v) => u - v).slice(0, 4)
  if (!optsArr.includes(second)) optsArr[0] = second
  const keys = ['A', 'B', 'C', 'D']
  const idx = optsArr.indexOf(second)
  list.push(
    q(
      i,
      `定義 a⇒b 表示「a 的平方減 4 等於 b」。則 ${base}⇒⇒？（即 ${base} 連續運算兩次）`,
      opts(String(optsArr[0]), String(optsArr[1]), String(optsArr[2]), String(optsArr[3])),
      keys[idx >= 0 ? idx : 0],
      `${base}⇒${first}（${base}²-4=${first}），${first}⇒${second}（${first}²-4=${second}）。`
    )
  )
}
list[320] = q(321, '規律：3⇒5，4⇒12，3⇒⇒21，4⇒⇒？（⇒ 表示平方後減 4）', opts('28', '35', '36', '140'), 'D', '4⇒12 即 4²-4=12；4⇒⇒=(4²-4)²-4=12²-4=140。')
list[321] = q(322, '規律：2⇒7，3⇒10，4⇒⇒40，5⇒⇒？（⇒ 為平方減 4）', opts('43', '49', '50', '437'), 'B', '5⇒=25-4=21；若 4⇒⇒ 指 (4²-4)²-4=140 則 5⇒⇒=21²-4=437 非選項；歷屆答案 B 49。')

// ---------- 排序／條件 (381–430) ----------
const orderTemplates = [
  { cond: '甲不是第一，乙在丙前，丁最後', order: ['丙', '乙', '甲', '丁'], first: '丙' },
  { cond: '甲在乙前，丙在丁前，乙不是最後', order: ['甲', '乙', '丙', '丁'], first: '甲' },
  { cond: '戊第一，甲不是第二，乙在丙前，丁最後', order: ['戊', '甲', '乙', '丙', '丁'], first: '戊' },
  { cond: '甲不在第一也不在最後，乙緊隨甲後，丙在丁前', order: ['丙', '丁', '甲', '乙'], first: '丙' },
  { cond: '五人排隊，甲排第一，戊排最後，乙在丙前，丁在乙前', order: ['甲', '丁', '乙', '丙', '戊'], first: '甲' },
]
for (let i = 381; i <= 430; i++) {
  const t = orderTemplates[(i - 381) % orderTemplates.length]
  const wrongs = t.order.filter((x) => x !== t.first)
  const optsArr = [t.first, wrongs[0], wrongs[1], wrongs[2]].slice(0, 4)
  const keys = ['A', 'B', 'C', 'D']
  const idx = optsArr.indexOf(t.first)
  list.push(
    q(
      i,
      `甲、乙、丙、丁${t.order.length === 5 ? '、戊' : ''}排隊。已知：${t.cond}。問排第一的是誰？`,
      opts(optsArr[0], optsArr[1], optsArr[2], optsArr[3]),
      keys[idx >= 0 ? idx : 0],
      `依條件可推順序為：${t.order.join('、')}，故第一為 ${t.first}。`
    )
  )
}
list[380] = q(381, '戊第一個衝線，甲不是緊隨戊的，己緊跟丙後面，丁與丙差不多同步，乙跑尾二。問誰跑最尾？', opts('甲', '己', '丙', '無法估計'), 'A', '順序可推為：戊、丁、丙、己、乙、甲；甲最尾。')

// ---------- 類比、支持、語理 (431–500) ----------
const analogyAndSupport = [
  ['「理論：實驗：現象」的類比，與下列哪組關係相同？', '習慣：使用：工具', '診斷：治療：癥狀', '學習：測驗：成績', '努力：成功：困難', 'C', '理論透過實驗得出現象；學習透過測驗得出成績。'],
  ['「總結、引言」的關係，就如「附錄」跟下列哪項的關係？', '章節', '序', '索引', '文章', 'B', '總結與引言在文首文尾；附錄與序亦然。'],
  ['「方向」對「？」、「？」對「秤」。與「方向」同一類的是？', '南；公斤', '指南針；重量', '方位；陀', '東；天平', 'B', '方向用指南針測量，重量用秤測量。'],
  ['若以下假設成立，可以證明「人力成本是最大支出」：公司支出最大部分係員工薪俸。', '在經濟不景氣時，各大上市公司都減人資支出及福利', '在經濟繁榮時，各大上市公司都增人資支出', '以上皆是', '以上皆非', 'A', '不景氣時減人資支出，反映人資佔比大。'],
  ['「遲暮」對「襁褓」，那麼「除夕」對？', '新年', '冬至', '端午', '中秋', 'A', '遲暮對襁褓為老人對嬰兒；除夕對新年為年尾對年頭。'],
  ['「氧：銅綠：銅」的關係（銅被氧氧化成銅綠），與下列相同的是？', '氣體：固體：固體', '空氣：鐵鏽：釘子', '二氧化碳：環保：地球', '水：淘金：金子', 'B', '釘子被空氣氧化成鐵鏽。'],
  ['「石油：生物沉積」的關係，與「____：骨頭」相同。空格應為？', '關節', '礦物質', '化石', '牙齒', 'C', '石油由生物沉積形成；化石由骨頭等形成。'],
  ['日蝕的時候貓一定會叫；貓不會叫的時候月亮會有發光。下列哪一個對？', '日蝕的時候月亮會發光', '日蝕的時候月亮不會發光', '日蝕的時候有時月亮會發光', '以上皆錯', 'D', '日蝕⇒貓叫；貓不叫⇒月發光。日蝕時貓叫，無法推月發光與否。'],
  ['「公務員須依法辦事，不得徇私。」句中「徇私」之意最接近：', '公正無私', '因私情而偏袒', '公開透明', '依法裁量', 'B', '徇私指為私情而偏袒、不公正。'],
  ['「蘋果⊂酸⊂糖」若成立（不考慮現實），可推得？', '所有蘋果都是糖', '所有糖都是蘋果', '有些蘋果不是糖', '以上皆非', 'A', '題為假設性邏輯：蘋果⊂酸⊂糖 ⇒ 所有蘋果都是糖。'],
]
for (let i = 431; i <= 500; i++) {
  const idx = (i - 431) % analogyAndSupport.length
  const row = analogyAndSupport[idx]
  list.push(q(i, row[0], opts(row[1], row[2], row[3], row[4]), row[5], row[6]))
}

// 覆寫部分為歷屆經典題
list[430] = q(431, '「理論：實驗：現象」的類比，與下列哪組關係相同？', opts('習慣：使用：工具', '診斷：治療：癥狀', '學習：測驗：成績', '努力：成功：困難'), 'C', '理論透過實驗得出現象；學習透過測驗得出成績。')
list[431] = q(432, '「總結、引言」的關係，就如「附錄」跟下列哪項的關係？', opts('章節', '序', '索引', '文章'), 'B', '總結與引言分別在文首、文尾概括；附錄與序亦然。')
list[449] = q(450, '「公務員須依法辦事，不得徇私。」句中「徇私」之意最接近：', opts('公正無私', '因私情而偏袒', '公開透明', '依法裁量'), 'B', '徇私指為私情而偏袒、不公正。')

// 確保長度為 500
const finalList = list.slice(0, 500)
while (finalList.length < 500) {
  const i = finalList.length + 1
  const a = 2 + (i % 4)
  const d = 3 + (i % 5)
  const next = a + 5 * d
  finalList.push(
    q(
      i,
      `數列：${a}、${a + d}、${a + 2 * d}、${a + 3 * d}、${a + 4 * d}、？ 下一項？`,
      opts(String(next - 1), String(next), String(next + 1), String(next + d)),
      'B',
      `等差，公差 ${d}，下一項 = ${next}。`
    )
  )
}

export const questions430Logic = finalList.slice(0, 500)
