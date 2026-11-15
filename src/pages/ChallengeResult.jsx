import { useLocation, useNavigate } from 'react-router-dom'
import { useEffect } from 'react'
import { Button } from '@astryxdesign/core/Button'
import { Card } from '@astryxdesign/core/Card'
import { HStack } from '@astryxdesign/core/HStack'
import { Text } from '@astryxdesign/core/Text'
import { VStack } from '@astryxdesign/core/VStack'
import PageLayout from '../components/PageLayout'

export default function ChallengeResult() {
  const location = useLocation()
  const navigate = useNavigate()
  const state = location.state

  useEffect(() => {
    if (!state) navigate('/challenge', { replace: true })
  }, [state, navigate])

  if (!state) return null

  const { success, total, wrongCount = 0, answeredCount, quitEarly } = state

  const title = success ? '挑戰成功' : '挑戰失敗'

  return (
    <PageLayout title={title}>
      <Card padding={5}>
        <VStack gap={2} align="center">
          {success ? (
            <Text>全對，共 {total} 題全部答對。</Text>
          ) : (
            <>
              <Text>
                {wrongCount >= 5
                  ? `已錯 ${wrongCount} 題。失敗那一題的解析已在上一頁看過，錯題也在錯題本。`
                  : quitEarly
                    ? `已作答 ${answeredCount} 題後結束。`
                    : `共 ${total} 題，答對 ${answeredCount - wrongCount} 題，錯 ${wrongCount} 題。`}
              </Text>
              {(wrongCount > 0 || answeredCount > 0) && (
                <Text type="supporting">錯題已加入錯題本，可以過去再練一次。</Text>
              )}
            </>
          )}
        </VStack>
      </Card>
      <HStack gap={2} wrap="wrap">
        <Button label="再挑戰" variant="primary" size="md" href="/challenge" />
        <Button label="錯題本" variant="secondary" size="md" href="/wrong" />
        <Button label="返回首頁" variant="secondary" size="md" href="/" />
      </HStack>
    </PageLayout>
  )
}
