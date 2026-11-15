import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@astryxdesign/core/Button'
import { Card } from '@astryxdesign/core/Card'
import { Heading } from '@astryxdesign/core/Heading'
import { HStack } from '@astryxdesign/core/HStack'
import { NumberInput } from '@astryxdesign/core/NumberInput'
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
        <HStack gap={3} wrap="wrap" align="stretch">
          {Object.values(EXAM_TYPES).map((exam) => {
            const total = counts[exam.id]
            const active = examType === exam.id
            return (
              <Button
                key={exam.id}
                label={total == null ? exam.name : `${exam.name}（${total} 題）`}
                variant={active ? 'primary' : 'secondary'}
                onClick={() => {
                  setExamType(exam.id)
                  setPreset(null)
                  setUseCustom(false)
                }}
              />
            )
          })}
        </HStack>
      </VStack>

      {examType && (
        <Card padding={4}>
          <VStack gap={3}>
            <Heading level={2}>2. 選擇題目數量</Heading>
            <HStack gap={2} wrap="wrap" align="end">
              {PRESETS.map((value) => (
                <Button
                  key={value}
                  label={`${value} 題`}
                  variant={!useCustom && preset === value ? 'primary' : 'secondary'}
                  isDisabled={value > available}
                  onClick={() => {
                    setUseCustom(false)
                    setPreset(value)
                  }}
                />
              ))}
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
            </HStack>
            {customInvalid && (
              <Text>自訂題數要在 {SESSION_QUESTION_MIN} 到 {SESSION_QUESTION_MAX} 之間。</Text>
            )}
            {available < SESSION_QUESTION_MIN && <Text>這個考試的題庫不足 {SESSION_QUESTION_MIN} 題。</Text>}
            {canStart ? (
              <Button
                label={`開始挑戰（${count} 題）`}
                variant="primary"
                onClick={() => navigate(`/challenge/${examType}?count=${count}`)}
              />
            ) : (
              <Text type="supporting">選好考試和題數後就可以開始。</Text>
            )}
          </VStack>
        </Card>
      )}
    </PageLayout>
  )
}
