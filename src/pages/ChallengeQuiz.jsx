import { useMemo } from 'react'
import { useNavigate, useParams, useSearchParams } from 'react-router-dom'
import { Button } from '@astryxdesign/core/Button'
import { EmptyState } from '@astryxdesign/core/EmptyState'
import LoadingBlock, { LoadError } from '../components/LoadingBlock'
import PageLayout, { PAGE_FORM_WIDTH } from '../components/PageLayout'
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
      <PageLayout title="無效的考試類型" contentWidth={PAGE_FORM_WIDTH}>
        <EmptyState
          title="沒有這個考試"
          description="挑戰只接受 430 和 260。"
          headingLevel={2}
          actions={<Button label="返回挑戰選擇" href="/challenge" variant="primary" size="md" />}
        />
      </PageLayout>
    )
  }
  if (!saved && loading) {
    return (
      <PageLayout title="挑戰" contentWidth={PAGE_FORM_WIDTH}>
        <LoadingBlock />
      </PageLayout>
    )
  }
  if (error) {
    return (
      <PageLayout title="挑戰" contentWidth={PAGE_FORM_WIDTH}>
        <LoadError message={error.message} onRetry={reload} />
      </PageLayout>
    )
  }
  if (questions.length === 0) {
    return (
      <PageLayout title="暫無題目" contentWidth={PAGE_FORM_WIDTH}>
        <EmptyState
          title="這個考試暫時沒有題目"
          description="回到挑戰選擇，換一個考試再開始。"
          headingLevel={2}
          actions={<Button label="返回挑戰選擇" href="/challenge" variant="primary" size="md" />}
        />
      </PageLayout>
    )
  }

  return (
    <PageLayout title="挑戰" description="錯滿 5 題即結束，並先看那一題的解析。" contentWidth={PAGE_FORM_WIDTH}>
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
    </PageLayout>
  )
}
