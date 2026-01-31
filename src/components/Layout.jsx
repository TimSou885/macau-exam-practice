import { useState, useEffect } from 'react'
import { Outlet, Link, useLocation } from 'react-router-dom'

function NavLink({ to, children, isActive, onClick, mobile }) {
  const base = 'rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 dark:focus:ring-offset-stone-900'
  const activeClass = 'bg-primary-100 text-primary-800 dark:bg-primary-900/40 dark:text-primary-200'
  const inactiveClass = 'text-stone-600 hover:bg-stone-100 hover:text-stone-900 dark:text-stone-400 dark:hover:bg-stone-800 dark:hover:text-stone-100'
  const sizeClass = mobile ? 'block w-full px-4 py-3 text-base min-h-[44px] flex items-center' : 'px-3 py-2 text-sm'

  return (
    <Link
      to={to}
      onClick={onClick}
      className={`${base} ${isActive ? activeClass : inactiveClass} ${sizeClass}`}
    >
      {children}
    </Link>
  )
}

export default function Layout() {
  const location = useLocation()
  const [menuOpen, setMenuOpen] = useState(false)

  // #region agent log
  if (typeof fetch !== 'undefined') fetch('http://127.0.0.1:7242/ingest/f2b3e46d-a0cf-4e75-83a0-2f3b42951dae', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ location: 'Layout.jsx:render', message: 'Layout render', data: { pathname: location?.pathname }, timestamp: Date.now(), sessionId: 'debug-session', hypothesisId: 'C' }) }).catch(() => {});
  // #endregion

  useEffect(() => {
    setMenuOpen(false)
  }, [location.pathname])

  const isActive = (to) =>
    location.pathname === to || (to !== '/' && location.pathname.startsWith(to))

  const navLinks = [
    { to: '/', label: '首頁' },
    { to: '/exam', label: '選擇考試' },
    { to: '/challenge', label: '挑戰模式' },
    { to: '/review', label: '間隔複習' },
    { to: '/wrong', label: '錯題本' },
  ]

  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b border-stone-200 bg-white/95 backdrop-blur dark:border-stone-700 dark:bg-stone-900/95 sticky top-0 z-30">
        <div className="mx-auto flex min-h-14 max-w-4xl items-center justify-between gap-3 px-4 sm:px-6">
          <Link
            to="/"
            className="text-base font-bold text-primary-700 dark:text-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 rounded shrink-0 sm:text-lg"
          >
            澳門統考練習
          </Link>
          {/* 桌面導航 */}
          <nav className="hidden md:flex items-center gap-1" aria-label="主選單">
            {navLinks.map(({ to, label }) => (
              <NavLink key={to} to={to} isActive={isActive(to)}>
                {label}
              </NavLink>
            ))}
          </nav>
          {/* 手機選單按鈕 */}
          <button
            type="button"
            onClick={() => setMenuOpen((o) => !o)}
            className="md:hidden rounded-lg p-2.5 min-w-[44px] min-h-[44px] flex items-center justify-center text-stone-600 hover:bg-stone-100 dark:text-stone-400 dark:hover:bg-stone-800 focus:outline-none focus:ring-2 focus:ring-primary-500"
            aria-expanded={menuOpen}
            aria-label={menuOpen ? '關閉選單' : '開啟選單'}
          >
            {menuOpen ? (
              <span className="text-xl leading-none" aria-hidden>✕</span>
            ) : (
              <span className="flex flex-col gap-1.5" aria-hidden>
                <span className="w-5 h-0.5 bg-current rounded-full block" />
                <span className="w-5 h-0.5 bg-current rounded-full block" />
                <span className="w-5 h-0.5 bg-current rounded-full block" />
              </span>
            )}
          </button>
        </div>
        {/* 手機展開選單 */}
        {menuOpen && (
          <nav
            className="md:hidden border-t border-stone-200 bg-white dark:border-stone-700 dark:bg-stone-900 py-2"
            aria-label="主選單"
          >
            <div className="mx-auto max-w-4xl px-4 flex flex-col gap-0.5">
              {navLinks.map(({ to, label }) => (
                <NavLink
                  key={to}
                  to={to}
                  isActive={isActive(to)}
                  mobile
                  onClick={() => setMenuOpen(false)}
                >
                  {label}
                </NavLink>
              ))}
            </div>
          </nav>
        )}
      </header>
      <main className="flex-1 mx-auto w-full max-w-4xl px-4 py-5 sm:px-6 sm:py-8 pb-[calc(1.25rem+env(safe-area-inset-bottom))]">
        <Outlet />
      </main>
      <footer className="border-t border-stone-200 py-4 text-center text-xs sm:text-sm text-stone-500 dark:border-stone-700 dark:text-stone-400 px-4 pb-[env(safe-area-inset-bottom)]">
        澳門政府 430 / 260 統考題目練習 · 僅供學習使用，正式資訊請以公職局為準
      </footer>
    </div>
  )
}
