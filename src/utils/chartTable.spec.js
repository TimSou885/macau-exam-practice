import { describe, expect, it } from 'vitest'
import { extractChartRows } from './chartTable'

describe('extractChartRows', () => {
  it('builds a quarter table from a prose stem', () => {
    const table = extractChartRows(
      '下表為某部門第一至第四季度支出（萬元）：12、18、15、20。問全年總支出多少萬元？',
    )
    expect(table.columns).toEqual(['季度', '數值'])
    expect(table.rows.map((row) => row.value)).toEqual(['12', '18', '15', '20'])
  })

  it('pairs named groups with the same number of values', () => {
    const table = extractChartRows('圖表顯示甲、乙、丙、丁四區人數為 80、120、90、110。問四區總人數？')
    expect(table.rows.map((row) => row.label)).toEqual(['甲', '乙', '丙', '丁'])
    expect(table.rows.map((row) => row.value)).toEqual(['80', '120', '90', '110'])
  })

  it('reads arrow pairs', () => {
    const table = extractChartRows('下表為車速（km/h）與耗油（L/100km）：60→7、70→8、80→9、90→10。')
    expect(table.rows).toEqual([
      { id: '0', label: '60', value: '7' },
      { id: '1', label: '70', value: '8' },
      { id: '2', label: '80', value: '9' },
      { id: '3', label: '90', value: '10' },
    ])
  })

  it('leaves non-tabular stems alone', () => {
    expect(extractChartRows('Excel 中絕對參照的寫法是？')).toBeNull()
  })
})
