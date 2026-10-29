export default function LoadingBlock({ label = '載入題目中…' }) {
  return (
    <div
      className="flex flex-col items-center justify-center py-12 text-stone-600 dark:text-stone-400"
      role="status"
      aria-busy="true"
      aria-live="polite"
    >
      <span
        className="mb-3 inline-block h-8 w-8 animate-spin rounded-full border-2 border-stone-300 border-t-primary-600 motion-reduce:animate-none dark:border-stone-600 dark:border-t-primary-400"
        aria-hidden
      />
      <p>{label}</p>
    </div>
  )
}
