import { useState, useMemo, useEffect } from 'react'
import { useParams, useSearchParams, useNavigate } from 'react-router-dom'
import { useQuestionsList } from '../hooks/useQuestions'
import { useWrongAnswers, useReviewSchedule } from '../hooks/useStorage'
import { verifyAnswer } from '../api/questions'
import { shuffle } from '../utils/shuffle'
import QuestionCard from '../components/QuestionCard'
import LoadingBlock from '../components/LoadingBlock'
import LoadError from '../components/LoadError'

const FAIL_THRESHOLD = 5

export default function ChallengeQuiz() {
  const { examType } = useParams()
  const [searchParams] = useSearchParams()
  const countParam = Math.max(1, parseInt(searchParams.get('count'), 10) || 50)
  const navigate = useNavigate()

  const { addWrong } = useWrongAnswers()
  const { addToReview } = useReviewSchedule()

  const { questions: loaded, loading, error } = useQuestionsList(examType, 'all')
  const [sessionQuestions, setSessionQuestions] = useState([])
  const [revealed, setRevealed] = useState({})
  const [verifyError, setVerifyError] = useState(null)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    if (!loaded.length) {
      setSessionQuestions([])
      return
    }
    setSessionQuestions(shuffle(loaded).slice(0, Math.min(countParam, loaded.length)))
  }, [loaded, countParam])

  const questions = useMemo(
    () => sessionQuestions.map((q) => ({ ...q, ...revealed[q.id] })),
    [sessionQuestions, revealed]
  )

  const [currentIndex, setCurrentIndex] = useState(0)
  const [selectedKey, setSelectedKey] = useState(null)
  const [showResult, setShowResult] = useState(false)
  const [wrongCount, setWrongCount] = useState(0)
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
        const nextWrong = wrongCount + 1
        setWrongCount(nextWrong)
        setAnswers((prev) => [...prev, { questionId: current.id, correct, selectedKey }])
        setShowResult(true)
        if (nextWrong >= FAIL_THRESHOLD) {
          navigate('/challenge/result', {
            state: {
              success: false,
              total: questions.length,
              wrongCount: nextWrong,
              answeredCount: currentIndex + 1,
              examType,
            },
          })
          return
        }
      } else {
        setAnswers((prev) => [...prev, { questionId: current.id, correct, selectedKey }])
        setShowResult(true)
      }
    } catch (err) {
      setVerifyError(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  const handleNext = () => {
    if (isLast) {
      const totalCorrect = answers.filter((a) => a.correct).length
      navigate('/challenge/result', {
        state: {
          success: totalCorrect === questions.length,
          total: questions.length,
          wrongCount,
          answeredCount: questions.length,
          examType,
        },
      })
      return
    }
    setCurrentIndex((i) => i + 1)
    setSelectedKey(null)
    setShowResult(false)
  }

  const handleEndChallenge = () => {
    navigate('/challenge/result', {
      state: {
        success: false,
        total: questions.length,
        wrongCount,
        answeredCount: currentIndex + (showResult ? 1 : 0),
        examType,
        quitEarly: true,
      },
    })
  }

  if (examType !== '430' && examType !== '260') {
    return (
      <div className="text-center py-12">
        <p className="text-stone-600 dark:text-stone-400">無效的考試類型。</p>
        <button
          type="button"
          onClick={() => navigate('/challenge')}
          className="mt-4 text-primary-600 dark:text-primary-400 underline"
        >
          返回挑戰選擇
        </button>
      </div>
    )
  }

  if (loading) return <LoadingBlock />
  if (error) return <LoadError message={error.message} />

  if (questions.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-stone-600 dark:text-stone-400">暫無題目。</p>
        <button
          type="button"
          onClick={() => navigate('/challenge')}
          className="mt-4 text-primary-600 dark:text-primary-400 underline"
        >
          返回挑戰選擇
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-2 text-sm text-stone-500 dark:text-stone-400">
        <span>
          第 {currentIndex + 1} / {questions.length} 題
          <span className="ml-2 sm:ml-3 text-amber-800 dark:text-amber-400">
            已錯 {wrongCount} / {FAIL_THRESHOLD}
          </span>
        </span>
        <button
          type="button"
          onClick={handleEndChallenge}
          className="rounded-lg px-4 py-2.5 min-h-[44px] hover:bg-stone-100 dark:hover:bg-stone-800 focus:outline-none focus:ring-2 focus:ring-primary-500"
        >
          結束挑戰
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
