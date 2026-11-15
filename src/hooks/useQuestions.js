import { useEffect, useState } from 'react'
import {
  fetchQuestionCount,
  fetchQuestions,
  fetchQuestionsByIds,
  fetchQuestionsByIdsWithAnswers,
} from '../api/questions'

function useReload() {
  const [reloadToken, setReloadToken] = useState(0)
  const reload = () => setReloadToken((n) => n + 1)
  return { reloadToken, reload }
}

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
  const { reloadToken, reload } = useReload()

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
  }, [examType, category, reloadToken])

  return { count, loading, error, reload }
}

export function useCategoryCounts(examType, categoryIds) {
  const key = categoryIds.join(',')
  const [counts, setCounts] = useState(null)
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(true)
  const { reloadToken, reload } = useReload()

  useEffect(() => {
    if (!examType || categoryIds.length === 0) {
      setCounts(null)
      setLoading(false)
      return undefined
    }
    let cancelled = false
    setLoading(true)
    setError(null)
    Promise.all(categoryIds.map((category) => fetchQuestionCount(examType, category)))
      .then((values) => {
        if (cancelled) return
        const next = {}
        categoryIds.forEach((category, index) => {
          next[category] = values[index]
        })
        setCounts(next)
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
  }, [examType, key, reloadToken])

  return { counts, loading, error, reload }
}

export function useQuestionsList(examType, category = 'all', { limit, enabled = true } = {}) {
  const [questions, setQuestions] = useState([])
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(enabled)
  const { reloadToken, reload } = useReload()

  useEffect(() => {
    if (!enabled || !examType) {
      setLoading(false)
      setError(null)
      return undefined
    }
    let cancelled = false
    setLoading(true)
    setError(null)
    fetchQuestions(examType, category, { limit })
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
  }, [examType, category, limit, enabled, reloadToken])

  return { questions, loading, error, setQuestions, reload }
}

export function useQuestionsByIds(ids, { examType = '430' } = {}) {
  const idsKey = ids.join(',')
  const [questions, setQuestions] = useState([])
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(true)
  const { reloadToken, reload } = useReload()

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    setError(null)
    fetchQuestionsByIds(ids, { examType })
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
  }, [idsKey, examType, reloadToken])

  return { questions, loading, error, setQuestions, reload }
}

export function useQuestionsByIdsWithAnswers(ids, { examType = '430' } = {}) {
  const idsKey = ids.join(',')
  const [questions, setQuestions] = useState([])
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(true)
  const { reloadToken, reload } = useReload()

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    setError(null)
    if (!ids.length) {
      setQuestions([])
      setLoading(false)
      return () => {
        cancelled = true
      }
    }
    fetchQuestionsByIdsWithAnswers(ids, { examType })
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
  }, [idsKey, examType, reloadToken])

  return { questions, loading, error, setQuestions, reload }
}
