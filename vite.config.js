import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  // 部署到 Supabase Storage 子路徑時可設 VITE_BASE_URL（例如 /storage/v1/object/public/web/）
  base: process.env.VITE_BASE_URL || '/',
})
