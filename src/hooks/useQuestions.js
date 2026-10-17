import { useEffect, useState } from 'react'
import { fetchQuestionCount, fetchQuestions, fetchQuestionsByIds } from '../api/questions'

export function useExamCounts() {
  const [counts, setCounts] = useState({ '430': null, '260': null })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    Promise.all([fetchQuestionCount('430', 'all'), fetchQuestionCount('260', 'all')])
      .then(([c430, c260]) => {
        if (!cancelled) setCounts({ '430': c430, '260': c260 })
      })
      .catch((err) => {
        if (!cancelled) setError(err)
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [])

  return { counts, loading, error }
}

export function useQuestionCount(examType, category = 'all') {
  const [count, setCount] = useState(null)
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!examType) {
      setCount(null)
      setLoading(false)
      setError(null)
      return undefined
    }
    let cancelled = false
    setLoading(true)
    setError(null)
    fetchQuestionCount(examType, category)
      .then((n) => {
        if (!cancelled) setCount(n)
      })
      .catch((err) => {
        if (!cancelled) setError(err)
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [examType, category])

  return { count, loading, error }
}

export function useQuestionsList(examType, category = 'all', { reveal = false } = {}) {
  const [questions, setQuestions] = useState([])
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    setError(null)
    fetchQuestions(examType, category, { reveal })
      .then((list) => {
        if (!cancelled) setQuestions(list)
      })
      .catch((err) => {
        if (!cancelled) setError(err)
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [examType, category, reveal])

  return { questions, loading, error, setQuestions }
}

export function useQuestionsByIds(ids, { reveal = false, examType = '430' } = {}) {
  const idsKey = ids.join(',')
  const [questions, setQuestions] = useState([])
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    setError(null)
    fetchQuestionsByIds(ids, { reveal, examType })
      .then((list) => {
        if (!cancelled) setQuestions(list)
      })
      .catch((err) => {
        if (!cancelled) setError(err)
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [idsKey, reveal, examType])

  return { questions, loading, error, setQuestions }
}
