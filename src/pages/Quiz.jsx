import { useState, useMemo, useEffect } from 'react'
import { useParams, useSearchParams, useNavigate } from 'react-router-dom'
import { useQuestionsList } from '../hooks/useQuestions'
import { useWrongAnswers, useStats, useReviewSchedule } from '../hooks/useStorage'
import { verifyAnswer } from '../api/questions'
import { shuffle } from '../utils/shuffle'
import QuestionCard from '../components/QuestionCard'
import LoadingBlock from '../components/LoadingBlock'
import LoadError from '../components/LoadError'

export default function Quiz() {
  const { examType } = useParams()
  const [searchParams] = useSearchParams()
  const category = searchParams.get('category') || 'all'
  const navigate = useNavigate()

  const { addWrong } = useWrongAnswers()
  const { recordAnswer } = useStats()
  const { addToReview } = useReviewSchedule()

  const { questions: loaded, loading, error } = useQuestionsList(examType, category)
  const [sessionQuestions, setSessionQuestions] = useState([])
  const [revealed, setRevealed] = useState({})
  const [verifyError, setVerifyError] = useState(null)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    if (loaded.length) setSessionQuestions(shuffle(loaded))
    else setSessionQuestions([])
  }, [loaded])

  const questions = useMemo(
    () => sessionQuestions.map((q) => ({ ...q, ...revealed[q.id] })),
    [sessionQuestions, revealed]
  )

  const [currentIndex, setCurrentIndex] = useState(0)
  const [selectedKey, setSelectedKey] = useState(null)
  const [showResult, setShowResult] = useState(false)
  const [answers, setAnswers] = useState([])

  const current = questions[currentIndex]
  const isLast = currentIndex === questions.length - 1

  const handleSubmit = async () => {
    if (selectedKey == null || !current || submitting) return
    setSubmitting(true)
    setVerifyError(null)
    try {
      const result = await verifyAnswer(current.id, selectedKey)
      setRevealed((prev) => ({
        ...prev,
        [current.id]: {
          correctKey: result.correctKey,
          explanation: result.explanation,
        },
      }))
      const correct = result.correct
      if (!correct) {
        addWrong(current.id)
        addToReview(current.id)
      }
      recordAnswer(examType, correct)
      setAnswers((prev) => [...prev, { questionId: current.id, correct, selectedKey }])
      setShowResult(true)
    } catch (err) {
      setVerifyError(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  const handleNext = () => {
    if (isLast) {
      navigate('/result', {
        state: {
          total: questions.length,
          correct: answers.filter((a) => a.correct).length,
          examType,
          category,
        },
      })
      return
    }
    setCurrentIndex((i) => i + 1)
    setSelectedKey(null)
    setShowResult(false)
  }

  if (loading) return <LoadingBlock />
  if (error) return <LoadError message={error.message} />

  if (questions.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-stone-600 dark:text-stone-400">暫無題目。</p>
        <button
          type="button"
          onClick={() => navigate(`/practice/${examType}`)}
          className="mt-4 text-primary-600 dark:text-primary-400 underline"
        >
          返回練習選擇
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-2 text-sm text-stone-500 dark:text-stone-400">
        <span>第 {currentIndex + 1} / {questions.length} 題</span>
        <button
          type="button"
          onClick={() => navigate(`/practice/${examType}?category=${category}`)}
          className="rounded-lg px-4 py-2.5 min-h-[44px] hover:bg-stone-100 dark:hover:bg-stone-800 focus:outline-none focus:ring-2 focus:ring-primary-500"
        >
          結束練習
        </button>
      </div>

      {verifyError && (
        <p className="text-sm text-red-600 dark:text-red-400">{verifyError}</p>
      )}

      <QuestionCard
        question={current}
        selectedKey={selectedKey}
        onSelect={setSelectedKey}
        showResult={showResult}
        disabled={showResult || submitting}
      />

      {!showResult ? (
        <button
          type="button"
          onClick={handleSubmit}
          disabled={selectedKey == null || submitting}
          className="w-full rounded-xl bg-primary-600 py-3.5 sm:py-3 text-base font-medium text-white shadow-sm hover:bg-primary-700 disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 dark:bg-primary-500 dark:hover:bg-primary-600 min-h-[48px] sm:min-h-[44px]"
        >
          {submitting ? '驗證中…' : '提交答案'}
        </button>
      ) : (
        <button
          type="button"
          onClick={handleNext}
          className="w-full rounded-xl bg-primary-600 py-3.5 sm:py-3 text-base font-medium text-white shadow-sm hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 dark:bg-primary-500 dark:hover:bg-primary-600 min-h-[48px] sm:min-h-[44px]"
        >
          {isLast ? '查看結果' : '下一題'}
        </button>
      )}
    </div>
  )
}
