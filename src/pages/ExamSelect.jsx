import { ClickableCard } from '@astryxdesign/core/ClickableCard'
import { Grid } from '@astryxdesign/core/Grid'
import { Heading } from '@astryxdesign/core/Heading'
import { Text } from '@astryxdesign/core/Text'
import { VStack } from '@astryxdesign/core/VStack'
import PageLayout from '../components/PageLayout'
import { EXAM_TYPES } from '../data'

export default function ExamSelect() {
  return (
    <PageLayout
      title="選擇考試類型"
      description="選好之後再決定類別、題數，以及要邊做邊對還是做完再對。"
    >
      <Grid columns={{ minWidth: 320, max: 2 }} gap={4}>
        {Object.values(EXAM_TYPES).map((exam) => (
          <ClickableCard
            key={exam.id}
            href={`/practice/${exam.id}`}
            label={`開始${exam.name}`}
            elevation="low"
          >
            <VStack gap={2}>
              <Heading level={2}>{exam.name}</Heading>
              <Text weight="semibold">{exam.fullName}</Text>
              <Text type="supporting">{exam.description}</Text>
            </VStack>
          </ClickableCard>
        ))}
      </Grid>
    </PageLayout>
  )
}
