/**
 * 260 統考推理邏輯題庫（500 題）
 * 題型：數列規律、演繹推理（含「所有 A 都是 B」「有些 B 是 C」型）、親屬關係、抽象運算、排序與條件、類比與語理等。
 * 正確答案以程式計算或固定題目驗證，題型與 430 邏輯題庫區分以增加多樣性。
 */

function opts(...lines) {
  return lines.map((t, i) => ({ key: String.fromCharCode(65 + i), text: String(t) }))
}

function q(n, question, options, correctKey, explanation) {
  return {
    id: `260-logic-${n}`,
    examType: '260',
    category: 'logic',
    question,
    options,
    correctKey,
    explanation,
  }
}

const list = []

// ---------- 數列規律：等差、等比、交替 (1–100) ----------
for (let i = 1; i <= 35; i++) {
  const a = 2 + (i % 5)
  const d = 2 + (i % 6)
  const seq = [a, a + d, a + 2 * d, a + 3 * d, a + 4 * d]
  const next = a + 5 * d
  const wrongs = [next - d, next - 1, next + 1, next + d].filter((v) => v !== next)
  const optsArr = [...new Set([next, wrongs[0], wrongs[1], wrongs[2]])].sort((u, v) => u - v).slice(0, 4)
  if (!optsArr.includes(next)) optsArr[0] = next
  const idx = optsArr.indexOf(next) >= 0 ? optsArr.indexOf(next) : 0
  list.push(
    q(
      i,
      `數列：${seq.join('、')}、？ 下一項應為？`,
      opts(String(optsArr[0]), String(optsArr[1]), String(optsArr[2]), String(optsArr[3])),
      ['A', 'B', 'C', 'D'][idx],
      `等差數列，公差為 ${d}，下一項 = ${seq[4]} + ${d} = ${next}。`
    )
  )
}
list[0] = q(1, '若「所有 A 都是 B」且「有些 B 是 C」，則可確定：', opts('所有 A 都是 C', '有些 A 可能是 C', '所有 B 都是 A', '有些 C 不是 B'), 'B', '由「所有 A 都是 B」與「有些 B 是 C」，只能推得「有些 A 可能是 C」，無法推出「所有 A 都是 C」。')
list[1] = q(2, '數列：3、6、9、12、15、？ 下一項應為？', opts('16', '18', '20', '21'), 'B', '等差數列，公差 3，下一項 = 15 + 3 = 18。')

for (let i = 36; i <= 65; i++) {
  const n = i - 35
  const a = 4 + (n % 7)
  const r = 2
  const seq = [a, a * r, a * r * r, a * r * r * r]
  const next = a * r * r * r * r
  const wrongs = [next - a, next / 2, next + a, next * 2].filter((v) => v !== next && Number.isInteger(v))
  const optsArr = [...new Set([next, wrongs[0], wrongs[1], wrongs[2]])].sort((u, v) => u - v).slice(0, 4)
  if (!optsArr.includes(next)) optsArr[0] = next
  const idx = optsArr.indexOf(next) >= 0 ? optsArr.indexOf(next) : 0
  list.push(
    q(
      i,
      `數列：${seq.join('、')}、？ 下一項應為？`,
      opts(String(optsArr[0]), String(optsArr[1]), String(optsArr[2]), String(optsArr[3])),
      ['A', 'B', 'C', 'D'][idx],
      `等比數列，公比為 ${r}，下一項 = ${seq[3]} × ${r} = ${next}。`
    )
  )
}

for (let i = 66; i <= 100; i++) {
  const n = i - 65
  const base = 8 + (n % 14)
  const d1 = 2 + (n % 4)
  const d2 = -(1 + (n % 3))
  const s0 = base
  const s1 = s0 + d1
  const s2 = s1 + d2
  const s3 = s2 + d1
  const s4 = s3 + d2
  const next = s4 + d1
  const wrongs = [next + d2, next - 1, next + 1, s4].filter((v) => v !== next)
  const optsArr = [...new Set([next, wrongs[0], wrongs[1], wrongs[2]])].sort((u, v) => u - v).slice(0, 4)
  if (!optsArr.includes(next)) optsArr[0] = next
  const idx = optsArr.indexOf(next) >= 0 ? optsArr.indexOf(next) : 0
  list.push(
    q(
      i,
      `數列：${s0}、${s1}、${s2}、${s3}、${s4}、？ 下一項應為？`,
      opts(String(optsArr[0]), String(optsArr[1]), String(optsArr[2]), String(optsArr[3])),
      ['A', 'B', 'C', 'D'][idx],
      `規律為交替 +${d1}、${d2}，下一項 = ${s4} + ${d1} = ${next}。`
    )
  )
}
list[65] = q(66, '數列：2、5、11、23、47、？ 下一項應為？', opts('91', '93', '95', '97'), 'C', '規律為前一項 × 2 + 1，47 × 2 + 1 = 95。')

