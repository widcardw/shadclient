import type { MultiTypeReceivedMessage } from '@/libs/types/messages/received-message'
import { transformLink } from '@/libs/utils/transform-link'
import { type Component, createMemo } from 'solid-js'

const UnsupportedMessage: Component<{ m: MultiTypeReceivedMessage }> = (
  props,
) => {
  const content = createMemo(() => {
    try {
      return JSON.stringify(props.m, null, 2)
    } catch (e) {
      return props.m.type
    }
  })
  return (
    <details>
      <summary>[不支持的消息类型: {props.m.type}]</summary>
      <pre class="whitespace-pre-wrap break-all">
        {transformLink(content())}
      </pre>
    </details>
  )
}

export { UnsupportedMessage }
