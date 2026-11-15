import { Heading } from '@astryxdesign/core/Heading'
import { HStack } from '@astryxdesign/core/HStack'
import { Layout, LayoutContent, LayoutFooter, LayoutHeader } from '@astryxdesign/core/Layout'
import { Text } from '@astryxdesign/core/Text'
import { VStack } from '@astryxdesign/core/VStack'
import NativeLink from './NativeLink'

/** Content pages. Forms and question text use the narrower width. */
export const PAGE_CONTENT_WIDTH = 960
export const PAGE_FORM_WIDTH = 640

export default function PageLayout({
  title,
  description,
  actions,
  contentWidth = PAGE_CONTENT_WIDTH,
  children,
}) {
  return (
    <Layout
      height="fill"
      contentWidth={contentWidth}
      header={
        <LayoutHeader hasDivider label={title}>
          <HStack gap={3} justify="between" align="center" wrap="wrap">
            <VStack gap={1}>
              <Heading level={1}>{title}</Heading>
              {description ? <Text type="supporting">{description}</Text> : null}
            </VStack>
            {actions}
          </HStack>
        </LayoutHeader>
      }
      footer={
        <LayoutFooter hasDivider label="網站說明">
          <VStack gap={1}>
            <Text type="supporting">
              非官方練習站。正式開考資訊請以公職局為準。進度只存在這台裝置的瀏覽器。
            </Text>
            <Text type="supporting">
              <NativeLink href="/about">關於本站與常見問題</NativeLink>
              {' · '}
              <NativeLink href="http://concurso-uni.safp.gov.mo/" isExternal>
                澳門公職開考
              </NativeLink>
              {' · '}
              <NativeLink href="https://thesoustudio.com/" isExternal>
                Sou Studio
              </NativeLink>
              {' · '}
              <NativeLink href="https://mauroad.com/" isExternal>
                mauroad
              </NativeLink>
            </Text>
          </VStack>
        </LayoutFooter>
      }
      content={
        <LayoutContent>
          <VStack gap={6}>{children}</VStack>
        </LayoutContent>
      }
    />
  )
}
