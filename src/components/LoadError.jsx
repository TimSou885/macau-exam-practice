export default function LoadError({ message, onRetry }) {
  return (
    <div className="text-center py-12 space-y-4">
      <p className="text-red-600 dark:text-red-400">無法載入題目：{message}</p>
      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="text-primary-600 dark:text-primary-400 underline"
        >
          重試
        </button>
      )}
    </div>
  )
}
