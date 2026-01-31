import { useLocation, Link } from 'react-router-dom'
import { EXAM_TYPES } from '../data'

export default function Result() {
  const location = useLocation()
  const state = location.state || {}
  const { total = 0, correct = 0, examType, category } = state

  const score = total > 0 ? Math.round((correct / total) * 100) : 0
  const meta = examType ? EXAM_TYPES[examType] : null
  const pass = score >= 50

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-stone-900 dark:text-stone-100 sm:text-3xl">
          練習結果
        </h1>
        {total === 0 && (
          <p className="mt-4 text-stone-600 dark:text-stone-400">
            尚無作答紀錄，請先完成一輪練習。
          </p>
        )}
      </div>

      {total > 0 && (
        <div className="mx-auto max-w-sm rounded-2xl border-2 border-stone-200 bg-white p-8 text-center dark:border-stone-700 dark:bg-stone-800/50">
          <p className="text-5xl font-bold text-stone-900 dark:text-stone-100">
            {score}
            <span className="text-2xl text-stone-500">分</span>
          </p>
          <p className="mt-2 text-stone-600 dark:text-stone-400">
            答對 {correct} / {total} 題
          </p>
          <p className={`mt-2 font-medium ${pass ? 'text-primary-600 dark:text-primary-400' : 'text-amber-600 dark:text-amber-400'}`}>
            {pass ? '達到合格標準（50 分）' : '未達 50 分，請多練習'}
          </p>
          {meta && (
            <p className="mt-2 text-sm text-stone-500 dark:text-stone-400">
              {meta.name}
              {category && category !== 'all' ? ` · ${category}` : ''}
            </p>
          )}
        </div>
      )}

      <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
        {examType && (
          <Link
            to={`/practice/${examType}${category && category !== 'all' ? `?category=${category}` : ''}`}
            className="inline-flex justify-center rounded-xl bg-primary-600 px-6 py-3 text-base font-medium text-white shadow-sm hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 dark:bg-primary-500 dark:hover:bg-primary-600 min-h-[44px]"
          >
            再練一輪
          </Link>
        )}
        <Link
          to="/exam"
          className="inline-flex justify-center rounded-xl border-2 border-stone-300 bg-white px-6 py-3 text-base font-medium text-stone-700 hover:bg-stone-50 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 dark:border-stone-600 dark:bg-stone-800 dark:text-stone-200 dark:hover:bg-stone-700 min-h-[44px]"
        >
          選擇其他考試
        </Link>
        <Link
          to="/wrong"
          className="inline-flex justify-center rounded-xl border-2 border-stone-300 bg-white px-6 py-3 text-base font-medium text-stone-700 hover:bg-stone-50 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 dark:border-stone-600 dark:bg-stone-800 dark:text-stone-200 dark:hover:bg-stone-700 min-h-[44px]"
        >
          錯題本
        </Link>
      </div>
    </div>
  )
}
