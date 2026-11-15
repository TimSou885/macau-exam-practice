import { useMemo } from 'react'
import { useNavigate, useParams, useSearchParams } from 'react-router-dom'
import { Button } from '@astryxdesign/core/Button'
import { Heading } from '@astryxdesign/core/Heading'
import { VStack } from '@astryxdesign/core/VStack'
import LoadingBlock, { LoadError } from '../components/LoadingBlock'
import QuizRunner from '../components/QuizRunner'
import { useQuestionsList } from '../hooks/useQuestions'
import { useReviewSchedule, useStats, useWrongAnswers } from '../hooks/useStorage'
import { clampSessionLimit } from '../utils/questionLimit'
import { loadSession, saveLastResult } from '../utils/sessionStore'

const FAIL_THRESHOLD = 5

export default function ChallengeQuiz() {
  const { examType } = useParams()
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const count = clampSessionLimit(searchParams.get('count')) ?? 20
  const validExam = examType === '430' || examType === '260'
  const sessionKey = `challenge:${examType}:${count}`
  const href = `/challenge/${examType}?count=${count}`
  const saved = useMemo(() => (validExam ? loadSession(sessionKey) : null), [sessionKey, validExam])
  const { questions: loaded, loading, error, reload } = useQuestionsList(validExam ? examType : '', 'all', {
    limit: count,
    enabled: validExam && !saved,
  })
  const { addWrong } = useWrongAnswers()
  const { addToReview } = useReviewSchedule()
  const { recordAnswer } = useStats()
  const questions = saved?.questions ?? loaded

  if (!validExam) {
    return (
      <VStack gap={3}>
        <Heading level={1}>無效的考試類型</Heading>
        <Button label="返回挑戰選擇" href="/challenge" variant="primary" />
      </VStack>
    )
  }
  if (!saved && loading) return <LoadingBlock />
  if (error) return <LoadError message={error.message} onRetry={reload} />
  if (questions.length === 0) {
    return (
      <VStack gap={3}>
        <Heading level={1}>暫無題目</Heading>
        <Button label="返回挑戰選擇" href="/challenge" variant="primary" />
      </VStack>
    )
  }

  return (
    <QuizRunner
      sessionKey={sessionKey}
      href={href}
      questions={questions}
      restored={saved}
      mode="tutor"
      failThreshold={FAIL_THRESHOLD}
      onVerified={(question, result) => {
        recordAnswer(examType, result.correct)
        if (!result.correct) {
          addWrong(question.id, { category: question.category, examType })
          addToReview(question.id, { category: question.category, examType })
        }
      }}
      onFinish={(answers) => {
        const wrongCount = answers.filter((answer) => !answer.correct).length
        const state = {
          success: wrongCount === 0 && answers.length === questions.length,
          total: questions.length,
          wrongCount,
          answeredCount: answers.length,
          examType,
          quitEarly: answers.length < questions.length && wrongCount < FAIL_THRESHOLD,
        }
        saveLastResult({ ...state, total: answers.length || state.total, kind: 'challenge' })
        navigate('/challenge/result', { state })
      }}
      onQuit={() => navigate('/challenge')}
    />
  )
}