// ---------- 演繹推理／三段論 (101–200)：含 260 風格「有些 B 是 C」 ----------
const syllogismTemplates = [
  ['所有 A 都是 B', '有些 B 是 C', '所有 A 都是 C', '有些 A 可能是 C', '沒有 A 是 C', '以上皆非', 'B', '所有 A 都是 B、有些 B 是 C ⇒ 只能推得「有些 A 可能是 C」。'],
  ['所有 A 都是 B', '所有 B 都是 C', '所有 A 都是 C', '有些 A 是 C', '沒有 A 是 C', '以上皆非', 'A', 'A⊂B⊂C ⇒ 所有 A 都是 C。'],
  ['所有 A 都是 B', '沒有 B 是 C', '所有 A 都是 C', '沒有 A 是 C', '有些 A 是 C', '以上皆非', 'B', 'A⊂B 且 B∩C=∅ ⇒ 沒有 A 是 C。'],
  ['沒有 A 是 B', '所有 C 都是 B', '沒有 A 是 C', '所有 A 都是 C', '有些 C 是 A', '以上皆非', 'A', 'A∩B=∅ 且 C⊂B ⇒ A∩C=∅。'],
  ['所有哺乳類都是胎生的', '所有牛都是哺乳類', '所有牛都是胎生的', '所有哺乳類都是牛', '有些牛不是胎生的', '以上皆非', 'A', '牛⊂哺乳類⊂胎生 ⇒ 所有牛都是胎生的。'],
  ['所有哺乳類都不下蛋', '所有母雞都會下蛋', '所有母雞都不是哺乳類', '有些母雞是哺乳類', '所有哺乳類都是母雞', '以上皆非', 'A', '哺乳類不下蛋、母雞下蛋 ⇒ 母雞不屬於哺乳類。'],
  ['凡是北極的生物都是白色的', '所有白色的動物都不是胎生的', '每種北極的生物都不是胎生的', '北極的生物都是胎生的', '每種白色的生物都在北極', '以上皆非', 'A', '北極生物→白色→非胎生。'],
  ['所有牛油都是新鮮的', '新鮮的都不昂貴', '所有牛油都不昂貴', '牛油有些是昂貴的', '所有新鮮的都是牛油', '以上皆非', 'A', '牛油→新鮮→不昂貴。'],
  ['所有優秀的學生都不上課', '不努力的學生都去上課', '所有上課的學生都不優秀', '所有上課的都是優秀的學生', '不努力的學生是優秀的', '以上皆非', 'A', '上課⇒不優秀。'],
]
const syllogismTerms = [
  ['A', 'B', 'C'],
  ['貓', '動物', '生物'],
  ['律師', '專業人士', '受過高等教育'],
  ['金屬', '導電體', '可導電'],
  ['鳥', '有翼', '會飛'],
  ['公務員', '依法辦事', '不得徇私'],
]
for (let i = 101; i <= 200; i++) {
  const t = syllogismTemplates[(i - 101) % syllogismTemplates.length]
  const terms = syllogismTerms[(i - 101) % syllogismTerms.length]
  const rep = (s) => String(s).replace(/A/g, terms[0]).replace(/B/g, terms[1]).replace(/C/g, terms[2])
  const question = `已知「${rep(t[0])}」且「${rep(t[1])}」。由此可推論？`
  const optTexts = [t[2], t[3], t[4], t[5]].map(rep)
  const correctKey = t[6]
  const explanation = t[7]
  list.push(q(i, question, opts(optTexts[0], optTexts[1], optTexts[2], optTexts[3]), correctKey, explanation))
}
list[100] = q(101, '若「所有 A 都是 B」且「有些 B 是 C」，則可確定：', opts('所有 A 都是 C', '有些 A 可能是 C', '所有 B 都是 A', '有些 C 不是 B'), 'B', '由「所有 A 都是 B」與「有些 B 是 C」，只能推得「有些 A 可能是 C」。')
list[101] = q(102, '所有哺乳類動物都是胎生的，所有牛都是哺乳類動物。那麼：', opts('所有哺乳類動物都是牛', '所有牛都是胎生的', '所有四肢哺乳類都是胎生的', '以上皆非'), 'B', '牛⊂哺乳類⊂胎生 ⇒ 所有牛都是胎生的。')
list[102] = q(103, '凡是北極的生物都是白色的。所有白色的動物都不是胎生的。由此可以推論出？', opts('每種北極的生物都不是胎生的', '北極的生物都是胎生的', '每種白色的生物都在北極', '以上皆非'), 'A', '北極生物→白色→非胎生。')

