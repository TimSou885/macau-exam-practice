import { useMemo } from 'react'
import { useLocation } from 'react-router-dom'
import { Badge } from '@astryxdesign/core/Badge'
import { Card } from '@astryxdesign/core/Card'
import { ClickableCard } from '@astryxdesign/core/ClickableCard'
import { Heading } from '@astryxdesign/core/Heading'
import { HStack } from '@astryxdesign/core/HStack'
import { Text } from '@astryxdesign/core/Text'
import { VStack } from '@astryxdesign/core/VStack'
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

  return (
    <VStack gap={6}>
      <VStack gap={2}>
        <Heading level={1}>澳門政府統考練習</Heading>
        <Text type="large">
          430 學士學位程度綜合能力評估，以及 260 技術員程度綜合能力評估。選一小輪題目練習，答錯的會進錯題本。
        </Text>
      </VStack>

      {(session || dueIds.length > 0 || wrongIds.length > 0) && (
        <HStack gap={3} wrap="wrap">
          {session && (
            <ClickableCard href={session.href} label="繼續未完成的練習" variant="green">
              <VStack gap={1}>
                <Text type="label">繼續未完成的練習</Text>
                <Text type="supporting">
                  第 {session.index + 1} / {session.questions.length} 題
                </Text>
              </VStack>
            </ClickableCard>
          )}
          <Card padding={4}>
            <VStack gap={1}>
              <Text type="label">這台裝置的練習紀錄</Text>
              <Text>
                已作答 {answered} 題
                {rate != null ? `，正確率 ${rate}%` : ''}
              </Text>
              <HStack gap={2} wrap="wrap">
                <Badge variant={dueIds.length ? 'warning' : 'neutral'} label={`今日待複習 ${dueIds.length}`} />
                <Badge variant="neutral" label={`錯題 ${wrongIds.length}`} />
              </HStack>
            </VStack>
          </Card>
        </HStack>
      )}

      <HStack gap={3} wrap="wrap" align="stretch">
        <ClickableCard href="/exam" label="開始練習" variant="green">
          <VStack gap={1}>
            <Text type="label">開始練習</Text>
            <Heading level={3}>選擇考試類型</Heading>
            <Text type="supporting">430 或 260，再選類別和這一輪的題數。</Text>
          </VStack>
        </ClickableCard>
        <ClickableCard href="/challenge" label="挑戰模式" variant="yellow">
          <VStack gap={1}>
            <Text type="label">挑戰模式</Text>
            <Heading level={3}>最多 100 題</Heading>
            <Text type="supporting">全類別隨機。錯 5 題即失敗，失敗前可以先看那一題的解析。</Text>
          </VStack>
        </ClickableCard>
        <ClickableCard href="/review" label="間隔複習" variant="teal">
          <VStack gap={1}>
            <Text type="label">遺忘曲線複習</Text>
            <Heading level={3}>間隔複習</Heading>
            <Text type="supporting">
              答錯後隔 1、3、7、15、30 天再出現。今天有 {dueIds.length} 題到期。
            </Text>
          </VStack>
        </ClickableCard>
        <ClickableCard href="/wrong" label="錯題本" variant="gray">
          <VStack gap={1}>
            <Text type="label">複習錯題</Text>
            <Heading level={3}>錯題本</Heading>
            <Text type="supporting">目前 {wrongIds.length} 題。答題複習答對後會移出。</Text>
          </VStack>
        </ClickableCard>
      </HStack>

      <Card padding={4} variant="muted">
        <VStack gap={2}>
          <Heading level={2}>考試說明</Heading>
          <Text>430 統考：學士學位程度，筆試約 58 題、1.5 小時，50 分合格。</Text>
          <Text>260 統考：技術員程度，題型涵蓋邏輯、語文、數學與常識。</Text>
          <Text>題型包含法律、數學、圖表分析、推理邏輯、閱讀理解。</Text>
          <Text type="supporting">正式開考資訊請以公職局網站為準。本站不是官方網站。</Text>
        </VStack>
      </Card>
    </VStack>
  )
}
