import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@astryxdesign/core/Button'
import { Heading } from '@astryxdesign/core/Heading'
import { VStack } from '@astryxdesign/core/VStack'
import LoadingBlock, { LoadError } from '../components/LoadingBlock'
import QuizRunner from '../components/QuizRunner'
import { useQuestionsByIds } from '../hooks/useQuestions'
import { useReviewSchedule, useStats } from '../hooks/useStorage'
import { loadSession } from '../utils/sessionStore'
import { shuffle } from '../utils/shuffle'

export default function ReviewQuiz() {
  const navigate = useNavigate()
  const { dueIds, recordReviewResult } = useReviewSchedule()
  const [frozenIds] = useState(dueIds)
  const sessionKey = `review:${[...frozenIds].sort().join('|')}`
  const saved = useMemo(() => loadSession(sessionKey), [sessionKey])
  const { questions: loaded, loading, error, reload } = useQuestionsByIds(saved ? [] : frozenIds)
  const { recordAnswer } = useStats()
  const shuffled = useStableShuffle(loaded)
  const questions = saved?.questions ?? shuffled

  if (!saved && loading) return <LoadingBlock />
  if (error) return <LoadError message={error.message} onRetry={reload} />
  if (questions.length === 0) {
    return (
      <VStack gap={3}>
        <Heading level={1}>目前沒有待複習題目</Heading>
        <Button label="返回遺忘曲線複習" href="/review" variant="primary" />
      </VStack>
    )
  }

  return (
    <QuizRunner
      sessionKey={sessionKey}
      href="/review/session"
      questions={questions}
      restored={saved}
      mode="tutor"
      onVerified={(question, result) => {
        recordReviewResult(question.id, result.correct)
        recordAnswer(question.examType || '430', result.correct)
      }}
      resultNote={(_question, _revealed, selectedKey) =>
        selectedKey ? '間隔已按這一題的對錯更新。' : null
      }
      onFinish={(answers) => {
        navigate('/review', {
          state: {
            reviewed: answers.length,
            correct: answers.filter((answer) => answer.correct).length,
          },
        })
      }}
      onQuit={() => navigate('/review')}
    />
  )
}

function useStableShuffle(list) {
  const key = list.map((item) => item.id).join('|')
  return useMemo(() => (list.length ? shuffle(list) : []), [key])
}
