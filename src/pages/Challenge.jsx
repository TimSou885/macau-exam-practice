import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { EXAM_TYPES, getQuestionsByExam } from '../data'

const PRESET_COUNTS = [50, 100]
const MIN_CUSTOM = 10
const MAX_CUSTOM = 2000

// #region agent log
const _log = (location, message, data, hypothesisId) => {
  fetch('http://127.0.0.1:7242/ingest/f2b3e46d-a0cf-4e75-83a0-2f3b42951dae', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ location, message, data: { ...data }, timestamp: Date.now(), sessionId: 'debug-session', hypothesisId }) }).catch(() => {});
};
// #endregion

export default function Challenge() {
  const navigate = useNavigate()
  const [examType, setExamType] = useState(null)
  const [quantityMode, setQuantityMode] = useState(null) // '50' | '100' | 'custom'
  const [customCount, setCustomCount] = useState(50)

  // #region agent log
  let maxForExamVal;
  try {
    maxForExamVal = examType ? getQuestionsByExam(examType).length : 0;
  } catch (e) {
    _log('Challenge.jsx:getQuestionsByExam', 'getQuestionsByExam threw', { examType, error: String(e) }, 'B');
    maxForExamVal = 0;
  }
  const maxForExam = maxForExamVal;
  // #endregion
  const effectiveMax = Math.min(MAX_CUSTOM, maxForExam)

  const getCount = () => {
    // #region agent log
    const _effectiveMax = effectiveMax;
    const _customCount = customCount;
    const _quantityMode = quantityMode;
    // #endregion
    if (_quantityMode === 'custom') {
      const out = Math.min(effectiveMax, Math.max(MIN_CUSTOM, customCount));
      // #region agent log
      _log('Challenge.jsx:getCount', 'getCount custom branch', { quantityMode: _quantityMode, customCount: _customCount, effectiveMax: _effectiveMax, out, isNaN: Number.isNaN(out) }, 'A');
      // #endregion
      return out;
    }
    if (_quantityMode === '50') return 50
    if (_quantityMode === '100') return 100
    // #region agent log
    _log('Challenge.jsx:getCount', 'getCount null branch', { quantityMode: _quantityMode }, 'A');
    // #endregion
    return null
  }

  const count = getCount()
  const canStart = examType && count !== null && count >= MIN_CUSTOM && count <= maxForExam

  // #region agent log
  _log('Challenge.jsx:render', 'Challenge render', { examType, quantityMode, customCount, maxForExam, effectiveMax, count, countType: typeof count, canStart }, 'A');
  // #endregion

  const handleStart = () => {
    // #region agent log
    _log('Challenge.jsx:handleStart', 'handleStart called', { canStart, count, examType }, 'D');
    // #endregion
    if (!canStart) return
    navigate(`/challenge/${examType}?count=${count}`)
  }

  const handleQuantityClick = (mode) => {
    // #region agent log
    _log('Challenge.jsx:quantityClick', 'quantity mode selected', { mode }, 'E');
    // #endregion
    setQuantityMode(mode)
  }

  const handleCustomChange = (e) => {
    const v = parseInt(e.target.value, 10)
    // #region agent log
    _log('Challenge.jsx:customChange', 'custom input change', { raw: e.target.value, parsed: v, isNaN: Number.isNaN(v) }, 'C');
    // #endregion
    setQuantityMode('custom')
    if (!Number.isNaN(v)) setCustomCount(v)
  }

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-stone-900 dark:text-stone-100 sm:text-3xl">
          挑戰模式
        </h1>
        <p className="mt-2 text-stone-600 dark:text-stone-400">
          全類別隨機題目，錯滿 5 題即失敗，全對即成功；錯題會加入錯題本。
        </p>
      </div>

      <section>
        <h2 className="text-sm font-semibold text-stone-700 dark:text-stone-300 mb-3">
          1. 選擇考試類型
        </h2>
        <div className="grid gap-4 sm:grid-cols-2">
          {Object.values(EXAM_TYPES).map((exam) => {
            const total = getQuestionsByExam(exam.id).length
            const active = examType === exam.id
            return (
              <button
                key={exam.id}
                type="button"
                onClick={() => {
                  setExamType(exam.id)
                  setQuantityMode(null)
                }}
                className={`rounded-xl border-2 p-5 text-left transition focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 dark:focus:ring-offset-stone-900 ${
                  active
                    ? 'border-primary-500 bg-primary-50 dark:border-primary-400 dark:bg-primary-900/30'
                    : 'border-stone-200 bg-white hover:border-stone-300 dark:border-stone-700 dark:bg-stone-800/50 dark:hover:border-stone-600'
                }`}
              >
                <span className="text-lg font-bold text-primary-600 dark:text-primary-400">
                  {exam.name}
                </span>
                <p className="mt-1 text-sm font-medium text-stone-900 dark:text-stone-100">
                  {exam.fullName}
                </p>
                <p className="mt-1 text-xs text-stone-500 dark:text-stone-400">
                  題庫共 {total} 題
                </p>
              </button>
            )
          })}
        </div>
      </section>

      {examType && (
        <section className="rounded-xl border border-stone-200 bg-white p-6 dark:border-stone-700 dark:bg-stone-800/50">
          <h2 className="text-sm font-semibold text-stone-700 dark:text-stone-300 mb-3">
            2. 選擇題目數量
          </h2>
          <div className="flex flex-wrap gap-3">
            {PRESET_COUNTS.map((n) => {
              const valid = n <= maxForExam
              const active = quantityMode === String(n)
              return (
                <button
                  key={n}
                  type="button"
                  disabled={!valid}
                  onClick={() => handleQuantityClick(String(n))}
                  className={`rounded-lg px-4 py-2 text-sm font-medium transition focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 dark:focus:ring-offset-stone-900 ${
                    active
                      ? 'bg-primary-600 text-white dark:bg-primary-500'
                      : valid
                        ? 'bg-stone-200 text-stone-700 hover:bg-stone-300 dark:bg-stone-700 dark:text-stone-300 dark:hover:bg-stone-600'
                        : 'bg-stone-100 text-stone-400 dark:bg-stone-800 dark:text-stone-500 cursor-not-allowed'
                  }`}
                >
                  {n} 題
                </button>
              )
            })}
            <div className="flex items-center gap-2">
              <span className="text-sm text-stone-600 dark:text-stone-400">自訂：</span>
              <input
                type="number"
                min={MIN_CUSTOM}
                max={effectiveMax}
                value={customCount}
                onChange={handleCustomChange}
                onFocus={() => setQuantityMode('custom')}
                className="w-24 rounded-lg border border-stone-300 bg-white px-3 py-2 text-sm text-stone-900 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 dark:border-stone-600 dark:bg-stone-800 dark:text-stone-100"
              />
              <span className="text-xs text-stone-500 dark:text-stone-400">
                {MIN_CUSTOM}–{effectiveMax} 題
              </span>
            </div>
          </div>
        </section>
      )}

      {canStart && (
        <div className="flex justify-center">
          <button
            type="button"
            onClick={handleStart}
            className="rounded-xl bg-primary-600 px-8 py-3 text-base font-medium text-white shadow-sm hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 dark:bg-primary-500 dark:hover:bg-primary-600"
          >
            開始挑戰（{count} 題）
          </button>
        </div>
      )}
    </div>
  )
}
