import { ClickableCard } from '@astryxdesign/core/ClickableCard'
import { Heading } from '@astryxdesign/core/Heading'
import { HStack } from '@astryxdesign/core/HStack'
import { Text } from '@astryxdesign/core/Text'
import { VStack } from '@astryxdesign/core/VStack'
import { EXAM_TYPES } from '../data'

export default function ExamSelect() {
  return (
    <VStack gap={6}>
      <VStack gap={2}>
        <Heading level={1}>選擇考試類型</Heading>
        <Text>選好之後再決定類別、題數，以及要邊做邊對還是做完再對。</Text>
      </VStack>
      <HStack gap={4} wrap="wrap" align="stretch">
        {Object.values(EXAM_TYPES).map((exam) => (
          <ClickableCard key={exam.id} href={`/practice/${exam.id}`} label={`開始${exam.name}`}>
            <VStack gap={2}>
              <Heading level={2}>{exam.name}</Heading>
              <Text weight="semibold">{exam.fullName}</Text>
              <Text type="supporting">{exam.description}</Text>
              <Text type="label">開始練習</Text>
            </VStack>
          </ClickableCard>
        ))}
      </HStack>
    </VStack>
  )
}
