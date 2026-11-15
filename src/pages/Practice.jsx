import { useState } from 'react'
import { useParams, useSearchParams } from 'react-router-dom'
import { Banner } from '@astryxdesign/core/Banner'
import { EmptyState } from '@astryxdesign/core/EmptyState'
import { Button } from '@astryxdesign/core/Button'
import { Card } from '@astryxdesign/core/Card'
import { Heading } from '@astryxdesign/core/Heading'
import { HStack } from '@astryxdesign/core/HStack'
import { SegmentedControl, SegmentedControlItem } from '@astryxdesign/core/SegmentedControl'
import { ToggleButton, ToggleButtonGroup } from '@astryxdesign/core/ToggleButton'
import { Switch } from '@astryxdesign/core/Switch'
import { Text } from '@astryxdesign/core/Text'
import { VStack } from '@astryxdesign/core/VStack'
import PageLayout, { PAGE_FORM_WIDTH } from '../components/PageLayout'
import { EXAM_TYPES } from '../data'
import { useCategoryCounts } from '../hooks/useQuestions'
import LoadingBlock, { LoadError } from '../components/LoadingBlock'
import { SESSION_QUESTION_MAX, SESSION_QUESTION_MIN, resolveSessionCount } from '../utils/questionLimit'

const PRESETS = [10, 20, 50]

export default function Practice() {
  const { examType } = useParams()
  const [searchParams, setSearchParams] = useSearchParams()
  const category = searchParams.get('category') || 'all'
  const meta = EXAM_TYPES[examType]
  const categoryIds = meta ? ['all', ...meta.categories.map((item) => item.id)] : []
  const { counts, loading, error, reload } = useCategoryCounts(examType, categoryIds)
  const [preset, setPreset] = useState(20)
  const [custom, setCustom] = useState(false)
  const [mode, setMode] = useState('tutor')
  const [timed, setTimed] = useState(false)

  if (!meta) {
    return (
      <PageLayout title="找不到該考試類型" contentWidth={PAGE_FORM_WIDTH}>
        <EmptyState
          title="沒有這個考試"
          description="請回到考試列表再選一次。"
          headingLevel={2}
          actions={<Button label="返回選擇考試" href="/exam" variant="primary" size="md" />}
        />
      </PageLayout>
    )
  }

  if (loading && !counts) {
    return (
      <PageLayout title="練習" contentWidth={PAGE_FORM_WIDTH}>
        <LoadingBlock />
      </PageLayout>
    )
  }
  if (error) {
    return (
      <PageLayout title="練習" contentWidth={PAGE_FORM_WIDTH}>
        <LoadError message={error.message} onRetry={reload} />
      </PageLayout>
    )
  }

  const available = counts?.[category] ?? 0
  const requested = custom ? available : preset
  const count = resolveSessionCount(requested === 0 ? preset : requested, available)
  const minutes = Math.max(5, Math.round((count * 90) / 58))
  const canStart = available > 0 && count >= Math.min(SESSION_QUESTION_MIN, available)
  const href = `/quiz/${examType}?category=${category}&count=${count}&mode=${mode}&timed=${timed ? '1' : '0'}`

  return (
    <PageLayout
      title={`${meta.name} 練習`}
      description={meta.fullName}
      contentWidth={PAGE_FORM_WIDTH}
      actions={<Button label="更換考試類型" href="/exam" variant="secondary" />}
    >
      <VStack gap={2}>
        <Heading level={2}>選擇題目類別</Heading>
        <ToggleButtonGroup
          label="題目類別"
          size="md"
          value={category}
          onChange={(value) => {
            if (typeof value !== 'string') return
            const next = new URLSearchParams(searchParams)
            if (value === 'all') next.delete('category')
            else next.set('category', value)
            setSearchParams(next)
          }}
        >
          {categoryIds.map((id) => {
            const name = id === 'all' ? '全部' : meta.categories.find((item) => item.id === id)?.name
            const total = counts?.[id]
            return (
              <ToggleButton
                key={id}
                value={id}
                label={total == null ? name : `${name} ${total}`}
              />
            )
          })}
        </ToggleButtonGroup>
      </VStack>

      <Card padding={4}>
        <VStack gap={4}>
          <Text>
            {`這一輪從本類別抽 ${canStart ? count : 0} 題（題庫 ${available} 題，每輪最多 ${SESSION_QUESTION_MAX} 題）。`}
          </Text>
          <ToggleButtonGroup
            label="這一輪題數"
            size="md"
            value={custom ? 'all' : String(preset)}
            onChange={(value) => {
              if (value === 'all') {
                setCustom(true)
                return
              }
              if (typeof value !== 'string') return
              setCustom(false)
              setPreset(Number(value))
            }}
          >
            {PRESETS.map((value) => (
              <ToggleButton
                key={value}
                value={String(value)}
                label={`${value} 題`}
                isDisabled={value > available}
              />
            ))}
            <ToggleButton
              value="all"
              label="這一類全部（最多 100）"
              isDisabled={available === 0}
            />
          </ToggleButtonGroup>
          <SegmentedControl
            label="對答案方式"
            value={mode}
            onChange={(value) => {
              setMode(value)
              setTimed(value === 'exam')
            }}
          >
            <SegmentedControlItem value="tutor" label="邊做邊對" />
            <SegmentedControlItem value="exam" label="做完再對" />
          </SegmentedControl>
          <Switch
            label={timed ? `計時 ${minutes} 分鐘` : '不計時'}
            description="做完再對預設會計時，大約按 58 題 90 分鐘的比例。"
            value={timed}
            onChange={setTimed}
          />
          {available === 0 && <Text>這個類別暫時沒有題目。</Text>}
          {canStart ? (
            <HStack>
              <Button label={`開始練習（${count} 題）`} variant="primary" size="md" href={href} />
            </HStack>
          ) : (
            <Text type="supporting">題庫不足，暫時不能開這一輪。</Text>
          )}
        </VStack>
      </Card>
      <Banner
        status="info"
        title="正確率不是開考成績"
        description="正式 430 約 58 題、滿分 100、50 分合格。短練習的百分比只代表這一輪。"
        collapsible={false}
      />
    </PageLayout>
  )
}
