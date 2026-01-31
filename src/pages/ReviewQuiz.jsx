import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { useReviewSchedule } from '../hooks/useStorage'
import { questions430, questions260, questions430Past, questions260Official, questions260Past, questionsLawShared, questions430Math, questions430Chart, questions430Logic, questions430Reading, questions260Math, questions260Chart, questions260Logic, questions260Reading } from '../data'
import QuestionCard from '../components/QuestionCard'

const allQuestions = [...questions430, ...questions430Past, ...questionsLawShared, ...questions430Math, ...questions430Chart, ...questions430Logic, ...questions430Reading, ...questions260, ...questions260Official, ...questions260Past, ...questions260Math, ...questions260Chart, ...questions260Logic, ...questions260Reading]
const questionMap = Object.fromEntries(allQuestions.map((q) => [q.id, q]))

function shuffle(arr) {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

export default function ReviewQuiz() {
  const navigate = useNavigate()
  const { dueIds, recordReviewResult } = useReviewSchedule()

  const questions = useMemo(() => {
    const list = dueIds.map((id) => questionMap[id]).filter(Boolean)
    return shuffle(list)
  }, [dueIds])

  const [currentIndex, setCurrentIndex] = useState(0)
  const [selectedKey, setSelectedKey] = useState(null)
  const [showResult, setShowResult] = useState(false)

  const current = questions[currentIndex]
  const isLast = currentIndex === questions.length - 1

  const handleSubmit = () => {
    if (selectedKey == null || !current) return
    const correct = selectedKey === current.correctKey
    recordReviewResult(current.id, correct)
    setShowResult(true)
  }

  const handleNext = () => {
    if (isLast) {
      navigate('/review')
      return
    }
    // 當前題目已從 due 移除，下一題即剩餘列表的第一題
    setCurrentIndex(0)
    setSelectedKey(null)
    setShowResult(false)
  }

  const handleEnd = () => {
    navigate('/review')
  }

  if (questions.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-stone-600 dark:text-stone-400">目前沒有待複習題目。</p>
        <button
          type="button"
          onClick={() => navigate('/review')}
          className="mt-4 text-primary-600 dark:text-primary-400 underline"
        >
          返回遺忘曲線複習
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between text-sm text-stone-500 dark:text-stone-400">
        <span>
          複習 第 {currentIndex + 1} / {questions.length} 題
        </span>
        <button
          type="button"
          onClick={handleEnd}
          className="rounded-lg px-3 py-1 hover:bg-stone-100 dark:hover:bg-stone-800 focus:outline-none focus:ring-2 focus:ring-primary-500"
        >
          結束複習
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
          className="w-full rounded-xl bg-primary-600 py-3 text-base font-medium text-white shadow-sm hover:bg-primary-700 disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 dark:bg-primary-500 dark:hover:bg-primary-600 min-h-[44px]"
        >
          提交答案
        </button>
      ) : (
        <button
          type="button"
          onClick={handleNext}
          className="w-full rounded-xl bg-primary-600 py-3 text-base font-medium text-white shadow-sm hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 dark:bg-primary-500 dark:hover:bg-primary-600 min-h-[44px]"
        >
          {isLast ? '完成複習' : '下一題'}
        </button>
      )}
    </div>
  )
}