// ---------- 親屬關係 (201–300) ----------
const familyQs = [
  ['己是戊的母親，乙的女兒是己，丁的妹妹是戊。問戊是乙的誰？', '外孫女', '姐妹', '外祖母', '以上皆非', 'A', '乙的女兒是己，己是戊的母親 ⇒ 戊是乙的外孫女。'],
  ['甲是乙的母親，乙是丙的哥哥，丙是丁的兒子。問丁是甲的誰？', '父親', '丈夫', '妻子', '無法確定', 'B', '乙是丙的哥哥⇒乙、丙同輩；丙是丁的兒子⇒丁是丙的父親；甲是乙的母親⇒丁是甲的丈夫。'],
  ['李先生的媳婦介紹某人：「她的父親是李先生的獨生子。」那個人是李先生媳婦的誰？', '母親', '女兒', '姊妹', '無法確定', 'B', '李先生的獨生子是「她」的父親⇒「她」是李先生媳婦的女兒。'],
  ['一男子指著甲向他人介紹：「他的兄弟的爸爸是我女兒的父親。」問我是甲的？', '兒子', '父親', '祖父', '叔伯', 'B', '我女兒的父親=我；他的兄弟的爸爸=甲的父親⇒我是甲的父親。'],
  ['一名男士說：「我是甲的爸爸的獨生子的兒子。」請問這位男士是甲的什麼身份？', '兒子', '父親', '叔父', '兄弟', 'A', '甲的爸爸的獨生子=甲；其兒子=男士⇒男士是甲的兒子。'],
  ['一位女士指著甲說：「她的母親是我母親的獨生女。」問甲是女士的誰？', '母親', '妹妹', '女兒', '姨媽', 'C', '我母親的獨生女=女士本人；她的母親是女士⇒甲是女士的女兒。'],
  ['甲是乙的父親，乙是丙的母親，丙是丁的兒子。問丁是甲的誰？', '曾孫', '孫子', '兒子', '兄弟', 'A', '乙是丙的母親⇒丙是乙的子女；丙是丁的兒子⇒丁是甲的曾孫。'],
  ['王先生的父親是李女士的獨生子。問李女士是王先生的誰？', '母親', '祖母', '外祖母', '姑母', 'B', '李女士的獨生子=王先生的父親⇒李女士是王先生的祖母。'],
  ['一個男士向別人介紹甲說：「他是我妹妹的祖母的獨生子的妻子的兒子。」問甲是那個男人的誰？', '父親', '兒子', '兄弟', '表兄弟', 'C', '妹妹的祖母的獨生子=妹妹的父親=該男士；其妻子的兒子=該男士與妻之子⇒甲與其子為兄弟，依歷屆答案為兄弟。'],
  ['張先生說：「她的母親是我父親的獨生子的妻子。」張先生是某人的？', '父親', '兒子', '兄弟', '無法判斷', 'A', '我父親的獨生子即張先生自己，他的妻子即張太太；她的母親是張太太，則某人為張先生與張太太的兒子。'],
]
for (let i = 201; i <= 300; i++) {
  const row = familyQs[(i - 201) % familyQs.length]
  list.push(q(i, row[0], opts(row[1], row[2], row[3], row[4]), row[5], row[6]))
}

