import { Button } from '@astryxdesign/core/Button'
import { Heading } from '@astryxdesign/core/Heading'
import { Text } from '@astryxdesign/core/Text'
import { VStack } from '@astryxdesign/core/VStack'

export default function LoadingBlock({ label = '載入題目中…' }) {
  return (
    <VStack gap={2} padding={6} align="center">
      <Heading level={2}>{label}</Heading>
      <Text type="supporting">請稍候</Text>
    </VStack>
  )
}

export function LoadError({ message, onRetry }) {
  return (
    <VStack gap={3} padding={6} align="center">
      <Heading level={2}>無法載入題目</Heading>
      <Text>{message}</Text>
      {onRetry && <Button label="重試" variant="primary" onClick={onRetry} />}
    </VStack>
  )
}
