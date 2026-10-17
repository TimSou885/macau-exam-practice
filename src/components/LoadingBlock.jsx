export default function LoadingBlock({ label = '載入題目中…' }) {
  return (
    <div className="text-center py-12 text-stone-600 dark:text-stone-400">
      {label}
    </div>
  )
}
