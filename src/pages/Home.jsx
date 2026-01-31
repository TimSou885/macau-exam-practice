import { Link } from 'react-router-dom'

export default function Home() {
  // #region agent log
  if (typeof fetch !== 'undefined') fetch('http://127.0.0.1:7242/ingest/f2b3e46d-a0cf-4e75-83a0-2f3b42951dae', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ location: 'Home.jsx:render', message: 'Home render', data: {}, timestamp: Date.now(), sessionId: 'debug-session', hypothesisId: 'D' }) }).catch(() => {});
  // #endregion
  return (
    <div className="space-y-8">
      <section className="text-center space-y-4">
        <h1 className="text-3xl font-bold text-stone-900 dark:text-stone-100 sm:text-4xl">
          澳門政府統考練習
        </h1>
        <p className="text-stone-600 dark:text-stone-400 max-w-xl mx-auto text-lg">
          430 學士學位程度綜合能力評估 · 260 技術員程度綜合能力評估
          <br />
          線上練習，掌握題型，輕鬆備考。
        </p>
      </section>

      <section className="grid gap-3 sm:gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Link
          to="/exam"
          className="group flex flex-col rounded-2xl border-2 border-primary-200 bg-primary-50/50 p-4 sm:p-6 text-left transition hover:border-primary-400 hover:bg-primary-100/50 active:scale-[0.99] focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 dark:border-primary-800 dark:bg-primary-900/20 dark:hover:border-primary-600 dark:hover:bg-primary-900/40 min-h-[88px] sm:min-h-0"
        >
          <span className="text-sm font-medium text-primary-600 dark:text-primary-400">
            開始練習
          </span>
          <span className="mt-1 text-xl font-semibold text-stone-900 dark:text-stone-100">
            選擇考試類型
          </span>
          <span className="mt-2 text-sm text-stone-600 dark:text-stone-400">
            選擇 430 或 260 統考，依類別或全科練習。
          </span>
        </Link>

        <Link
          to="/challenge"
          className="group flex flex-col rounded-2xl border-2 border-amber-200 bg-amber-50/50 p-4 sm:p-6 text-left transition hover:border-amber-400 hover:bg-amber-100/50 active:scale-[0.99] focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 dark:border-amber-800 dark:bg-amber-900/20 dark:hover:border-amber-600 dark:hover:bg-amber-900/40 min-h-[88px] sm:min-h-0"
        >
          <span className="text-sm font-medium text-amber-600 dark:text-amber-400">
            挑戰模式
          </span>
          <span className="mt-1 text-xl font-semibold text-stone-900 dark:text-stone-100">
            50 / 100 / 自訂題數
          </span>
          <span className="mt-2 text-sm text-stone-600 dark:text-stone-400">
            全類別隨機題目，錯 5 題即失敗，全對即成功；錯題加入錯題本。
          </span>
        </Link>

        <Link
          to="/review"
          className="group flex flex-col rounded-2xl border-2 border-emerald-200 bg-emerald-50/50 p-4 sm:p-6 text-left transition hover:border-emerald-400 hover:bg-emerald-100/50 active:scale-[0.99] focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 dark:border-emerald-800 dark:bg-emerald-900/20 dark:hover:border-emerald-600 dark:hover:bg-emerald-900/40 min-h-[88px] sm:min-h-0"
        >
          <span className="text-sm font-medium text-emerald-600 dark:text-emerald-400">
            遺忘曲線複習
          </span>
          <span className="mt-1 text-xl font-semibold text-stone-900 dark:text-stone-100">
            間隔複習
          </span>
          <span className="mt-2 text-sm text-stone-600 dark:text-stone-400">
            依艾賓浩斯曲線在 1、3、7、15、30 天後複習錯題，鞏固記憶。
          </span>
        </Link>

        <Link
          to="/wrong"
          className="group flex flex-col rounded-2xl border-2 border-stone-200 bg-stone-50/50 p-4 sm:p-6 text-left transition hover:border-stone-300 hover:bg-stone-100/50 active:scale-[0.99] focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 dark:border-stone-700 dark:bg-stone-800/30 dark:hover:border-stone-600 dark:hover:bg-stone-800/50 min-h-[88px] sm:min-h-0"
        >
          <span className="text-sm font-medium text-stone-500 dark:text-stone-400">
            複習錯題
          </span>
          <span className="mt-1 text-xl font-semibold text-stone-900 dark:text-stone-100">
            錯題本
          </span>
          <span className="mt-2 text-sm text-stone-600 dark:text-stone-400">
            集中複習答錯的題目，加強弱項。
          </span>
        </Link>
      </section>

      <section className="rounded-xl border border-stone-200 bg-stone-50/50 p-4 dark:border-stone-700 dark:bg-stone-800/30">
        <h2 className="text-sm font-semibold text-stone-700 dark:text-stone-300">
          考試說明
        </h2>
        <ul className="mt-2 space-y-1 text-sm text-stone-600 dark:text-stone-400">
          <li>· 430 統考：學士學位程度，筆試約 58 題、1.5 小時，50 分合格。</li>
          <li>· 260 統考：技術員程度，題型涵蓋邏輯、語文、數學與常識。</li>
          <li>· 題型包含：法律、數學、圖表分析、推理邏輯、閱讀理解。</li>
          <li>· 正式開考資訊請以公職局網站為準。</li>
        </ul>
      </section>
    </div>
  )
}
