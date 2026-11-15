import { Button } from '@astryxdesign/core/Button'
import { Heading } from '@astryxdesign/core/Heading'
import { Text } from '@astryxdesign/core/Text'
import { VStack } from '@astryxdesign/core/VStack'

export default function NotFound() {
  return (
    <VStack gap={3} padding={6}>
      <Heading level={1}>找不到頁面</Heading>
      <Text>你要找的頁面不存在或已移除。</Text>
      <Button label="返回首頁" href="/" variant="primary" />
    </VStack>
  )
}
