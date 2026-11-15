import { describe, expect, it } from 'vitest'
import { nextQuestionIndex } from './nextQuestion'

describe('nextQuestionIndex', () => {
  it('advances and stops on the last question', () => {
    expect(nextQuestionIndex(0, 3)).toBe(1)
    expect(nextQuestionIndex(1, 3)).toBe(2)
    expect(nextQuestionIndex(2, 3)).toBe(2)
  })

  it('stays on the only question', () => {
    expect(nextQuestionIndex(0, 1)).toBe(0)
  })
})
