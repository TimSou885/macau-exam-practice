import { describe, expect, it } from 'vitest'
import {
  SESSION_QUESTION_MAX,
  clampSessionLimit,
  resolveSessionCount,
} from './questionLimit'

describe('clampSessionLimit', () => {
  it('returns null when a sample was not requested', () => {
    expect(clampSessionLimit(null)).toBeNull()
    expect(clampSessionLimit('')).toBeNull()
    expect(clampSessionLimit('  ')).toBeNull()
  })

  it('rejects non-positive and non-integer values', () => {
    expect(clampSessionLimit('0')).toBeNull()
    expect(clampSessionLimit('-3')).toBeNull()
    expect(clampSessionLimit('2.5')).toBeNull()
    expect(clampSessionLimit('abc')).toBeNull()
  })

  it('caps a round at 100 questions', () => {
    expect(clampSessionLimit('20')).toBe(20)
    expect(clampSessionLimit('5000')).toBe(SESSION_QUESTION_MAX)
  })
})

describe('resolveSessionCount', () => {
  it('stays inside the round bounds and the bank size', () => {
    expect(resolveSessionCount(1, 80)).toBe(5)
    expect(resolveSessionCount(20, 12)).toBe(12)
    expect(resolveSessionCount(80, 200)).toBe(80)
  })
})
