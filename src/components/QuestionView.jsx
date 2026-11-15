import { Badge } from '@astryxdesign/core/Badge'
import { Banner } from '@astryxdesign/core/Banner'
import { Heading } from '@astryxdesign/core/Heading'
import { RadioList, RadioListItem } from '@astryxdesign/core/RadioList'
import { Table } from '@astryxdesign/core/Table'
import { Text } from '@astryxdesign/core/Text'
import { VStack } from '@astryxdesign/core/VStack'
import { categoryName } from '../data'
import { extractChartRows } from '../utils/chartTable'

export default function QuestionView({
  question,
  selectedKey,
  onSelect,
  showResult,
  disabled,
  note,
}) {
  if (!question) return null
  const chart = question.category === 'chart' ? extractChartRows(question.question) : null
  const correct = showResult && selectedKey && selectedKey === question.correctKey
  const incorrect = showResult && selectedKey && selectedKey !== question.correctKey

  return (
    <VStack gap={4}>
      <Badge variant="teal" label={categoryName(question.category)} />
      {chart && (
        <Table
          aria-label="由題幹整理的圖表"
          data={chart.rows}
          columns={[
            { key: 'label', header: chart.columns[0] },
            { key: 'value', header: chart.columns[1] },
          ]}
          density="compact"
          dividers="grid"
        />
      )}
      <Heading level={2}>{question.question}</Heading>
      {showResult && (
        <Banner
          status={correct ? 'success' : 'error'}
          title={correct ? '答對了' : '答錯了'}
          description={[note, question.explanation].filter(Boolean).join(' ')}
          collapsible={false}
        />
      )}
      <RadioList
        label="選項"
        isLabelHidden
        value={selectedKey || ''}
        onChange={onSelect}
        isDisabled={disabled}
        disabledMessage={disabled ? '這題已經提交' : undefined}
      >
        {question.options.map((option) => (
          <RadioListItem
            key={option.key}
            value={option.key}
            align="start"
            label={`${option.key}. ${option.text}`}
            description={optionDescription(option, question, selectedKey, showResult)}
          />
        ))}
      </RadioList>
      {incorrect && !question.explanation && (
        <Text type="supporting">這題沒有解析。</Text>
      )}
    </VStack>
  )
}

function optionDescription(option, question, selectedKey, showResult) {
  if (!showResult || !question.correctKey) return undefined
  if (option.key === question.correctKey) return '正確答案'
  if (option.key === selectedKey) return '你的選擇'
  return undefined
}
