import { Outlet, useLocation } from 'react-router-dom'
import { AppShell } from '@astryxdesign/core/AppShell'
import { Button } from '@astryxdesign/core/Button'
import { SideNav } from '@astryxdesign/core/SideNav'
import { SideNavItem } from '@astryxdesign/core/SideNav'
import { TopNav } from '@astryxdesign/core/TopNav'
import { TopNavHeading } from '@astryxdesign/core/TopNav'
import NativeLink from './NativeLink'
import { useColorModeActions } from '../theme/AppTheme'

const NAV = [
  { to: '/', label: '首頁', match: (path) => path === '/' },
  {
    to: '/exam',
    label: '練習',
    match: (path) =>
      path === '/exam' ||
      path.startsWith('/practice') ||
      path.startsWith('/quiz') ||
      path === '/result',
  },
  { to: '/challenge', label: '挑戰', match: (path) => path.startsWith('/challenge') },
  { to: '/review', label: '間隔複習', match: (path) => path.startsWith('/review') },
  { to: '/wrong', label: '錯題本', match: (path) => path.startsWith('/wrong') },
]

const MODE_LABEL = { light: '淺色', dark: '深色', system: '跟隨系統' }

export default function Layout() {
  const { pathname } = useLocation()
  const { mode, cycle } = useColorModeActions()

  return (
    <AppShell
      height="fill"
      variant="section"
      contentPadding={0}
      topNav={
        <TopNav
          label="主選單"
          heading={<TopNavHeading heading="澳門統考練習" headingHref="/" />}
          endContent={
            <Button
              label={`外觀：${MODE_LABEL[mode]}`}
              variant="secondary"
              size="md"
              onClick={cycle}
            />
          }
        />
      }
      sideNav={
        <SideNav
          aria-label="主要選單"
          footer={
            <NativeLink href="/about">關於本站</NativeLink>
          }
        >
          {NAV.map((item) => (
            <SideNavItem
              key={item.to}
              href={item.to}
              label={item.label}
              isSelected={item.match(pathname)}
            />
          ))}
        </SideNav>
      }
    >
      <Outlet />
    </AppShell>
  )
}
