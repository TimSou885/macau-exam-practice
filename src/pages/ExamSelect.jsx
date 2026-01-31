import { Link } from 'react-router-dom'
import { EXAM_TYPES } from '../data'

export default function ExamSelect() {
  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-stone-900 dark:text-stone-100 sm:text-3xl">
          選擇考試類型
        </h1>
        <p className="mt-2 text-stone-600 dark:text-stone-400">
          選擇要練習的統考類型，進入後可再選擇題目類別。
        </p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        {Object.values(EXAM_TYPES).map((exam) => (
          <Link
            key={exam.id}
            to={`/practice/${exam.id}`}
            className="block rounded-2xl border-2 border-stone-200 bg-white p-6 shadow-sm transition hover:border-primary-300 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 dark:border-stone-700 dark:bg-stone-800/50 dark:hover:border-primary-600"
          >
            <span className="text-2xl font-bold text-primary-600 dark:text-primary-400">
              {exam.name}
            </span>
            <p className="mt-1 font-medium text-stone-900 dark:text-stone-100">
              {exam.fullName}
            </p>
            <p className="mt-2 text-sm text-stone-600 dark:text-stone-400">
              {exam.description}
            </p>
            <span className="mt-4 inline-block text-sm font-medium text-primary-600 dark:text-primary-400">
              開始練習 →
            </span>
          </Link>
        ))}
      </div>
    </div>
  )
}
