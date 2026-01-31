import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, HashRouter } from 'react-router-dom'
import App from './App.jsx'
import './index.css'

// #region agent log
const _log = (loc, msg, data, hid) => {
  fetch('http://127.0.0.1:7242/ingest/f2b3e46d-a0cf-4e75-83a0-2f3b42951dae', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ location: loc, message: msg, data: data || {}, timestamp: Date.now(), sessionId: 'debug-session', hypothesisId: hid }) }).catch(() => {});
};
// #endregion

// 部署到 Supabase Storage 時使用 Hash 路由（僅單一 index.html，無伺服器 rewrite）
const useHashRouter = import.meta.env.VITE_USE_HASH_ROUTER === 'true'
const Router = useHashRouter ? HashRouter : BrowserRouter

// #region agent log
const rootEl = document.getElementById('root')
_log('main.jsx:beforeRender', 'main before render', { rootExists: !!rootEl, useHashRouter }, 'A')
// #endregion

if (!rootEl) {
  console.error('Root element #root not found')
  throw new Error('Root element #root not found')
}

try {
  createRoot(rootEl).render(
    <StrictMode>
      <Router>
        <App />
      </Router>
    </StrictMode>,
  )
  // #region agent log
  _log('main.jsx:afterRender', 'main after render', {}, 'A')
  // #endregion
} catch (e) {
  // #region agent log
  _log('main.jsx:renderError', 'main render error', { error: String(e), stack: e?.stack }, 'E')
  // #endregion
  throw e
}
