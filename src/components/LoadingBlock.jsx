import { Button } from '@astryxdesign/core/Button'
import { EmptyState } from '@astryxdesign/core/EmptyState'
import { Spinner } from '@astryxdesign/core/Spinner'

export default function LoadingBlock({ label = '載入題目中…' }) {
  return <Spinner size="lg" label={label} />
}

export function LoadError({ message, onRetry }) {
  return (
    <EmptyState
      title="無法載入題目"
      description={message}
      headingLevel={2}
      actions={onRetry ? <Button label="重試" variant="primary" size="md" onClick={onRetry} /> : undefined}
    />
  )
}
