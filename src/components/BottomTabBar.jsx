import { Link, useLocation } from 'react-router-dom'

const TABS = [
  { to: '/', label: '首頁', match: (path) => path === '/' },
  {
    to: '/exam',
    label: '練習',
    match: (path) => path === '/exam' || path.startsWith('/practice/'),
  },
  {
    to: '/challenge',
    label: '挑戰',
    match: (path) =>
      path === '/challenge' ||
      path.startsWith('/challenge/'),
  },
  {
    to: '/review',
    label: '複習',
    match: (path) =>
      path === '/review' ||
      path === '/wrong' ||
      (path.startsWith('/wrong/') && path !== '/wrong/quiz'),
  },
]

function TabItem({ to, label, active }) {
  return (
    <Link
      to={to}
      aria-current={active ? 'page' : undefined}
      className={`flex flex-1 flex-col items-center justify-center gap-0.5 min-h-[var(--bottom-tab-height)] px-1 text-xs font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-inset motion-reduce:transition-none ${
        active
          ? 'text-primary-700 dark:text-primary-300'
          : 'text-stone-500 hover:text-stone-800 dark:text-stone-400 dark:hover:text-stone-200'
      }`}
    >
      <span
        className={`text-lg leading-none ${active ? 'opacity-100' : 'opacity-70'}`}
        aria-hidden
      >
        {label === '首頁' && '⌂'}
        {label === '練習' && '✎'}
        {label === '挑戰' && '⚡'}
        {label === '複習' && '↻'}
      </span>
      <span>{label}</span>
    </Link>
  )
}

export default function BottomTabBar() {
  const { pathname } = useLocation()

  return (
    <nav
      className="md:hidden fixed bottom-0 inset-x-0 z-40 border-t border-stone-200 bg-white/95 backdrop-blur dark:border-stone-700 dark:bg-stone-900/95 pb-[env(safe-area-inset-bottom)]"
      aria-label="主要分頁"
    >
      <div className="mx-auto flex max-w-4xl">
        {TABS.map(({ to, label, match }) => (
          <TabItem key={to} to={to} label={label} active={match(pathname)} />
        ))}
      </div>
    </nav>
  )
}

export function isImmersiveRoute(pathname) {
  if (pathname.startsWith('/quiz/')) return true
  if (pathname === '/wrong/quiz') return true
  if (pathname === '/review/session') return true
  const segments = pathname.split('/').filter(Boolean)
  if (segments[0] === 'challenge' && segments.length === 2 && segments[1] !== 'result') {
    return true
  }
  return false
}
