import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@astryxdesign/core/Button'
import { Card } from '@astryxdesign/core/Card'
import { Heading } from '@astryxdesign/core/Heading'
import { HStack } from '@astryxdesign/core/HStack'
import { NumberInput } from '@astryxdesign/core/NumberInput'
import { ToggleButton, ToggleButtonGroup } from '@astryxdesign/core/ToggleButton'
import { Text } from '@astryxdesign/core/Text'
import { VStack } from '@astryxdesign/core/VStack'
import PageLayout, { PAGE_FORM_WIDTH } from '../components/PageLayout'
import { EXAM_TYPES } from '../data'
import { useExamCounts } from '../hooks/useQuestions'
import { SESSION_QUESTION_MAX, SESSION_QUESTION_MIN, resolveSessionCount } from '../utils/questionLimit'

const PRESETS = [20, 50, 100]

export default function Challenge() {
  const navigate = useNavigate()
  const [examType, setExamType] = useState(null)
  const [preset, setPreset] = useState(null)
  const [custom, setCustom] = useState(50)
  const [useCustom, setUseCustom] = useState(false)
  const { counts } = useExamCounts()
  const available = examType ? (counts[examType] ?? 0) : 0
  const requested = useCustom ? custom : preset
  const count = requested == null ? null : resolveSessionCount(requested, available || requested)
  const customInvalid = useCustom && (custom < SESSION_QUESTION_MIN || custom > SESSION_QUESTION_MAX)
  const canStart = Boolean(examType && count && !customInvalid && available >= SESSION_QUESTION_MIN)

  return (
    <PageLayout
      title="挑戰模式"
      description={`全類別隨機出題。錯滿 5 題即失敗，失敗的那一題會先顯示解析。每輪 5 到 ${SESSION_QUESTION_MAX} 題。`}
      contentWidth={PAGE_FORM_WIDTH}
    >
      <VStack gap={3}>
        <Heading level={2}>1. 選擇考試類型</Heading>
        <ToggleButtonGroup
          label="考試類型"
          size="md"
          value={examType}
          onChange={(value) => {
            if (typeof value !== 'string') return
            setExamType(value)
            setPreset(null)
            setUseCustom(false)
          }}
        >
          {Object.values(EXAM_TYPES).map((exam) => {
            const total = counts[exam.id]
            return (
              <ToggleButton
                key={exam.id}
                value={exam.id}
                label={total == null ? exam.name : `${exam.name}（${total} 題）`}
              />
            )
          })}
        </ToggleButtonGroup>
      </VStack>

      {examType && (
        <Card padding={4}>
          <VStack gap={3}>
            <Heading level={2}>2. 選擇題目數量</Heading>
            <ToggleButtonGroup
              label="題目數量"
              size="md"
              value={!useCustom && preset != null ? String(preset) : null}
              onChange={(value) => {
                if (typeof value !== 'string') return
                setUseCustom(false)
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
            </ToggleButtonGroup>
            <NumberInput
                label="自訂題數"
                value={custom}
                min={SESSION_QUESTION_MIN}
                max={Math.min(SESSION_QUESTION_MAX, available || SESSION_QUESTION_MAX)}
                isIntegerOnly
                onChange={(value) => {
                  setUseCustom(true)
                  setCustom(value)
                }}
                onFocus={() => setUseCustom(true)}
              />
            {customInvalid && (
              <Text>自訂題數要在 {SESSION_QUESTION_MIN} 到 {SESSION_QUESTION_MAX} 之間。</Text>
            )}
            {available < SESSION_QUESTION_MIN && <Text>這個考試的題庫不足 {SESSION_QUESTION_MIN} 題。</Text>}
            {canStart ? (
              <HStack>
                <Button
                  label={`開始挑戰（${count} 題）`}
                  variant="primary"
                  size="md"
                  onClick={() => navigate(`/challenge/${examType}?count=${count}`)}
                />
              </HStack>
            ) : (
              <Text type="supporting">選好考試和題數後就可以開始。</Text>
            )}
          </VStack>
        </Card>
      )}
    </PageLayout>
  )
}
