import { Button } from '@astryxdesign/core/Button'
import PageLayout from '../components/PageLayout'

export default function NotFound() {
  return (
    <PageLayout title="找不到頁面" description="你要找的頁面不存在或已移除。">
      <Button label="返回首頁" href="/" variant="primary" />
    </PageLayout>
  )
}
