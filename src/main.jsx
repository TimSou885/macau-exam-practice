import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, HashRouter } from 'react-router-dom'
import App from './App.jsx'
import './index.css'

// 部署到 Supabase Storage 時使用 Hash 路由（僅單一 index.html，無伺服器 rewrite）
const useHashRouter = import.meta.env.VITE_USE_HASH_ROUTER === 'true'
const Router = useHashRouter ? HashRouter : BrowserRouter

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Router>
      <App />
    </Router>
  </StrictMode>,
)
