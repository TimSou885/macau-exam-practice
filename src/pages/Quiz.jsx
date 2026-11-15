import { useMemo } from 'react'
import { useNavigate, useParams, useSearchParams } from 'react-router-dom'
import { Heading } from '@astryxdesign/core/Heading'
import { VStack } from '@astryxdesign/core/VStack'
import { Button } from '@astryxdesign/core/Button'
import LoadingBlock, { LoadError } from '../components/LoadingBlock'
import QuizRunner from '../components/QuizRunner'
import { useQuestionsList } from '../hooks/useQuestions'
import { useReviewSchedule, useStats, useWrongAnswers } from '../hooks/useStorage'
import { clampSessionLimit } from '../utils/questionLimit'
import { loadSession, saveLastResult } from '../utils/sessionStore'

export default function Quiz() {
  const { examType } = useParams()
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const category = searchParams.get('category') || 'all'
  const count = clampSessionLimit(searchParams.get('count')) ?? 20
  const mode = searchParams.get('mode') === 'exam' ? 'exam' : 'tutor'
  const timed = searchParams.get('timed') === '1'
  const sessionKey = `quiz:${examType}:${category}:${count}:${mode}:${timed ? '1' : '0'}`
  const href = `/quiz/${examType}?${searchParams.toString()}`
  const saved = useMemo(() => loadSession(sessionKey), [sessionKey])
  const { questions: loaded, loading, error, reload } = useQuestionsList(examType, category, {
    limit: count,
    enabled: !saved,
  })
  const { addWrong } = useWrongAnswers()
  const { addToReview } = useReviewSchedule()
  const { recordAnswer } = useStats()
  const questions = saved?.questions ?? loaded
  const minutes = Math.max(5, Math.round((questions.length || count) * 90 / 58))

  if (!saved && loading) return <LoadingBlock />
  if (error) return <LoadError message={error.message} onRetry={reload} />
  if (questions.length === 0) {
    return (
      <VStack gap={3}>
        <Heading level={1}>暫無題目</Heading>
        <Button label="返回練習選擇" href={`/practice/${examType}`} variant="primary" />
      </VStack>
    )
  }

  return (
    <QuizRunner
      sessionKey={sessionKey}
      href={href}
      questions={questions}
      restored={saved}
      mode={mode}
      durationSec={timed ? minutes * 60 : 0}
      onVerified={(question, result) => {
        recordAnswer(examType, result.correct)
        if (!result.correct) {
          addWrong(question.id, { category: question.category, examType })
          addToReview(question.id, { category: question.category, examType })
        }
      }}
      onFinish={(answers) => {
        const result = buildResult({ answers, examType, category, mode, count })
        saveLastResult(result)
        navigate('/result', { state: result })
      }}
      onQuit={() => navigate(`/practice/${examType}?category=${category}`)}
    />
  )
}

export function buildResult({ answers, examType, category, mode, count }) {
  const correct = answers.filter((answer) => answer.correct).length
  return {
    total: answers.length,
    correct,
    examType,
    category,
    mode,
    count,
    misses: answers.filter((answer) => !answer.correct),
  }
}
