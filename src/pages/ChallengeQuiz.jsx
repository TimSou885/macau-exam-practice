import { useState, useMemo } from 'react'
import { useParams, useSearchParams, useNavigate } from 'react-router-dom'
import { getQuestionsByExam } from '../data'
import { useWrongAnswers, useReviewSchedule } from '../hooks/useStorage'
import QuestionCard from '../components/QuestionCard'

const FAIL_THRESHOLD = 5

function shuffle(arr) {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

// #region agent log
const _logCq = (location, message, data, hypothesisId) => {
  fetch('http://127.0.0.1:7242/ingest/f2b3e46d-a0cf-4e75-83a0-2f3b42951dae', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ location, message, data: { ...data }, timestamp: Date.now(), sessionId: 'debug-session', hypothesisId }) }).catch(() => {});
};
// #endregion

export default function ChallengeQuiz() {
  // #region agent log
  _logCq('ChallengeQuiz.jsx:entry', 'ChallengeQuiz mount start', {}, 'D');
  // #endregion
  const { examType } = useParams()
  const [searchParams] = useSearchParams()
  const countParam = Math.max(1, parseInt(searchParams.get('count'), 10) || 50)
  const navigate = useNavigate()

  const { addWrong } = useWrongAnswers()
  const { addToReview } = useReviewSchedule()
  // #region agent log
  _logCq('ChallengeQuiz.jsx:afterHooks', 'ChallengeQuiz after hooks', { examType, countParam }, 'D');
  // #endregion

  const questions = useMemo(() => {
    const list = getQuestionsByExam(examType)
    if (!list.length) return []
    const shuffled = shuffle(list)
    return shuffled.slice(0, Math.min(countParam, list.length))
  }, [examType, countParam])

  const [currentIndex, setCurrentIndex] = useState(0)
  const [selectedKey, setSelectedKey] = useState(null)
  const [showResult, setShowResult] = useState(false)
  const [wrongCount, setWrongCount] = useState(0)
  const [answers, setAnswers] = useState([])

  const current = questions[currentIndex]
  const isLast = currentIndex === questions.length - 1

  const handleSubmit = () => {
    if (selectedKey == null || !current) return
    const correct = selectedKey === current.correctKey
    if (!correct) {
      addWrong(current.id)
      addToReview(current.id)
      const nextWrong = wrongCount + 1
      setWrongCount(nextWrong)
      setAnswers((prev) => [...prev, { questionId: current.id, correct, selectedKey }])
      setShowResult(true)
      if (nextWrong >= FAIL_THRESHOLD) {
        navigate('/challenge/result', {
          state: {
            success: false,
            total: questions.length,
            wrongCount: nextWrong,
            answeredCount: currentIndex + 1,
            examType,
          },
        })
        return
      }
    } else {
      setAnswers((prev) => [...prev, { questionId: current.id, correct, selectedKey }])
      setShowResult(true)
    }
  }

  const handleNext = () => {
    if (isLast) {
      const totalCorrect = answers.filter((a) => a.correct).length + (selectedKey === current?.correctKey ? 1 : 0)
      navigate('/challenge/result', {
        state: {
          success: totalCorrect === questions.length,
          total: questions.length,
          wrongCount,
          answeredCount: questions.length,
          examType,
        },
      })
      return
    }
    setCurrentIndex((i) => i + 1)
    setSelectedKey(null)
    setShowResult(false)
  }

  const handleEndChallenge = () => {
    navigate('/challenge/result', {
      state: {
        success: false,
        total: questions.length,
        wrongCount,
        answeredCount: currentIndex + (showResult ? 1 : 0),
        examType,
        quitEarly: true,
      },
    })
  }

  if (examType !== '430' && examType !== '260') {
    return (
      <div className="text-center py-12">
        <p className="text-stone-600 dark:text-stone-400">無效的考試類型。</p>
        <button
          type="button"
          onClick={() => navigate('/challenge')}
          className="mt-4 text-primary-600 dark:text-primary-400 underline"
        >
          返回挑戰選擇
        </button>
      </div>
    )
  }

  if (questions.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-stone-600 dark:text-stone-400">暫無題目。</p>
        <button
          type="button"
          onClick={() => navigate('/challenge')}
          className="mt-4 text-primary-600 dark:text-primary-400 underline"
        >
          返回挑戰選擇
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-2 text-sm text-stone-500 dark:text-stone-400">
        <span>
          第 {currentIndex + 1} / {questions.length} 題
          <span className="ml-2 sm:ml-3 text-amber-600 dark:text-amber-400">
            已錯 {wrongCount} / {FAIL_THRESHOLD}
          </span>
        </span>
        <button
          type="button"
          onClick={handleEndChallenge}
          className="rounded-lg px-4 py-2.5 min-h-[44px] hover:bg-stone-100 dark:hover:bg-stone-800 focus:outline-none focus:ring-2 focus:ring-primary-500"
        >
          結束挑戰
        </button>
      </div>

      <QuestionCard
        question={current}
        selectedKey={selectedKey}
        onSelect={setSelectedKey}
        showResult={showResult}
        disabled={showResult}
      />

      {!showResult ? (
        <button
          type="button"
          onClick={handleSubmit}
          disabled={selectedKey == null}
          className="w-full rounded-xl bg-primary-600 py-3.5 sm:py-3 text-base font-medium text-white shadow-sm hover:bg-primary-700 disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 dark:bg-primary-500 dark:hover:bg-primary-600 min-h-[48px] sm:min-h-[44px]"
        >
          提交答案
        </button>
      ) : (
        <button
          type="button"
          onClick={handleNext}
          className="w-full rounded-xl bg-primary-600 py-3.5 sm:py-3 text-base font-medium text-white shadow-sm hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 dark:bg-primary-500 dark:hover:bg-primary-600 min-h-[48px] sm:min-h-[44px]"
        >
          {isLast ? '查看結果' : '下一題'}
        </button>
      )}
    </div>
  )
}
