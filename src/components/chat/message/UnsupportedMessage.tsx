import type { MultiTypeReceivedMessage } from '@/libs/types/messages/received-message'
import { transformLink } from '@/libs/utils/transform-link'
import { type Component, createMemo } from 'solid-js'

const UnsupportedMessage: Component<MultiTypeReceivedMessage> = (props) => {
  const content = createMemo(() => {
    try {
      return JSON.stringify(props, null, 2)
    } catch (e) {
      return props.type
    }
  })
  return (
    <details>
      <summary>[不支持的消息类型]</summary>
      <pre class="whitespace-pre-wrap break-all">{transformLink(content())}</pre>
    </details>
  )
}

export { UnsupportedMessage }
