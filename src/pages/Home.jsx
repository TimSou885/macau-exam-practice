import { useMemo } from 'react'
import { useLocation } from 'react-router-dom'
import { Badge } from '@astryxdesign/core/Badge'
import { ClickableCard } from '@astryxdesign/core/ClickableCard'
import { Grid } from '@astryxdesign/core/Grid'
import { Heading } from '@astryxdesign/core/Heading'
import { HStack } from '@astryxdesign/core/HStack'
import { Text } from '@astryxdesign/core/Text'
import { VStack } from '@astryxdesign/core/VStack'
import PageLayout from '../components/PageLayout'
import { useReviewSchedule, useStats, useWrongAnswers } from '../hooks/useStorage'
import { loadAnySession } from '../utils/sessionStore'

const ACTIONS = [
  {
    href: '/exam',
    label: '開始練習',
    title: '開始練習',
    detail: '選 430 或 260，再選類別和這一輪的題數。',
  },
  {
    href: '/challenge',
    label: '挑戰模式',
    title: '挑戰模式',
    detail: '全類別隨機，最多 100 題。錯 5 題即失敗，失敗前可以先看那一題的解析。',
  },
  {
    href: '/review',
    label: '間隔複習',
    title: '間隔複習',
    detail: '答錯後隔 1、3、7、15、30 天再出現。',
  },
  {
    href: '/wrong',
    label: '錯題本',
    title: '錯題本',
    detail: '答題複習答對後會移出。',
  },
]

export default function Home() {
  const location = useLocation()
  const { stats } = useStats()
  const { wrongIds } = useWrongAnswers()
  const { dueIds } = useReviewSchedule()
  const session = useMemo(() => loadAnySession(), [location.key])
  const answered = stats.totalAnswered ?? 0
  const rate = answered > 0 ? Math.round((stats.totalCorrect / answered) * 100) : null

  return (
    <PageLayout
      title="澳門政府統考練習"
      description="430 學士學位程度綜合能力評估，以及 260 技術員程度綜合能力評估。選一小輪題目練習，答錯的會進錯題本。"
    >
      <HStack gap={2} wrap="wrap" align="center">
        <Badge variant="neutral" label={`已作答 ${answered} 題`} />
        {rate != null ? <Badge variant="neutral" label={`正確率 ${rate}%`} /> : null}
        <Badge variant={dueIds.length ? 'warning' : 'neutral'} label={`今日待複習 ${dueIds.length}`} />
        <Badge variant="neutral" label={`錯題 ${wrongIds.length}`} />
      </HStack>

      {session ? (
        <ClickableCard href={session.href} label="繼續未完成的練習" elevation="low">
          <VStack gap={1}>
            <Heading level={3}>繼續未完成的練習</Heading>
            <Text type="supporting">
              第 {session.index + 1} / {session.questions.length} 題
            </Text>
          </VStack>
        </ClickableCard>
      ) : null}

      <Grid columns={{ minWidth: 280, max: 2 }} gap={4}>
        {ACTIONS.map((action) => (
          <ClickableCard key={action.href} href={action.href} label={action.label} elevation="low">
            <VStack gap={2}>
              <Heading level={3}>
                {action.title}
                {action.href === '/review' ? `（${dueIds.length}）` : null}
                {action.href === '/wrong' ? `（${wrongIds.length}）` : null}
              </Heading>
              <Text type="supporting">{action.detail}</Text>
            </VStack>
          </ClickableCard>
        ))}
      </Grid>

      <VStack gap={2}>
        <Heading level={2}>考試說明</Heading>
        <Text>430 統考：學士學位程度，筆試約 58 題、1.5 小時，50 分合格。</Text>
        <Text>260 統考：技術員程度，題型涵蓋邏輯、語文、數學與常識。</Text>
        <Text>題型包含法律、數學、圖表分析、推理邏輯、閱讀理解。</Text>
        <Text type="supporting">正式開考資訊請以公職局網站為準。本站不是官方網站。</Text>
      </VStack>
    </PageLayout>
  )
}
