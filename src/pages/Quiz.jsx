import { useState, useMemo } from 'react'
import { useParams, useSearchParams, useNavigate } from 'react-router-dom'
import { getQuestionsByExamAndCategory } from '../data'
import { useWrongAnswers, useStats, useReviewSchedule } from '../hooks/useStorage'
import QuestionCard from '../components/QuestionCard'

function shuffle(arr) {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

export default function Quiz() {
  const { examType } = useParams()
  const [searchParams] = useSearchParams()
  const category = searchParams.get('category') || 'all'
  const navigate = useNavigate()

  const { addWrong } = useWrongAnswers()
  const { recordAnswer } = useStats()
  const { addToReview } = useReviewSchedule()

  const questions = useMemo(() => {
    const list = getQuestionsByExamAndCategory(
      examType,
      category === 'all' ? null : category
    )
    return shuffle(list)
  }, [examType, category])

  const [currentIndex, setCurrentIndex] = useState(0)
  const [selectedKey, setSelectedKey] = useState(null)
  const [showResult, setShowResult] = useState(false)
  const [answers, setAnswers] = useState([])

  const current = questions[currentIndex]
  const isLast = currentIndex === questions.length - 1

  const handleSubmit = () => {
    if (selectedKey == null || !current) return
    const correct = selectedKey === current.correctKey
    if (!correct) {
      addWrong(current.id)
      addToReview(current.id)
    }
    recordAnswer(examType, correct)
    setAnswers((prev) => [...prev, { questionId: current.id, correct, selectedKey }])
    setShowResult(true)
  }

  const handleNext = () => {
    if (isLast) {
      const prevCorrect = answers.filter((a) => a.correct).length
      const currentCorrect = selectedKey === current?.correctKey ? 1 : 0
      navigate('/result', {
        state: {
          total: questions.length,
          correct: prevCorrect + currentCorrect,
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

      <QuestionCard
        question={current}
        selectedKey={selectedKey}
        onSelect={setSelectedKey}
        showResult={showResult}
        disabled={showResult}
      />

      {!showResult ? (
        <button
          type="button"
          onClick={handleSubmit}
          disabled={selectedKey == null}
          className="w-full rounded-xl bg-primary-600 py-3.5 sm:py-3 text-base font-medium text-white shadow-sm hover:bg-primary-700 disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 dark:bg-primary-500 dark:hover:bg-primary-600 min-h-[48px] sm:min-h-[44px]"
        >
          提交答案
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
