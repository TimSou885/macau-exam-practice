import { useState, useMemo } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useWrongAnswers } from '../hooks/useStorage'
import { useQuestionsByIds } from '../hooks/useQuestions'
import { verifyAnswer } from '../api/questions'
import { shuffle } from '../utils/shuffle'
import QuestionCard from '../components/QuestionCard'
import LoadingBlock from '../components/LoadingBlock'
import LoadError from '../components/LoadError'

export default function WrongQuiz() {
  const navigate = useNavigate()
  const { wrongIds } = useWrongAnswers()

  const { questions: loaded, loading, error } = useQuestionsByIds(wrongIds)
  const [revealed, setRevealed] = useState({})
  const [submitting, setSubmitting] = useState(false)
  const [verifyError, setVerifyError] = useState(null)

  const questions = useMemo(() => shuffle(loaded), [loaded])

  const [currentIndex, setCurrentIndex] = useState(0)
  const [selectedKey, setSelectedKey] = useState(null)
  const [showResult, setShowResult] = useState(false)
  const [answers, setAnswers] = useState([])
  const [finished, setFinished] = useState(false)

  const baseCurrent = questions[currentIndex]
  const current = baseCurrent ? { ...baseCurrent, ...revealed[baseCurrent.id] } : null
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
      setFinished(true)
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
        <p className="text-stone-600 dark:text-stone-400">目前沒有錯題可複習。</p>
        <button
          type="button"
          onClick={() => navigate('/wrong')}
          className="mt-4 text-primary-600 dark:text-primary-400 underline"
        >
          返回錯題本
        </button>
      </div>
    )
  }

  if (finished) {
    const totalCorrect = answers.filter((a) => a.correct).length
    return (
      <div className="space-y-8">
        <h1 className="text-2xl font-bold text-stone-900 dark:text-stone-100 text-center">
          複習結果
        </h1>
        <div className="mx-auto max-w-sm rounded-2xl border-2 border-stone-200 bg-white p-8 text-center dark:border-stone-700 dark:bg-stone-800/50">
          <p className="text-stone-600 dark:text-stone-400">
            答對 <strong className="text-stone-900 dark:text-stone-100">{totalCorrect}</strong> / {questions.length} 題
          </p>
          <Link
            to="/wrong"
            className="mt-6 inline-flex items-center justify-center rounded-xl bg-primary-600 px-6 py-3.5 sm:py-3 text-base font-medium text-white shadow-sm hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 dark:bg-primary-500 dark:hover:bg-primary-600 min-h-[48px] sm:min-h-[44px]"
          >
            返回錯題本
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-2 text-sm text-stone-500 dark:text-stone-400">
        <span>答題複習 第 {currentIndex + 1} / {questions.length} 題</span>
        <button
          type="button"
          onClick={() => navigate('/wrong')}
          className="rounded-lg px-4 py-2.5 min-h-[44px] hover:bg-stone-100 dark:hover:bg-stone-800 focus:outline-none focus:ring-2 focus:ring-primary-500"
        >
          結束複習
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
