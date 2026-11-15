import { useState } from 'react'
import { useLocation } from 'react-router-dom'
import { AlertDialog } from '@astryxdesign/core/AlertDialog'
import { EmptyState } from '@astryxdesign/core/EmptyState'
import { Badge } from '@astryxdesign/core/Badge'
import { Banner } from '@astryxdesign/core/Banner'
import { Button } from '@astryxdesign/core/Button'
import { Card } from '@astryxdesign/core/Card'
import { Heading } from '@astryxdesign/core/Heading'
import { HStack } from '@astryxdesign/core/HStack'
import { Text } from '@astryxdesign/core/Text'
import { VStack } from '@astryxdesign/core/VStack'
import PageLayout from '../components/PageLayout'
import { categoryName } from '../data'
import { useReviewSchedule } from '../hooks/useStorage'
import { formatMacau } from '../utils/formatWhen'

export default function SpacedReview() {
  const location = useLocation()
  const { dueIds, schedule, clearReview } = useReviewSchedule()
  const [confirmClear, setConfirmClear] = useState(false)
  const totalScheduled = Object.keys(schedule).length
  const dueCount = dueIds.length
  const upcoming = Object.entries(schedule)
    .map(([id, entry]) => ({ id, ...entry }))
    .filter((entry) => entry.nextReviewAt)
    .sort((a, b) => a.nextReviewAt - b.nextReviewAt)
    .slice(0, 8)
  const nextFuture = upcoming.find((entry) => !dueIds.includes(entry.id))
  const flash = location.state?.reviewed
    ? `剛完成 ${location.state.reviewed} 題，答對 ${location.state.correct} 題。答對的間隔已往後排。`
    : null

  return (
    <PageLayout
      title="遺忘曲線複習"
      description="答錯的題目會在 1、3、7、15、30 天後再出現。複習再答錯，就從 1 天後重來。"
    >
      {flash && <Banner status="success" title="複習完成" description={flash} collapsible={false} />}
      <Card padding={4}>
        <VStack gap={3}>
          <Heading level={2}>今日待複習</Heading>
          {totalScheduled === 0 && (
            <EmptyState
              isCompact
              title="尚無排程"
              description="答錯的題目會自動排進來。"
              headingLevel={3}
            />
          )}
          {totalScheduled > 0 && dueCount === 0 && (
            <Text>
              目前沒有到期題目，共 {totalScheduled} 題在排程中。
              {nextFuture ? `下一題在 ${formatMacau(nextFuture.nextReviewAt)}。` : ''}
            </Text>
          )}
          {dueCount > 0 && (
            <Text>
              共 {dueCount} 題待複習
              {totalScheduled > dueCount ? `（排程中共 ${totalScheduled} 題）` : ''}
            </Text>
          )}
          {dueCount > 0 && (
            <HStack>
              <Button label={`開始複習（${dueCount} 題）`} variant="primary" size="md" href="/review/session" />
            </HStack>
          )}
        </VStack>
      </Card>
      {upcoming.length > 0 && (
        <VStack gap={2}>
          <Heading level={2}>最近的排程</Heading>
          {upcoming.map((entry) => (
            <Card key={entry.id} padding={3}>
              <VStack gap={1}>
                <Text>
                  {categoryName(entry.category)} · 第 {(entry.stage ?? 0) + 1} 階段
                </Text>
                <Badge
                  variant={dueIds.includes(entry.id) ? 'warning' : 'neutral'}
                  label={dueIds.includes(entry.id) ? '今天可以複習' : formatMacau(entry.nextReviewAt)}
                />
              </VStack>
            </Card>
          ))}
        </VStack>
      )}
      {totalScheduled > 0 && (
        <HStack>
          <Button label="清空複習排程" variant="secondary" size="md" onClick={() => setConfirmClear(true)} />
        </HStack>
      )}
      <AlertDialog
        isOpen={confirmClear}
        onOpenChange={setConfirmClear}
        title="清空所有複習排程？"
        description="錯題本不會受影響。已安排的複習日期會消失，不能復原。"
        cancelLabel="保留排程"
        actionLabel="清空排程"
        onAction={() => {
          clearReview()
          setConfirmClear(false)
        }}
      />
      <HStack>
        <Button label="前往錯題本" href="/wrong" variant="secondary" size="md" />
      </HStack>
    </PageLayout>
  )
}
