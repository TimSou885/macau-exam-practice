import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@astryxdesign/core/Button'
import { EmptyState } from '@astryxdesign/core/EmptyState'
import LoadingBlock, { LoadError } from '../components/LoadingBlock'
import PageLayout, { PAGE_FORM_WIDTH } from '../components/PageLayout'
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

  if (!saved && loading) {
    return (
      <PageLayout title="間隔複習" contentWidth={PAGE_FORM_WIDTH}>
        <LoadingBlock />
      </PageLayout>
    )
  }
  if (error) {
    return (
      <PageLayout title="間隔複習" contentWidth={PAGE_FORM_WIDTH}>
        <LoadError message={error.message} onRetry={reload} />
      </PageLayout>
    )
  }
  if (questions.length === 0) {
    return (
      <PageLayout title="目前沒有待複習題目" contentWidth={PAGE_FORM_WIDTH}>
        <EmptyState
          title="今天沒有到期題目"
          description="答錯的題目會按間隔再出現。可以先回複習頁看下次日期。"
          headingLevel={2}
          actions={<Button label="返回遺忘曲線複習" href="/review" variant="primary" size="md" />}
        />
      </PageLayout>
    )
  }

  return (
    <PageLayout title="間隔複習" contentWidth={PAGE_FORM_WIDTH}>
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
    </PageLayout>
  )
}

function useStableShuffle(list) {
  const key = list.map((item) => item.id).join('|')
  return useMemo(() => (list.length ? shuffle(list) : []), [key])
}
