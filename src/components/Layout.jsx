import { Outlet, useLocation } from 'react-router-dom'
import { AppShell } from '@astryxdesign/core/AppShell'
import { Button } from '@astryxdesign/core/Button'
import { Text } from '@astryxdesign/core/Text'
import { TopNav, TopNavHeading, TopNavItem } from '@astryxdesign/core/TopNav'
import { VStack } from '@astryxdesign/core/VStack'
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

function isImmersive(pathname) {
  if (pathname.startsWith('/quiz/')) return true
  if (pathname === '/wrong/quiz') return true
  if (pathname === '/review/session') return true
  const segments = pathname.split('/').filter(Boolean)
  return segments[0] === 'challenge' && segments.length === 2 && segments[1] !== 'result'
}

export default function Layout() {
  const { pathname } = useLocation()
  const { mode, cycle } = useColorModeActions()
  const immersive = isImmersive(pathname)

  return (
    <AppShell
      height="auto"
      variant="section"
      contentPadding={0}
      topNav={
        <TopNav
          label="主要選單"
          heading={<TopNavHeading heading="澳門統考練習" headingHref="/" />}
          startContent={
            <>
              {NAV.map((item) => (
                <TopNavItem
                  key={item.to}
                  href={item.to}
                  label={item.label}
                  isSelected={item.match(pathname)}
                />
              ))}
            </>
          }
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
    >
      <Outlet />
      {immersive ? null : (
        <VStack gap={1} className="site-footer" padding={6}>
          <Text type="supporting">
            非官方練習站。正式開考資訊請以公職局為準。進度只存在這台裝置的瀏覽器。
          </Text>
          <Text type="supporting">
            <NativeLink href="/about">關於本站與常見問題</NativeLink>
            {' · '}
            <NativeLink href="http://concurso-uni.safp.gov.mo/" isExternal>
              澳門公職開考
            </NativeLink>
            {' · '}
            <NativeLink href="https://thesoustudio.com/" isExternal>
              Sou Studio
            </NativeLink>
            {' · '}
            <NativeLink href="https://mauroad.com/" isExternal>
              mauroad
            </NativeLink>
          </Text>
        </VStack>
      )}
    </AppShell>
  )
}
