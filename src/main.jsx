import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider } from 'react-router-dom'
import { router } from './App.jsx'
import AppTheme from './theme/AppTheme.jsx'
import './index.css'

const rootEl = document.getElementById('root')

if (!rootEl) {
  console.error('Root element #root not found')
  throw new Error('Root element #root not found')
}

createRoot(rootEl).render(
  <StrictMode>
    <AppTheme>
      <RouterProvider router={router} />
    </AppTheme>
  </StrictMode>,
)
