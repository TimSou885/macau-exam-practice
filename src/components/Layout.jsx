import { Outlet, Link, useLocation } from 'react-router-dom'

function NavLink({ to, children }) {
  const location = useLocation()
  const isActive = location.pathname === to || (to !== '/' && location.pathname.startsWith(to))
  return (
    <Link
      to={to}
      className={`rounded-lg px-3 py-2 text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 dark:focus:ring-offset-stone-900 ${
        isActive
          ? 'bg-primary-100 text-primary-800 dark:bg-primary-900/40 dark:text-primary-200'
          : 'text-stone-600 hover:bg-stone-100 hover:text-stone-900 dark:text-stone-400 dark:hover:bg-stone-800 dark:hover:text-stone-100'
      }`}
    >
      {children}
    </Link>
  )
}

export default function Layout({ children }) {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b border-stone-200 bg-white/80 backdrop-blur dark:border-stone-700 dark:bg-stone-900/80">
        <div className="mx-auto flex h-14 max-w-4xl items-center justify-between px-4">
          <Link
            to="/"
            className="text-lg font-bold text-primary-700 dark:text-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 rounded"
          >
            澳門統考練習
          </Link>
          <nav className="flex items-center gap-1">
            <NavLink to="/">首頁</NavLink>
            <NavLink to="/exam">選擇考試</NavLink>
            <NavLink to="/challenge">挑戰模式</NavLink>
            <NavLink to="/review">間隔複習</NavLink>
            <NavLink to="/wrong">錯題本</NavLink>
          </nav>
        </div>
      </header>
      <main className="flex-1 mx-auto w-full max-w-4xl px-4 py-6 sm:py-8">
        <Outlet />
      </main>
      <footer className="border-t border-stone-200 py-4 text-center text-sm text-stone-500 dark:border-stone-700 dark:text-stone-400">
        澳門政府 430 / 260 統考題目練習 · 僅供學習使用，正式資訊請以公職局為準
      </footer>
    </div>
  )
}
