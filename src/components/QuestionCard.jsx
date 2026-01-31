function OptionButton({ option, selected, correct, showResult, disabled, onSelect }) {
  const isCorrectOption = option.key === correct
  const isSelectedCorrect = showResult && selected === option.key && selected === correct
  const isSelectedWrong = showResult && selected === option.key && selected !== correct
  const showAsCorrect = showResult && isCorrectOption
  const showAsWrong = showResult && isSelectedWrong

  let bg = 'bg-white dark:bg-stone-800 border-stone-200 dark:border-stone-600'
  if (showAsCorrect) bg = 'bg-primary-100 border-primary-500 dark:bg-primary-900/50 dark:border-primary-400'
  if (showAsWrong) bg = 'bg-red-50 border-red-400 dark:bg-red-900/30 dark:border-red-500'
  if (!showResult && selected === option.key) bg = 'bg-primary-50 border-primary-400 dark:bg-primary-900/40 dark:border-primary-500'

  return (
    <button
      type="button"
      disabled={disabled}
      onClick={() => onSelect(option.key)}
      className={`w-full rounded-xl border-2 p-4 sm:p-4 text-left transition focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:pointer-events-none min-h-[48px] sm:min-h-[44px] text-base sm:text-sm ${bg}`}
    >
      <span className="font-medium text-stone-900 dark:text-stone-100 break-words">
        {option.key}. {option.text}
      </span>
      {showResult && isCorrectOption && (
        <span className="ml-2 text-sm text-primary-600 dark:text-primary-400">✓ 正確答案</span>
      )}
      {showAsWrong && (
        <span className="ml-2 text-sm text-red-600 dark:text-red-400">✗ 你的選擇</span>
      )}
    </button>
  )
}

export default function QuestionCard({ question, selectedKey, onSelect, showResult, disabled }) {
  if (!question) return null

  const categoryNames = {
    law: '法律',
    math: '數學',
    chart: '圖表分析',
    logic: '推理邏輯',
    reading: '閱讀理解',
  }

  return (
    <article className="rounded-2xl border border-stone-200 bg-white p-4 sm:p-6 dark:border-stone-700 dark:bg-stone-800/50">
      <div className="mb-3 sm:mb-4 flex items-center gap-2">
        <span className="rounded-full bg-stone-200 px-2.5 py-0.5 text-xs font-medium text-stone-600 dark:bg-stone-600 dark:text-stone-300">
          {categoryNames[question.category] || question.category}
        </span>
      </div>
      <h2 className="text-base sm:text-lg font-semibold text-stone-900 dark:text-stone-100 leading-relaxed break-words">
        {question.question}
      </h2>
      <ul className="mt-4 sm:mt-6 flex flex-col gap-2 sm:gap-3" role="listbox" aria-label="選項">
        {question.options.map((opt) => (
          <li key={opt.key}>
            <OptionButton
              option={opt}
              selected={selectedKey}
              correct={question.correctKey}
              showResult={showResult}
              disabled={disabled}
              onSelect={onSelect}
            />
          </li>
        ))}
      </ul>
      {showResult && question.explanation && (
        <div className="mt-4 sm:mt-6 rounded-lg bg-stone-100 p-3 sm:p-4 dark:bg-stone-700/50">
          <p className="text-sm font-medium text-stone-700 dark:text-stone-300">解析</p>
          <p className="mt-1 text-sm text-stone-600 dark:text-stone-400 break-words">
            {question.explanation}
          </p>
        </div>
      )}
    </article>
  )
}
