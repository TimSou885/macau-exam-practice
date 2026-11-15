import { describe, expect, it } from 'vitest'
import { practiceScoreSummary } from './scoreCopy'

describe('practiceScoreSummary', () => {
  it('does not call a short drill an official pass', () => {
    const summary = practiceScoreSummary({ correct: 8, total: 10 })
    expect(summary.score).toBe(80)
    expect(summary.headline).toBe('這一輪正確率 80%')
    expect(summary.detail).toContain('不要把這個百分比當成開考成績')
  })

  it('uses the 50% reference only when the round is near the official paper length', () => {
    const summary = practiceScoreSummary({ correct: 30, total: 58 })
    expect(summary.headline).toBe('這一輪正確率達到 50% 合格參考')
  })

  it('says the reference was missed for a near-official round under 50%', () => {
    const summary = practiceScoreSummary({ correct: 20, total: 58 })
    expect(summary.headline).toBe('這一輪正確率未到 50% 合格參考')
  })
})