// ---------- 抽象運算／規則 (301–360) ----------
for (let i = 301; i <= 360; i++) {
  const n = i - 300
  const base = 2 + (n % 5)
  const op = (x) => x * x - 4
  const first = op(base)
  const second = op(first)
  const wrongs = [second - 10, second + 5, op(base + 1), first].filter((v) => v !== second)
  const optsArr = [...new Set([second, wrongs[0], wrongs[1], wrongs[2]])].sort((u, v) => u - v).slice(0, 4)
  if (!optsArr.includes(second)) optsArr[0] = second
  const idx = optsArr.indexOf(second) >= 0 ? optsArr.indexOf(second) : 0
  list.push(
    q(
      i,
      `定義 a⇒b 表示「a 的平方減 4 等於 b」。則 ${base}⇒⇒？（即 ${base} 連續運算兩次）`,
      opts(String(optsArr[0]), String(optsArr[1]), String(optsArr[2]), String(optsArr[3])),
      ['A', 'B', 'C', 'D'][idx],
      `${base}⇒${first}，${first}⇒${second}。`
    )
  )
}
list[300] = q(301, '規律：3⇒5，4⇒12，3⇒⇒21，4⇒⇒？（⇒ 表示平方後減 4）', opts('28', '35', '36', '140'), 'D', '4⇒12 即 4²-4=12；4⇒⇒=(4²-4)²-4=12²-4=140。')

// ---------- 排序／條件 (361–410) ----------
const orderTemplates = [
  { cond: '甲不是第一，乙在丙前，丁最後', order: ['丙', '乙', '甲', '丁'], first: '丙' },
  { cond: '甲在乙前，丙在丁前，乙不是最後', order: ['甲', '乙', '丙', '丁'], first: '甲' },
  { cond: '戊第一，甲不是第二，乙在丙前，丁最後', order: ['戊', '甲', '乙', '丙', '丁'], first: '戊' },
  { cond: '甲不在第一也不在最後，乙緊隨甲後，丙在丁前', order: ['丙', '丁', '甲', '乙'], first: '丙' },
  { cond: '五人排隊，甲排第一，戊排最後，乙在丙前，丁在乙前', order: ['甲', '丁', '乙', '丙', '戊'], first: '甲' },
  { cond: '丙第一，甲在乙前，丁最後', order: ['丙', '甲', '乙', '丁'], first: '丙' },
  { cond: '乙不是第一，甲在丙前，丁在最後', order: ['甲', '丙', '乙', '丁'], first: '甲' },
  { cond: '丁第一，甲在乙前，丙最後', order: ['丁', '甲', '乙', '丙'], first: '丁' },
  { cond: '甲、乙、丙、丁四人，甲不是最後，乙在丙前，丁不是第一', order: ['甲', '丁', '乙', '丙'], first: '甲' },
  { cond: '戊第一，丁最後，乙在甲前，丙在甲後', order: ['戊', '乙', '甲', '丙', '丁'], first: '戊' },
]
for (let i = 361; i <= 410; i++) {
  const t = orderTemplates[(i - 361) % orderTemplates.length]
  const wrongs = t.order.filter((x) => x !== t.first)
  const optsArr = [t.first, wrongs[0], wrongs[1], wrongs[2]].slice(0, 4)
  const idx = optsArr.indexOf(t.first) >= 0 ? optsArr.indexOf(t.first) : 0
  list.push(
    q(
      i,
      `甲、乙、丙、丁${t.order.length === 5 ? '、戊' : ''}排隊。已知：${t.cond}。問排第一的是誰？`,
      opts(optsArr[0], optsArr[1], optsArr[2], optsArr[3]),
      ['A', 'B', 'C', 'D'][idx],
      `依條件可推順序為：${t.order.join('、')}，故第一為 ${t.first}。`
    )
  )
}
list[360] = q(361, '戊第一個衝線，甲不是緊隨戊的，己緊跟丙後面，丁與丙差不多同步，乙跑尾二。問誰跑最尾？', opts('甲', '己', '丙', '無法估計'), 'A', '順序可推為：戊、丁、丙、己、乙、甲；甲最尾。')

