import { useEffect, useRef, useState } from 'react'
import { AlertDialog } from '@astryxdesign/core/AlertDialog'
import { Button } from '@astryxdesign/core/Button'
import { Card } from '@astryxdesign/core/Card'
import { HStack } from '@astryxdesign/core/HStack'
import { ProgressBar } from '@astryxdesign/core/ProgressBar'
import { Text } from '@astryxdesign/core/Text'
import { VStack } from '@astryxdesign/core/VStack'
import { verifyAnswer } from '../api/questions'
import { nextQuestionIndex } from '../utils/nextQuestion'
import { clearSession, saveSession } from '../utils/sessionStore'
import QuestionView from './QuestionView'

const KEY_TO_OPTION = { 1: 'A', 2: 'B', 3: 'C', 4: 'D', a: 'A', b: 'B', c: 'C', d: 'D' }

export default function QuizRunner({
  sessionKey,
  href,
  questions,
  restored,
  mode = 'tutor',
  durationSec = 0,
  failThreshold = null,
  onVerified,
  onFinish,
  onQuit,
  resultNote,
}) {
  const [index, setIndex] = useState(restored?.index ?? 0)
  const [selectedKey, setSelectedKey] = useState(restored?.selectedKey ?? '')
  const [showResult, setShowResult] = useState(Boolean(restored?.showResult))
  const [answers, setAnswers] = useState(restored?.answers ?? [])
  const [revealed, setRevealed] = useState(restored?.revealed ?? {})
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState(null)
  const [confirmQuit, setConfirmQuit] = useState(false)
  const [now, setNow] = useState(() => Date.now())
  const [startedAt] = useState(restored?.startedAt ?? Date.now())
  const [failedLock, setFailedLock] = useState(() => {
    const wrong = (restored?.answers ?? []).filter((answer) => !answer.correct).length
    return failThreshold != null && wrong >= failThreshold
  })
  const finishedRef = useRef(false)
  const answersRef = useRef(answers)
  answersRef.current = answers

  const currentBase = questions[index]
  const current = currentBase ? { ...currentBase, ...revealed[currentBase.id] } : null
  const isLast = index >= questions.length - 1
  const wrongCount = answers.filter((answer) => !answer.correct).length
  const remaining = durationSec > 0 ? Math.max(0, durationSec - Math.floor((now - startedAt) / 1000)) : null

  useEffect(() => {
    if (finishedRef.current) return
    saveSession(sessionKey, {
      href,
      questions,
      index,
      selectedKey,
      showResult,
      answers,
      revealed,
      startedAt,
      durationSec,
    })
  }, [sessionKey, href, questions, index, selectedKey, showResult, answers, revealed, startedAt, durationSec])

  useEffect(() => {
    if (!durationSec) return undefined
    const timer = setInterval(() => setNow(Date.now()), 1000)
    return () => clearInterval(timer)
  }, [durationSec])

  const finish = (list = answersRef.current) => {
    if (finishedRef.current) return
    finishedRef.current = true
    clearSession()
    onFinish(list)
  }

  useEffect(() => {
    if (remaining === 0) finish()
  }, [remaining])

  useEffect(() => {
    const onKey = (event) => {
      const target = event.target
      if (target instanceof HTMLElement && target.closest('input, textarea, select')) return
      const option = KEY_TO_OPTION[event.key.toLowerCase()]
      if (option && !showResult && !submitting && !failedLock) {
        const exists = current?.options?.some((item) => item.key === option)
        if (exists) {
          event.preventDefault()
          setSelectedKey(option)
        }
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [showResult, submitting, failedLock, current])

  const handleSubmit = async () => {
    if (!selectedKey || !current || submitting) return
    setSubmitting(true)
    setError(null)
    try {
      const result = await verifyAnswer(current.id, selectedKey)
      onVerified?.(current, result)
      const record = {
        questionId: current.id,
        correct: result.correct,
        selectedKey,
        correctKey: result.correctKey,
        explanation: result.explanation,
        question: current.question,
        options: current.options,
        category: current.category,
      }
      const nextAnswers = [...answersRef.current, record]
      setAnswers(nextAnswers)
      setRevealed((prev) => ({
        ...prev,
        [current.id]: { correctKey: result.correctKey, explanation: result.explanation },
      }))
      const nextWrong = nextAnswers.filter((answer) => !answer.correct).length
      if (failThreshold != null && !result.correct && nextWrong >= failThreshold) {
        setShowResult(true)
        setFailedLock(true)
        return
      }
      if (mode === 'exam') {
        if (isLast) finish(nextAnswers)
        else {
          setIndex((value) => nextQuestionIndex(value, questions.length))
          setSelectedKey('')
          setShowResult(false)
        }
        return
      }
      setShowResult(true)
    } catch (err) {
      setError(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  const handleNext = () => {
    if (failedLock || isLast) {
      finish()
      return
    }
    setIndex((value) => nextQuestionIndex(value, questions.length))
    setSelectedKey('')
    setShowResult(false)
  }

  if (!current) return null

  const note = showResult ? resultNote?.(current, revealed[current.id], selectedKey) : null

  return (
    <VStack gap={4}>
      <HStack gap={3} justify="between" align="center" wrap="wrap">
        <Text type="supporting">
          第 {index + 1} / {questions.length} 題
          {failThreshold != null ? ` · 已錯 ${wrongCount} / ${failThreshold}` : ''}
          {remaining != null ? ` · 剩餘 ${formatClock(remaining)}` : ''}
        </Text>
        <Button label="結束練習" variant="ghost" onClick={() => setConfirmQuit(true)} />
      </HStack>
      <ProgressBar
        label="作答進度"
        isLabelHidden
        value={index + (showResult ? 1 : 0)}
        max={questions.length}
        variant={failedLock ? 'warning' : 'accent'}
      />
      <Card padding={4}>
        <QuestionView
          question={current}
          selectedKey={selectedKey}
          onSelect={setSelectedKey}
          showResult={showResult}
          disabled={showResult || submitting || failedLock}
          note={note}
        />
      </Card>
      {error && <Text color="secondary">{error}</Text>}
      {!selectedKey && !showResult && (
        <Text type="supporting">請先選擇一個選項。也可以按鍵盤 1 到 4。</Text>
      )}
      {!showResult ? (
        <Button
          label={submitting ? '驗證中…' : '提交答案'}
          variant="primary"
          width="100%"
          isDisabled={!selectedKey || submitting}
          isLoading={submitting}
          onClick={handleSubmit}
        />
      ) : (
        <Button
          label={failedLock || isLast ? '查看結果' : '下一題'}
          variant="primary"
          width="100%"
          onClick={handleNext}
        />
      )}
      <AlertDialog
        isOpen={confirmQuit}
        onOpenChange={setConfirmQuit}
        title="結束這輪練習？"
        description="這輪進度會從這台裝置清除，不能復原。若只是想先離開，直接到其他頁面，稍後可從首頁繼續。"
        cancelLabel="繼續作答"
        actionLabel="清除並離開"
        actionVariant="destructive"
        onAction={() => {
          finishedRef.current = true
          clearSession()
          setConfirmQuit(false)
          onQuit()
        }}
      />
    </VStack>
  )
}

function formatClock(totalSeconds) {
  const minutes = Math.floor(totalSeconds / 60)
  const seconds = totalSeconds % 60
  return `${minutes}:${String(seconds).padStart(2, '0')}`
}
