import { useState } from 'react'
import { useParams, useSearchParams } from 'react-router-dom'
import { Banner } from '@astryxdesign/core/Banner'
import { Button } from '@astryxdesign/core/Button'
import { Card } from '@astryxdesign/core/Card'
import { Heading } from '@astryxdesign/core/Heading'
import { HStack } from '@astryxdesign/core/HStack'
import { SegmentedControl, SegmentedControlItem } from '@astryxdesign/core/SegmentedControl'
import { Switch } from '@astryxdesign/core/Switch'
import { Text } from '@astryxdesign/core/Text'
import { VStack } from '@astryxdesign/core/VStack'
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
      <VStack gap={3}>
        <Heading level={1}>找不到該考試類型</Heading>
        <Button label="返回選擇考試" href="/exam" variant="primary" />
      </VStack>
    )
  }

  if (loading && !counts) return <LoadingBlock />
  if (error) return <LoadError message={error.message} onRetry={reload} />

  const available = counts?.[category] ?? 0
  const requested = custom ? available : preset
  const count = resolveSessionCount(requested === 0 ? preset : requested, available)
  const minutes = Math.max(5, Math.round((count * 90) / 58))
  const canStart = available > 0 && count >= Math.min(SESSION_QUESTION_MIN, available)
  const href = `/quiz/${examType}?category=${category}&count=${count}&mode=${mode}&timed=${timed ? '1' : '0'}`

  return (
    <VStack gap={6}>
      <HStack gap={3} justify="between" align="center" wrap="wrap">
        <VStack gap={1}>
          <Heading level={1}>{meta.name} 練習</Heading>
          <Text type="supporting">{meta.fullName}</Text>
        </VStack>
        <Button label="更換考試類型" href="/exam" variant="secondary" />
      </HStack>

      <VStack gap={2}>
        <Heading level={2}>選擇題目類別</Heading>
        <HStack gap={2} wrap="wrap">
          {categoryIds.map((id) => {
            const name = id === 'all' ? '全部' : meta.categories.find((item) => item.id === id)?.name
            const total = counts?.[id]
            const selected = category === id
            return (
              <Button
                key={id}
                label={total == null ? name : `${name} ${total}`}
                variant={selected ? 'primary' : 'secondary'}
                onClick={() => {
                  const next = new URLSearchParams(searchParams)
                  if (id === 'all') next.delete('category')
                  else next.set('category', id)
                  setSearchParams(next)
                }}
              />
            )
          })}
        </HStack>
      </VStack>

      <Card padding={4}>
        <VStack gap={4}>
          <Text>
            這一輪從本類別抽 <strong>{canStart ? count : 0}</strong> 題（題庫 {available} 題，每輪最多 {SESSION_QUESTION_MAX} 題）。
          </Text>
          <HStack gap={2} wrap="wrap">
            {PRESETS.map((value) => (
              <Button
                key={value}
                label={`${value} 題`}
                variant={!custom && preset === value ? 'primary' : 'secondary'}
                isDisabled={value > available}
                onClick={() => {
                  setCustom(false)
                  setPreset(value)
                }}
              />
            ))}
            <Button
              label="這一類全部（最多 100）"
              variant={custom ? 'primary' : 'secondary'}
              isDisabled={available === 0}
              onClick={() => setCustom(true)}
            />
          </HStack>
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
            <Button label={`開始練習（${count} 題）`} variant="primary" href={href} />
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
    </VStack>
  )
}
