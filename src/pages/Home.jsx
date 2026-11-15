import { useMemo } from 'react'
import { useLocation } from 'react-router-dom'
import { Heading } from '@astryxdesign/core/Heading'
import { Icon } from '@astryxdesign/core/Icon'
import { List, ListItem } from '@astryxdesign/core/List'
import { Text } from '@astryxdesign/core/Text'
import { VStack } from '@astryxdesign/core/VStack'
import PageLayout from '../components/PageLayout'
import { useReviewSchedule, useStats, useWrongAnswers } from '../hooks/useStorage'
import { loadAnySession } from '../utils/sessionStore'

export default function Home() {
  const location = useLocation()
  const { stats } = useStats()
  const { wrongIds } = useWrongAnswers()
  const { dueIds } = useReviewSchedule()
  const session = useMemo(() => loadAnySession(), [location.key])
  const answered = stats.totalAnswered ?? 0
  const rate = answered > 0 ? Math.round((stats.totalCorrect / answered) * 100) : null
  const chevron = <Icon icon="chevronRight" />

  return (
    <PageLayout>
      <VStack gap={1}>
        <Heading level={1}>澳門政府統考練習</Heading>
        <Text type="supporting">430 與 260 統考。選一項開始。</Text>
        {answered > 0 ? (
          <Text type="supporting">
            已作答 {answered} 題，正確率 {rate}%。
          </Text>
        ) : null}
      </VStack>

      <List edge="flush" aria-label="練習入口">
        {session ? (
          <ListItem
            href={session.href}
            label="繼續未完成的練習"
            description={`第 ${session.index + 1} / ${session.questions.length} 題`}
            endContent={chevron}
          />
        ) : null}
        <ListItem
          href="/exam"
          label="開始練習"
          description="選 430 或 260，再選類別和題數。"
          endContent={chevron}
        />
        <ListItem
          href="/challenge"
          label="挑戰模式"
          description="全類別隨機，錯 5 題即失敗。"
          endContent={chevron}
        />
        <ListItem
          href="/review"
          label="間隔複習"
          description={
            dueIds.length > 0 ? `今天有 ${dueIds.length} 題到期。` : '答錯後隔 1、3、7、15、30 天再出現。'
          }
          endContent={chevron}
        />
        <ListItem
          href="/wrong"
          label="錯題本"
          description={wrongIds.length > 0 ? `目前 ${wrongIds.length} 題。` : '答對後會移出。'}
          endContent={chevron}
        />
      </List>
    </PageLayout>
  )
}
