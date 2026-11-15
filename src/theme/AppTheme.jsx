import { createContext, useContext, useEffect, useState } from 'react'
import { InternationalizationProvider } from '@astryxdesign/core/i18n'
import { LinkProvider } from '@astryxdesign/core/Link'
import { Theme } from '@astryxdesign/core/theme'
import zhTW from '@astryxdesign/core/locales/zh-TW.generated.js'
import { matchaTheme } from '@astryxdesign/theme-matcha/built'
import { Link as RouterLink } from 'react-router-dom'
import { STORAGE_KEYS } from '../data'

const MODES = ['light', 'dark', 'system']
const ColorModeContext = createContext({ mode: 'system', cycle: () => {} })

function RouterAnchor({ href, to, children, ...props }) {
  return (
    <RouterLink to={to ?? href} {...props}>
      {children}
    </RouterLink>
  )
}

export function useColorMode() {
  const [mode, setMode] = useState(() => {
    try {
      const parsed = JSON.parse(localStorage.getItem(STORAGE_KEYS.settings) || 'null')
      if (MODES.includes(parsed?.colorMode)) return parsed.colorMode
    } catch {
      // Ignore unreadable settings and follow the system.
    }
    return 'system'
  })

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.settings, JSON.stringify({ colorMode: mode }))
    } catch {
      // Ignore quota failures.
    }
    document.documentElement.dataset.colorMode = mode
  }, [mode])

  const cycle = () => {
    setMode((current) => MODES[(MODES.indexOf(current) + 1) % MODES.length])
  }

  return { mode, cycle }
}

export default function AppTheme({ children }) {
  const { mode, cycle } = useColorMode()
  return (
    <InternationalizationProvider locale="zh-TW" messages={{ 'zh-TW': zhTW }}>
      <Theme theme={matchaTheme} mode={mode}>
        <LinkProvider component={RouterAnchor}>
          <ColorModeContext.Provider value={{ mode, cycle }}>{children}</ColorModeContext.Provider>
        </LinkProvider>
      </Theme>
    </InternationalizationProvider>
  )
}

export function useColorModeActions() {
  return useContext(ColorModeContext)
}
