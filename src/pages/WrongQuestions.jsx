import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { useWrongAnswers, useReviewSchedule } from '../hooks/useStorage'
import { questions430, questions260, questions430Past, questions260Official, questions260Past, questionsLawShared, questions430Math, questions430Chart, questions430Logic, questions430Reading, questions260Math, questions260Chart, questions260Logic, questions260Reading } from '../data'
import QuestionCard from '../components/QuestionCard'

// 法律題庫共用，430 與 260 錯題本共用同一組題目 id
const allQuestions = [...questions430, ...questions430Past, ...questionsLawShared, ...questions430Math, ...questions430Chart, ...questions430Logic, ...questions430Reading, ...questions260, ...questions260Official, ...questions260Past, ...questions260Math, ...questions260Chart, ...questions260Logic, ...questions260Reading]
const questionMap = Object.fromEntries(allQuestions.map((q) => [q.id, q]))

export default function WrongQuestions() {
  const { wrongIds, removeWrong, clearWrong } = useWrongAnswers()
  const { removeFromReview, clearReview } = useReviewSchedule()

  const wrongList = useMemo(
    () => wrongIds.map((id) => questionMap[id]).filter(Boolean),
    [wrongIds]
  )

  if (wrongIds.length === 0) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-stone-900 dark:text-stone-100">
          錯題本
        </h1>
        <div className="rounded-xl border border-stone-200 bg-stone-50/50 p-8 text-center dark:border-stone-700 dark:bg-stone-800/30">
          <p className="text-stone-600 dark:text-stone-400">
            目前沒有錯題紀錄。完成練習後答錯的題目會自動加入這裡。
          </p>
          <Link
            to="/exam"
            className="mt-4 inline-block text-primary-600 dark:text-primary-400 font-medium"
          >
            去練習 →
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold text-stone-900 dark:text-stone-100">
          錯題本
        </h1>
        <div className="flex flex-wrap gap-2">
          <Link
            to="/wrong/quiz"
            className="rounded-lg bg-primary-600 px-4 py-2 text-sm font-medium text-white hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-primary-500 dark:hover:bg-primary-600"
          >
            答題複習（{wrongList.length} 題）
          </Link>
          <button
            type="button"
            onClick={() => {
              clearWrong()
              clearReview()
            }}
            className="rounded-lg border border-stone-300 px-4 py-2 text-sm font-medium text-stone-700 hover:bg-stone-100 focus:outline-none focus:ring-2 focus:ring-primary-500 dark:border-stone-600 dark:text-stone-300 dark:hover:bg-stone-700"
          >
            清空錯題本
          </button>
          <Link
            to="/exam"
            className="rounded-lg border border-stone-300 px-4 py-2 text-sm font-medium text-stone-700 hover:bg-stone-100 focus:outline-none focus:ring-2 focus:ring-primary-500 dark:border-stone-600 dark:text-stone-300 dark:hover:bg-stone-700"
          >
            去練習
          </Link>
        </div>
      </div>

      <p className="text-stone-600 dark:text-stone-400">
        共 {wrongList.length} 題。可「答題複習」逐題作答，或瀏覽題目後從錯題本移除已掌握的題目。
      </p>

      <ul className="space-y-8">
        {wrongList.map((q) => (
          <li key={q.id} className="relative">
            <QuestionCard
              question={q}
              selectedKey={q.correctKey}
              showResult={true}
              disabled={true}
              onSelect={() => {}}
            />
            <button
              type="button"
              onClick={() => {
                removeWrong(q.id)
                removeFromReview(q.id)
              }}
              className="mt-3 rounded-lg border border-stone-300 px-3 py-1.5 text-sm text-stone-600 hover:bg-stone-100 focus:outline-none focus:ring-2 focus:ring-primary-500 dark:border-stone-600 dark:text-stone-400 dark:hover:bg-stone-700"
            >
              從錯題本移除
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}
