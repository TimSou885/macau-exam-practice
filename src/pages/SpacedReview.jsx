import { Link } from 'react-router-dom'
import { useReviewSchedule } from '../hooks/useStorage'
import { REVIEW_INTERVAL_DAYS } from '../data'

export default function SpacedReview() {
  const { dueIds, schedule, clearReview } = useReviewSchedule()
  const totalScheduled = Object.keys(schedule).length
  const dueCount = dueIds.length

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-stone-900 dark:text-stone-100 sm:text-3xl">
          遺忘曲線複習
        </h1>
        <p className="mt-2 text-stone-600 dark:text-stone-400">
          依艾賓浩斯遺忘曲線安排複習：答錯的題目會在 1、3、7、15、30 天後再次出現，鞏固記憶。
        </p>
      </div>

      <section className="rounded-xl border border-stone-200 bg-white p-6 dark:border-stone-700 dark:bg-stone-800/50">
        <h2 className="text-sm font-semibold text-stone-700 dark:text-stone-300 mb-3">
          今日待複習
        </h2>
        <p className="text-stone-600 dark:text-stone-400">
          {totalScheduled === 0 ? (
            <>尚無排程。答錯的題目會自動加入複習排程，請先到練習或挑戰模式作答。</>
          ) : dueCount === 0 ? (
            <>目前沒有到期題目，共 {totalScheduled} 題在排程中。明天再來看看吧。</>
          ) : (
            <>
              共 <strong className="text-stone-900 dark:text-stone-100">{dueCount}</strong> 題待複習
              {totalScheduled > dueCount && (
                <span className="text-stone-500 dark:text-stone-400">
                  （排程中共 {totalScheduled} 題）
                </span>
              )}
            </>
          )}
        </p>
        {dueCount > 0 && (
          <Link
            to="/review/session"
            className="mt-6 inline-flex items-center justify-center rounded-xl bg-primary-600 px-6 py-3 text-base font-medium text-white shadow-sm hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 dark:bg-primary-500 dark:hover:bg-primary-600 min-h-[44px]"
          >
            開始複習（{dueCount} 題）
          </Link>
        )}
      </section>

      <section className="rounded-xl border border-stone-200 bg-stone-50/50 p-4 dark:border-stone-700 dark:bg-stone-800/30">
        <h2 className="text-sm font-semibold text-stone-700 dark:text-stone-300 mb-2">
          複習間隔說明
        </h2>
        <p className="text-sm text-stone-600 dark:text-stone-400">
          第一次答錯：1 天後複習 → 答對則延長為 3 天 → 7 天 → 15 天 → 30 天。
          複習時再答錯則重新從 1 天後開始。間隔為：第 {REVIEW_INTERVAL_DAYS.join('、')} 天。
        </p>
      </section>

      {totalScheduled > 0 && (
        <div className="flex justify-center">
          <button
            type="button"
            onClick={() => {
              if (window.confirm('確定要清空所有複習排程嗎？錯題本不會受影響。')) clearReview()
            }}
            className="rounded-lg border border-stone-300 px-4 py-2 text-sm font-medium text-stone-600 hover:bg-stone-100 focus:outline-none focus:ring-2 focus:ring-primary-500 dark:border-stone-600 dark:text-stone-400 dark:hover:bg-stone-700"
          >
            清空複習排程
          </button>
        </div>
      )}

      <p className="text-center text-sm text-stone-500 dark:text-stone-400">
        <Link to="/wrong" className="text-primary-600 dark:text-primary-400 hover:underline">
          前往錯題本
        </Link>
        {' · '}
        <Link to="/exam" className="text-primary-600 dark:text-primary-400 hover:underline">
          選擇考試練習
        </Link>
      </p>
    </div>
  )
}
