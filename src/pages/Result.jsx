import { useLocation } from 'react-router-dom'
import { Button } from '@astryxdesign/core/Button'
import { Card } from '@astryxdesign/core/Card'
import { Heading } from '@astryxdesign/core/Heading'
import { HStack } from '@astryxdesign/core/HStack'
import { Text } from '@astryxdesign/core/Text'
import { VStack } from '@astryxdesign/core/VStack'
import PageLayout from '../components/PageLayout'
import QuestionView from '../components/QuestionView'
import { EXAM_TYPES, categoryName } from '../data'
import { loadLastResult } from '../utils/sessionStore'
import { practiceScoreSummary } from '../utils/scoreCopy'

export default function Result() {
  const location = useLocation()
  const state = location.state?.total ? location.state : loadLastResult()
  const { total = 0, correct = 0, examType, category, mode, misses = [] } = state || {}
  const summary = practiceScoreSummary({ correct, total })
  const meta = examType ? EXAM_TYPES[examType] : null
  const again = examType
    ? `/quiz/${examType}?category=${category || 'all'}&count=${state?.count || 20}&mode=${mode || 'tutor'}&timed=0`
    : '/exam'

  return (
    <PageLayout title="練習結果">
      {total === 0 ? (
        <Text>尚無作答紀錄。完成一輪練習後，這一頁會留下正確率和錯題。</Text>
      ) : (
        <Card padding={5}>
          <VStack gap={2} align="center">
            <Heading level={2} type="display-2">
              {summary.score} 分
            </Heading>
            <Text>答對 {correct} / {total} 題</Text>
            <Text weight="semibold">{summary.headline}</Text>
            <Text type="supporting">{summary.detail}</Text>
            {meta && (
              <Text type="supporting">
                {meta.name} · {categoryName(category)}
                {mode === 'exam' ? ' · 做完再對' : ' · 邊做邊對'}
              </Text>
            )}
          </VStack>
        </Card>
      )}

      {misses.length > 0 && (
        <VStack gap={4}>
          <Heading level={2}>這一輪答錯的題</Heading>
          {misses.map((miss) => (
            <Card key={miss.questionId} padding={4}>
              <QuestionView
                question={{
                  id: miss.questionId,
                  category: miss.category,
                  question: miss.question,
                  options: miss.options,
                  correctKey: miss.correctKey,
                  explanation: miss.explanation,
                }}
                selectedKey={miss.selectedKey}
                showResult
                disabled
                onSelect={() => {}}
              />
            </Card>
          ))}
        </VStack>
      )}

      <HStack gap={2} wrap="wrap">
        {examType && <Button label="再練一輪" variant="primary" href={again} />}
        <Button label="選擇其他考試" variant="secondary" href="/exam" />
        <Button label="錯題本" variant="secondary" href="/wrong" />
      </HStack>
    </PageLayout>
  )
}
