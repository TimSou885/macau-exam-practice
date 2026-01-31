import { useState, useCallback, useEffect, useMemo } from 'react'
import { STORAGE_KEYS, REVIEW_INTERVAL_DAYS } from '../data'

function loadJson(key, defaultValue) {
  try {
    const raw = localStorage.getItem(key)
    return raw ? JSON.parse(raw) : defaultValue
  } catch {
    return defaultValue
  }
}

function saveJson(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch (e) {
    console.warn('localStorage save failed', e)
  }
}

/** 取得「今日結束」的時間戳（用於判斷是否到期：nextReviewAt <= endOfToday） */
function getEndOfToday() {
  const d = new Date()
  d.setHours(23, 59, 59, 999)
  return d.getTime()
}

export function useWrongAnswers() {
  const [wrongIds, setWrongIds] = useState(() =>
    loadJson(STORAGE_KEYS.wrongAnswers, [])
  )

  useEffect(() => {
    saveJson(STORAGE_KEYS.wrongAnswers, wrongIds)
  }, [wrongIds])

  const addWrong = useCallback((questionId) => {
    setWrongIds((prev) =>
      prev.includes(questionId) ? prev : [...prev, questionId]
    )
  }, [])

  const removeWrong = useCallback((questionId) => {
    setWrongIds((prev) => prev.filter((id) => id !== questionId))
  }, [])

  const clearWrong = useCallback(() => {
    setWrongIds([])
  }, [])

  const hasWrong = useCallback(
    (questionId) => wrongIds.includes(questionId),
    [wrongIds]
  )

  return { wrongIds, addWrong, removeWrong, clearWrong, hasWrong }
}

export function useStats() {
  const [stats, setStats] = useState(() =>
    loadJson(STORAGE_KEYS.stats, { totalAnswered: 0, totalCorrect: 0, byExam: {} })
  )

  useEffect(() => {
    saveJson(STORAGE_KEYS.stats, stats)
  }, [stats])

  const recordAnswer = useCallback((examType, correct) => {
    setStats((prev) => ({
      totalAnswered: prev.totalAnswered + 1,
      totalCorrect: prev.totalCorrect + (correct ? 1 : 0),
      byExam: {
        ...prev.byExam,
        [examType]: {
          answered: (prev.byExam[examType]?.answered ?? 0) + 1,
          correct: (prev.byExam[examType]?.correct ?? 0) + (correct ? 1 : 0),
        },
      },
    }))
  }, [])

  return { stats, recordAnswer }
}

/**
 * 艾賓浩斯遺忘曲線複習排程
 * 答錯時加入排程（下次複習：1 天後）；複習答對則延後間隔（1→3→7→15→30 天），答錯則重置為 1 天。
 */
export function useReviewSchedule() {
  const [schedule, setSchedule] = useState(() =>
    loadJson(STORAGE_KEYS.reviewSchedule, {})
  )

  useEffect(() => {
    saveJson(STORAGE_KEYS.reviewSchedule, schedule)
  }, [schedule])

  const dueIds = useMemo(() => {
    const endOfToday = getEndOfToday()
    return Object.entries(schedule)
      .filter(([, v]) => v && v.nextReviewAt <= endOfToday)
      .map(([id]) => id)
  }, [schedule])

  const addToReview = useCallback((questionId) => {
    const now = Date.now()
    const next = new Date(now)
    next.setDate(next.getDate() + REVIEW_INTERVAL_DAYS[0])
    setSchedule((prev) => ({
      ...prev,
      [questionId]: {
        addedAt: now,
        lastReviewedAt: now,
        nextReviewAt: next.getTime(),
        stage: 0,
      },
    }))
  }, [])

  const recordReviewResult = useCallback((questionId, correct) => {
    const now = Date.now()
    setSchedule((prev) => {
      const cur = prev[questionId]
      if (!cur) return prev
      if (correct) {
        const nextStage = Math.min((cur.stage ?? 0) + 1, REVIEW_INTERVAL_DAYS.length - 1)
        const next = new Date(now)
        next.setDate(next.getDate() + REVIEW_INTERVAL_DAYS[nextStage])
        return {
          ...prev,
          [questionId]: {
            ...cur,
            lastReviewedAt: now,
            nextReviewAt: next.getTime(),
            stage: nextStage,
          },
        }
      }
      const next = new Date(now)
      next.setDate(next.getDate() + REVIEW_INTERVAL_DAYS[0])
      return {
        ...prev,
        [questionId]: {
          ...cur,
          lastReviewedAt: now,
          nextReviewAt: next.getTime(),
          stage: 0,
        },
      }
    })
  }, [])

  const removeFromReview = useCallback((questionId) => {
    setSchedule((prev) => {
      const next = { ...prev }
      delete next[questionId]
      return next
    })
  }, [])

  const clearReview = useCallback(() => {
    setSchedule({})
  }, [])

  const getScheduleEntry = useCallback(
    (questionId) => schedule[questionId] ?? null,
    [schedule]
  )

  return {
    schedule,
    dueIds,
    addToReview,
    recordReviewResult,
    removeFromReview,
    clearReview,
    getScheduleEntry,
  }
}
