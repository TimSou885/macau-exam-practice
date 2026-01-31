import { Link, useLocation, useNavigate } from 'react-router-dom'

export default function ChallengeResult() {
  const location = useLocation()
  const navigate = useNavigate()
  const state = location.state

  if (!state) {
    navigate('/challenge', { replace: true })
    return null
  }

  const { success, total, wrongCount = 0, answeredCount, examType, quitEarly } = state

  return (
    <div className="space-y-8">
      <div className="rounded-2xl border-2 border-stone-200 bg-white p-8 text-center dark:border-stone-700 dark:bg-stone-800/50">
        {success ? (
          <>
            <h1 className="text-2xl font-bold text-green-600 dark:text-green-400 sm:text-3xl">
              挑戰成功！
            </h1>
            <p className="mt-2 text-stone-600 dark:text-stone-400">
              全對，共 {total} 題全部答對。
            </p>
          </>
        ) : (
          <>
            <h1 className="text-2xl font-bold text-amber-600 dark:text-amber-400 sm:text-3xl">
              挑戰失敗
            </h1>
            <p className="mt-2 text-stone-600 dark:text-stone-400">
              {wrongCount >= 5
                ? `已錯 ${wrongCount} 題，達 5 題即失敗。`
                : quitEarly
                  ? `已作答 ${answeredCount} 題，中途結束。`
                  : `共 ${total} 題，答對 ${answeredCount - wrongCount} 題，錯 ${wrongCount} 題。`}
            </p>
            {(wrongCount > 0 || answeredCount > 0) && (
              <p className="mt-1 text-sm text-stone-500 dark:text-stone-400">
                錯題已加入錯題本，可至錯題本複習。
              </p>
            )}
          </>
        )}
      </div>

      <div className="flex flex-wrap justify-center gap-3">
        <Link
          to="/challenge"
          className="rounded-xl bg-primary-600 px-6 py-3 text-base font-medium text-white shadow-sm hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 dark:bg-primary-500 dark:hover:bg-primary-600"
        >
          再挑戰
        </Link>
        <Link
          to="/wrong"
          className="rounded-xl border-2 border-stone-300 px-6 py-3 text-base font-medium text-stone-700 hover:bg-stone-100 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 dark:border-stone-600 dark:text-stone-300 dark:hover:bg-stone-700"
        >
          錯題本
        </Link>
        <Link
          to="/"
          className="rounded-xl border-2 border-stone-200 px-6 py-3 text-base font-medium text-stone-600 hover:bg-stone-50 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 dark:border-stone-700 dark:text-stone-400 dark:hover:bg-stone-800"
        >
          返回首頁
        </Link>
      </div>
    </div>
  )
}
