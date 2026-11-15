import { Heading } from '@astryxdesign/core/Heading'
import { HStack } from '@astryxdesign/core/HStack'
import { Layout, LayoutContent } from '@astryxdesign/core/Layout'
import { Text } from '@astryxdesign/core/Text'
import { VStack } from '@astryxdesign/core/VStack'

/** Content pages. Forms and question text use the narrower width. */
export const PAGE_CONTENT_WIDTH = 896
export const PAGE_FORM_WIDTH = 640

export default function PageLayout({ title, description, actions, children }) {
  return (
    <Layout
      height="auto"
      content={
        <LayoutContent>
          <VStack gap={5}>
            {title ? (
              <HStack gap={3} justify="between" align="center" wrap="wrap">
                <VStack gap={1}>
                  <Heading level={1}>{title}</Heading>
                  {description ? <Text type="supporting">{description}</Text> : null}
                </VStack>
                {actions}
              </HStack>
            ) : null}
            {children}
          </VStack>
        </LayoutContent>
      }
    />
  )
}
