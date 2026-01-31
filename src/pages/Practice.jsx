import { useParams, Link, useSearchParams } from 'react-router-dom'
import { EXAM_TYPES, getQuestionsByExamAndCategory } from '../data'

export default function Practice() {
  const { examType } = useParams()
  const [searchParams] = useSearchParams()
  const category = searchParams.get('category') || 'all'

  const meta = EXAM_TYPES[examType]
  const questions = getQuestionsByExamAndCategory(examType, category === 'all' ? null : category)

  if (!meta) {
    return (
      <div className="text-center py-12">
        <p className="text-stone-600 dark:text-stone-400">找不到該考試類型。</p>
        <Link to="/exam" className="mt-4 inline-block text-primary-600 dark:text-primary-400 underline">
          返回選擇考試
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-stone-900 dark:text-stone-100">
            {meta.name} 練習
          </h1>
          <p className="mt-1 text-stone-600 dark:text-stone-400">
            {meta.fullName}
          </p>
        </div>
        <Link
          to="/exam"
          className="text-sm font-medium text-stone-500 hover:text-stone-700 dark:text-stone-400 dark:hover:text-stone-200"
        >
          ← 更換考試類型
        </Link>
      </div>

      <section>
        <h2 className="text-sm font-semibold text-stone-700 dark:text-stone-300 mb-3">
          選擇題目類別
        </h2>
        <div className="flex flex-wrap gap-2">
          <Link
            to={`/practice/${examType}`}
            className={`rounded-lg px-4 py-2.5 min-h-[44px] text-sm font-medium transition focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 ${
              category === 'all'
                ? 'bg-primary-600 text-white dark:bg-primary-500'
                : 'bg-stone-200 text-stone-700 hover:bg-stone-300 dark:bg-stone-700 dark:text-stone-300 dark:hover:bg-stone-600'
            }`}
          >
            全部
          </Link>
          {meta.categories.map((cat) => (
            <Link
              key={cat.id}
              to={`/practice/${examType}?category=${cat.id}`}
              className={`rounded-lg px-4 py-2.5 min-h-[44px] text-sm font-medium transition focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 ${
                category === cat.id
                  ? 'bg-primary-600 text-white dark:bg-primary-500'
                  : 'bg-stone-200 text-stone-700 hover:bg-stone-300 dark:bg-stone-700 dark:text-stone-300 dark:hover:bg-stone-600'
              }`}
            >
              {cat.name}
            </Link>
          ))}
        </div>
      </section>

      <section className="rounded-xl border border-stone-200 bg-white p-6 dark:border-stone-700 dark:bg-stone-800/50">
        <p className="text-stone-600 dark:text-stone-400">
          本類別共 <strong className="text-stone-900 dark:text-stone-100">{questions.length}</strong> 題。
        </p>
        {questions.length === 0 ? (
          <p className="mt-4 text-stone-500 dark:text-stone-400">
            暫無該類別題目，可選擇「全部」或其他類別練習。
          </p>
        ) : (
          <Link
            to={`/quiz/${examType}?category=${category}`}
            className="mt-6 inline-flex items-center justify-center rounded-xl bg-primary-600 px-6 py-3 text-base font-medium text-white shadow-sm hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 dark:bg-primary-500 dark:hover:bg-primary-600 min-h-[44px]"
          >
            開始練習
          </Link>
        )}
      </section>
    </div>
  )
}