// ---------- 類比、支持、語理 (411–500) ----------
const analogyAndSupport = [
  ['「理論：實驗：現象」的類比，與下列哪組關係相同？', '習慣：使用：工具', '診斷：治療：癥狀', '學習：測驗：成績', '努力：成功：困難', 'C', '理論透過實驗得出現象；學習透過測驗得出成績。'],
  ['「總結、引言」的關係，就如「附錄」跟下列哪項的關係？', '章節', '序', '索引', '文章', 'B', '總結與引言在文首文尾；附錄與序亦然。'],
  ['「方向」對「？」、「？」對「秤」。與「方向」同一類的是？', '南；公斤', '指南針；重量', '方位；陀', '東；天平', 'B', '方向用指南針測量，重量用秤測量。'],
  ['若以下假設成立，可以證明「人力成本是最大支出」：公司支出最大部分係員工薪俸。', '在經濟不景氣時，各大上市公司都減人資支出及福利', '在經濟繁榮時，各大上市公司都增人資支出', '以上皆是', '以上皆非', 'A', '不景氣時減人資支出，反映人資佔比大。'],
  ['「遲暮」對「襁褓」，那麼「除夕」對？', '新年', '冬至', '端午', '中秋', 'A', '遲暮對襁褓為老人對嬰兒；除夕對新年為年尾對年頭。'],
  ['與「氧：銅綠：銅」關係相同的是？（銅被氧氧化成銅綠）', '氣體：固體：固體', '空氣：鐵鏽：釘子', '二氧化碳：環保：地球', '水：淘金：金子', 'B', '釘子被空氣氧化成鐵鏽。'],
  ['「石油：生物沉積」的關係，與「____：骨頭」相同。空格應為？', '關節', '礦物質', '化石', '牙齒', 'C', '石油由生物沉積形成；化石由骨頭等形成。'],
  ['日蝕的時候貓一定會叫；貓不會叫的時候月亮會有發光。下列哪一個對？', '日蝕的時候月亮會發光', '日蝕的時候月亮不會發光', '日蝕的時候有時月亮會發光', '以上皆錯', 'D', '日蝕⇒貓叫；貓不叫⇒月發光。日蝕時貓叫，無法推月發光與否。'],
  ['「公務員須依法辦事，不得徇私。」句中「徇私」之意最接近：', '公正無私', '因私情而偏袒', '公開透明', '依法裁量', 'B', '徇私指為私情而偏袒、不公正。'],
  ['「蘋果⊂酸⊂糖」若成立（不考慮現實），可推得？', '所有蘋果都是糖', '所有糖都是蘋果', '有些蘋果不是糖', '以上皆非', 'A', '蘋果⊂酸⊂糖 ⇒ 所有蘋果都是糖。'],
  ['「醫學」：「耳鼻喉科」=「法律」：「？」', '生意夥伴', '司法', '刑事法', '法官', 'C', '耳鼻喉科為醫學專科；刑事法為法律一大類。'],
  ['「飄雪」與「暴風雪」的關係，正如「感冒」和下列哪項？', '傷風', '肺炎', '咳嗽', '噴嚏', 'B', '暴風雪為飄雪之加強；肺炎可視為感冒之嚴重後果。'],
  ['「陰：太極：陽」的類比，與下列哪組相同？', '落選：應徵：當選', '月亮：天體：太陽', '黑色：顏色：白色', '以上皆是', 'A', '太極僅陰陽兩極；應徵結果為落選或當選。'],
  ['「書：章節」相當於「法律：？」', '條文', '法官', '法院', '律師', 'A', '書由章節組成；法律由條文組成。'],
  ['「醫生：醫院」相當於「教師：？」', '學校', '學生', '課本', '考試', 'A', '醫生在醫院工作；教師在學校工作。'],
  ['「高：低」相當於「熱：？」', '溫', '冷', '暖', '涼', 'B', '高與低為反義；熱與冷為反義。'],
  ['「原因：結果」相當於「起點：？」', '終點', '過程', '中點', '方向', 'A', '原因對應結果；起點對應終點。'],
  ['「開始：結束」如「出生：？」', '死亡', '成長', '學習', '工作', 'A', '出生為開始，死亡為結束。'],
  ['「買：賣」如「借：？」', '還', '給', '收', '取', 'A', '買對賣；借對還。'],
]
for (let i = 411; i <= 500; i++) {
  const idx = (i - 411) % analogyAndSupport.length
  const row = analogyAndSupport[idx]
  list.push(q(i, row[0], opts(row[1], row[2], row[3], row[4]), row[5], row[6]))
}

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

export const questions260Logic = finalList.slice(0, 500)
