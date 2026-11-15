import { useMemo, useState } from 'react'
import { AlertDialog } from '@astryxdesign/core/AlertDialog'
import { Button } from '@astryxdesign/core/Button'
import { EmptyState } from '@astryxdesign/core/EmptyState'
import { Card } from '@astryxdesign/core/Card'
import { HStack } from '@astryxdesign/core/HStack'
import { Pagination } from '@astryxdesign/core/Pagination'
import { ToggleButton, ToggleButtonGroup } from '@astryxdesign/core/ToggleButton'
import { Text } from '@astryxdesign/core/Text'
import { VStack } from '@astryxdesign/core/VStack'
import LoadingBlock, { LoadError } from '../components/LoadingBlock'
import PageLayout from '../components/PageLayout'
import QuestionView from '../components/QuestionView'
import { categoryName } from '../data'
import { useQuestionsByIdsWithAnswers } from '../hooks/useQuestions'
import { useReviewSchedule, useWrongAnswers } from '../hooks/useStorage'

const PAGE_SIZE = 8

export default function WrongQuestions() {
  const { entries, wrongIds, removeWrong, clearWrong } = useWrongAnswers()
  const { removeFromReview, clearReview } = useReviewSchedule()
  const [page, setPage] = useState(1)
  const [filter, setFilter] = useState('all')
  const [confirmClear, setConfirmClear] = useState(false)

  const filters = useMemo(() => {
    const ids = new Set(entries.map((entry) => entry.category).filter(Boolean))
    return ['all', ...ids, ...(entries.some((entry) => !entry.category) ? ['unknown'] : [])]
  }, [entries])

  const filtered = entries.filter((entry) => {
    if (filter === 'all') return true
    if (filter === 'unknown') return !entry.category
    return entry.category === filter
  })
  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const safePage = Math.min(page, pageCount)
  const pageEntries = filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE)
  const { questions, loading, error, reload } = useQuestionsByIdsWithAnswers(pageEntries.map((entry) => entry.id))

  if (wrongIds.length === 0) {
    return (
      <PageLayout title="錯題本">
        <EmptyState
          title="目前沒有錯題"
          description="練習裡答錯的題目會自動出現在這裡。"
          headingLevel={2}
          actions={<Button label="去練習" href="/exam" variant="primary" size="md" />}
        />
      </PageLayout>
    )
  }

  return (
    <PageLayout
      title="錯題本"
      description={`共 ${filtered.length} 題。答題複習若答對，會移出錯題本並把間隔往後排。`}
      actions={
        <HStack gap={2} wrap="wrap">
          <Button label={`答題複習（${wrongIds.length} 題）`} href="/wrong/quiz" variant="primary" size="md" />
          <Button label="清空錯題本" variant="secondary" size="md" onClick={() => setConfirmClear(true)} />
        </HStack>
      }
    >
      <ToggleButtonGroup
        label="錯題類別"
        size="md"
        value={filter}
        onChange={(value) => {
          if (typeof value !== 'string') return
          setFilter(value)
          setPage(1)
        }}
      >
        {filters.map((id) => (
          <ToggleButton
            key={id}
            value={id}
            label={id === 'all' ? '全部' : id === 'unknown' ? '未分類' : categoryName(id)}
          />
        ))}
      </ToggleButtonGroup>
      {loading && <LoadingBlock />}
      {error && <LoadError message={error.message} onRetry={reload} />}
      {!loading && !error && (
        <VStack gap={4}>
          {pageEntries.map((entry) => {
            const question = questions.find((item) => item.id === entry.id)
            return (
              <Card key={entry.id} padding={4}>
                <VStack gap={3}>
                  {question ? (
                    <QuestionView
                      question={question}
                      selectedKey={question.correctKey}
                      showResult
                      disabled
                      onSelect={() => {}}
                    />
                  ) : (
                    <Text>這題暫時載入不到（{entry.id}）。</Text>
                  )}
                  <HStack>
                    <Button
                      label="從錯題本移除"
                      variant="secondary"
                      size="md"
                      onClick={() => {
                        removeWrong(entry.id)
                        removeFromReview(entry.id)
                      }}
                    />
                  </HStack>
                </VStack>
              </Card>
            )
          })}
          {filtered.length > PAGE_SIZE && (
            <Pagination
              label="錯題分頁"
              page={safePage}
              onChange={setPage}
              totalItems={filtered.length}
              pageSize={PAGE_SIZE}
              variant="compact"
              hasFirstLast
            />
          )}
        </VStack>
      )}
      <AlertDialog
        isOpen={confirmClear}
        onOpenChange={setConfirmClear}
        title="清空錯題本？"
        description="複習排程也會一併清除。這個動作不能復原。"
        cancelLabel="保留"
        actionLabel="清空錯題本"
        onAction={() => {
          clearWrong()
          clearReview()
          setConfirmClear(false)
        }}
      />
    </PageLayout>
  )
}
