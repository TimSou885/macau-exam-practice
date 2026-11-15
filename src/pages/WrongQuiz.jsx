import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@astryxdesign/core/Button'
import { Card } from '@astryxdesign/core/Card'
import { Heading } from '@astryxdesign/core/Heading'
import { Text } from '@astryxdesign/core/Text'
import { VStack } from '@astryxdesign/core/VStack'
import LoadingBlock, { LoadError } from '../components/LoadingBlock'
import QuizRunner from '../components/QuizRunner'
import { useQuestionsByIds } from '../hooks/useQuestions'
import { useReviewSchedule, useStats, useWrongAnswers } from '../hooks/useStorage'
import { loadSession } from '../utils/sessionStore'
import { shuffle } from '../utils/shuffle'

export default function WrongQuiz() {
  const navigate = useNavigate()
  const { wrongIds, removeWrong } = useWrongAnswers()
  const { recordReviewResult } = useReviewSchedule()
  const { recordAnswer } = useStats()
  const [frozenIds] = useState(wrongIds)
  const sessionKey = `wrong:${[...frozenIds].sort().join('|')}`
  const saved = useMemo(() => loadSession(sessionKey), [sessionKey])
  const { questions: loaded, loading, error, reload } = useQuestionsByIds(saved ? [] : frozenIds)
  const shuffled = useStableShuffle(loaded)
  const questions = saved?.questions ?? shuffled

  if (frozenIds.length === 0 && !saved) {
    return (
      <VStack gap={3}>
        <Heading level={1}>目前沒有錯題可複習</Heading>
        <Button label="返回錯題本" href="/wrong" variant="primary" />
      </VStack>
    )
  }
  if (!saved && loading) return <LoadingBlock />
  if (error) return <LoadError message={error.message} onRetry={reload} />
  if (questions.length === 0) {
    return (
      <VStack gap={3}>
        <Heading level={1}>目前沒有錯題可複習</Heading>
        <Button label="返回錯題本" href="/wrong" variant="primary" />
      </VStack>
    )
  }

  return (
    <QuizRunner
      sessionKey={sessionKey}
      href="/wrong/quiz"
      questions={questions}
      restored={saved}
      mode="tutor"
      onVerified={(question, result) => {
        recordAnswer(question.examType || '430', result.correct)
        recordReviewResult(question.id, result.correct)
        if (result.correct) removeWrong(question.id)
      }}
      resultNote={(_question, revealed, selectedKey) => {
        if (!revealed || !selectedKey) return null
        return selectedKey === revealed.correctKey
          ? '答對了，這題已移出錯題本，間隔複習已往後排。'
          : '還在錯題本裡，間隔已回到 1 天後。'
      }}
      onFinish={(answers) => {
        navigate('/wrong', {
          state: {
            reviewed: answers.length,
            correct: answers.filter((answer) => answer.correct).length,
          },
        })
      }}
      onQuit={() => navigate('/wrong')}
    />
  )
}

function useStableShuffle(list) {
  const key = list.map((item) => item.id).join('|')
  return useMemo(() => (list.length ? shuffle(list) : []), [key])
}
