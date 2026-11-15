const DIGITS = '甲乙丙丁戊己庚辛壬癸'
const QUARTERS = ['第一季', '第二季', '第三季', '第四季', '第五季', '第六季', '第七季', '第八季']

/**
 * Pull a small table out of chart questions that describe a table in prose.
 * Returns null when the stem is not tabular (for example an Excel menu question).
 *
 * @param {string} question
 * @returns {{ columns: [string, string], rows: { id: string, label: string, value: string }[] } | null}
 */
export function extractChartRows(question) {
  if (!question) return null

  const arrows = [...question.matchAll(/(\d+(?:\.\d+)?)\s*(?:→|->)\s*(\d+(?:\.\d+)?)/g)]
  if (arrows.length >= 2) {
    return table(
      '條件',
      '數值',
      arrows.map((match) => [match[1], match[2]]),
    )
  }

  const years = [...question.matchAll(/(20\d{2})\s*年[^0-9]{0,16}?(\d+(?:\.\d+)?)/g)]
  if (years.length >= 2) {
    return table(
      '年份',
      '數值',
      years.map((match) => [match[1], match[2]]),
    )
  }

  const labelMatch = question.match(
    new RegExp(`([${DIGITS}](?:、[${DIGITS}]){1,9})`),
  )
  const numberLists = [...question.matchAll(/(\d+(?:\.\d+)?(?:、\d+(?:\.\d+)?){1,11})/g)]
  if (labelMatch && numberLists.length > 0) {
    const labels = labelMatch[1].split('、')
    const nums = numberLists[numberLists.length - 1][1].split('、')
    if (labels.length === nums.length) {
      return table(
        '項目',
        '數值',
        labels.map((label, index) => [label, nums[index]]),
      )
    }
  }

  const quarter = question.match(
    /第[一二三四1-4]至第[一二三四1-4]季度[^：:]{0,24}[：:](\d+(?:\.\d+)?(?:、\d+(?:\.\d+)?){1,7})/,
  )
  if (quarter) {
    const nums = quarter[1].split('、')
    return table(
      '季度',
      '數值',
      nums.map((value, index) => [QUARTERS[index] || `項目 ${index + 1}`, value]),
    )
  }

  if (/下表|圖表/.test(question)) {
    const list = question.match(/[：:為]\s*(\d+(?:\.\d+)?(?:、\d+(?:\.\d+)?){2,11})/)
    if (list) {
      const nums = list[1].split('、')
      return table(
        '項目',
        '數值',
        nums.map((value, index) => [`項目 ${index + 1}`, value]),
      )
    }
  }

  return null
}

function table(labelHeader, valueHeader, pairs) {
  return {
    columns: [labelHeader, valueHeader],
    rows: pairs.map(([label, value], index) => ({
      id: String(index),
      label,
      value,
    })),
  }
}
