import { Link, Outlet, useLocation } from 'react-router-dom'
import BottomTabBar, { isImmersiveRoute } from './BottomTabBar'

function NavLink({ to, children, isActive }) {
  const base =
    'rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 dark:focus:ring-offset-stone-900 px-3 py-2 text-sm'
  const activeClass =
    'bg-primary-100 text-primary-800 dark:bg-primary-900/40 dark:text-primary-200'
  const inactiveClass =
    'text-stone-600 hover:bg-stone-100 hover:text-stone-900 dark:text-stone-400 dark:hover:bg-stone-800 dark:hover:text-stone-100'

  return (
    <Link to={to} className={`${base} ${isActive ? activeClass : inactiveClass}`}>
      {children}
    </Link>
  )
}

export default function Layout() {
  const location = useLocation()
  const immersive = isImmersiveRoute(location.pathname)
  const showMobileTabs = !immersive

  const isActive = (to) =>
    location.pathname === to || (to !== '/' && location.pathname.startsWith(to))

  const navLinks = [
    { to: '/', label: '首頁' },
    { to: '/exam', label: '選擇考試' },
    { to: '/challenge', label: '挑戰模式' },
    { to: '/review', label: '間隔複習' },
    { to: '/wrong', label: '錯題本' },
  ]

  const mainPaddingClass = showMobileTabs
    ? 'pb-[calc(1.25rem+var(--bottom-tab-height)+env(safe-area-inset-bottom))] md:pb-[calc(1.25rem+env(safe-area-inset-bottom))]'
    : 'pb-[calc(1.25rem+env(safe-area-inset-bottom))]'

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
          <nav className="hidden md:flex items-center gap-1" aria-label="主選單">
            {navLinks.map(({ to, label }) => (
              <NavLink key={to} to={to} isActive={isActive(to)}>
                {label}
              </NavLink>
            ))}
          </nav>
        </div>
      </header>
      <main
        className={`flex-1 mx-auto w-full max-w-4xl px-4 py-5 sm:px-6 sm:py-8 ${mainPaddingClass}`}
      >
        <Outlet />
      </main>
      {!immersive && (
        <footer className="hidden md:block border-t border-stone-200 py-4 text-center text-xs sm:text-sm text-stone-500 dark:border-stone-700 dark:text-stone-400 px-4 space-y-1">
          <p>澳門政府 430 / 260 統考題目練習 · 僅供學習使用，正式資訊請以公職局為準</p>
          <p>
            本站由{' '}
            <a
              href="https://thesoustudio.com/"
              rel="noopener noreferrer"
              className="text-primary-700 hover:underline dark:text-primary-400"
            >
              Sou Studio
            </a>{' '}
            製作 · 與{' '}
            <a
              href="https://mauroad.com/"
              rel="noopener noreferrer"
              className="text-primary-700 hover:underline dark:text-primary-400"
            >
              mauroad
            </a>
            （澳門路況）互連
          </p>
        </footer>
      )}
      {showMobileTabs && <BottomTabBar />}
    </div>
  )
}
