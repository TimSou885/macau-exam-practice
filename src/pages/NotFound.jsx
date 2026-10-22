import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <div className="py-16 text-center space-y-4">
      <h1 className="text-2xl font-bold text-stone-900 dark:text-stone-100">找不到頁面</h1>
      <p className="text-stone-600 dark:text-stone-400">您要找的頁面不存在或已移除。</p>
      <Link to="/" className="inline-block text-primary-700 hover:underline dark:text-primary-400">
        返回首頁
      </Link>
    </div>
  )
}
