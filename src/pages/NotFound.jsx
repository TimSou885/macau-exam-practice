import { Button } from '@astryxdesign/core/Button'
import { EmptyState } from '@astryxdesign/core/EmptyState'
import PageLayout from '../components/PageLayout'

export default function NotFound() {
  return (
    <PageLayout title="找不到頁面">
      <EmptyState
        title="這一頁不存在"
        description="你要找的頁面不存在或已移除。"
        headingLevel={2}
        actions={<Button label="返回首頁" href="/" variant="primary" size="md" />}
      />
    </PageLayout>
  )
}
