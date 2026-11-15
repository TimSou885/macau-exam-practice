import { useMemo } from 'react'
import { useLocation } from 'react-router-dom'
import { Card } from '@astryxdesign/core/Card'
import { ClickableCard } from '@astryxdesign/core/ClickableCard'
import { Grid } from '@astryxdesign/core/Grid'
import { Heading } from '@astryxdesign/core/Heading'
import { Text } from '@astryxdesign/core/Text'
import { VStack } from '@astryxdesign/core/VStack'
import PageLayout from '../components/PageLayout'
import { useReviewSchedule, useStats, useWrongAnswers } from '../hooks/useStorage'
import { loadAnySession } from '../utils/sessionStore'

const ACTIONS = [
  {
    href: '/exam',
    label: '開始練習',
    kicker: '開始練習',
    title: '選擇考試類型',
    detail: '選擇 430 或 260 統考，依類別或全科練習。',
    variant: 'green',
  },
  {
    href: '/challenge',
    label: '挑戰模式',
    kicker: '挑戰模式',
    title: '最多 100 題',
    detail: '全類別隨機。錯 5 題即失敗，失敗前可以先看那一題的解析。',
    variant: 'yellow',
  },
  {
    href: '/review',
    label: '間隔複習',
    kicker: '遺忘曲線複習',
    title: '間隔複習',
    detail: '答錯後隔 1、3、7、15、30 天再出現。',
    variant: 'teal',
  },
  {
    href: '/wrong',
    label: '錯題本',
    kicker: '複習錯題',
    title: '錯題本',
    detail: '集中複習答錯的題目。答對後會移出。',
    variant: 'gray',
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
    <PageLayout>
      <VStack gap={2} className="home-hero">
        <Heading level={1}>澳門政府統考練習</Heading>
        <Text type="supporting">
          430 學士學位程度綜合能力評估 · 260 技術員程度綜合能力評估。選一小輪題目練習，答錯的會進錯題本。
        </Text>
        {answered > 0 ? (
          <Text type="supporting">
            這台裝置已作答 {answered} 題，正確率 {rate}%。
          </Text>
        ) : null}
      </VStack>

      {session ? (
        <ClickableCard href={session.href} label="繼續未完成的練習" variant="green">
          <VStack gap={1}>
            <Text type="label">繼續未完成的練習</Text>
            <Heading level={3}>
              第 {session.index + 1} / {session.questions.length} 題
            </Heading>
          </VStack>
        </ClickableCard>
      ) : null}

      <Grid columns={{ minWidth: 260, max: 2 }} gap={4}>
        {ACTIONS.map((action) => (
          <ClickableCard key={action.href} href={action.href} label={action.label} variant={action.variant}>
            <VStack gap={1}>
              <Text type="label">{action.kicker}</Text>
              <Heading level={3}>
                {action.title}
                {action.href === '/review' && dueIds.length > 0 ? ` · ${dueIds.length} 題到期` : null}
                {action.href === '/wrong' && wrongIds.length > 0 ? ` · ${wrongIds.length} 題` : null}
              </Heading>
              <Text type="supporting">{action.detail}</Text>
            </VStack>
          </ClickableCard>
        ))}
      </Grid>

      <Card padding={4} variant="muted">
        <VStack gap={1}>
          <Text type="label">考試說明</Text>
          <Text type="supporting">430 統考：學士學位程度，筆試約 58 題、1.5 小時，50 分合格。</Text>
          <Text type="supporting">260 統考：技術員程度，題型涵蓋邏輯、語文、數學與常識。</Text>
          <Text type="supporting">題型包含法律、數學、圖表分析、推理邏輯、閱讀理解。</Text>
          <Text type="supporting">正式開考資訊請以公職局網站為準。本站不是官方網站。</Text>
        </VStack>
      </Card>
    </PageLayout>
  )
}
