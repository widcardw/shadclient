import type { CommonJsonCardMessage } from '@/libs/types/messages/common-message'
import { transformLink } from '@/libs/utils/transform-link'
import type { Component } from 'solid-js'

const JsonMessage: Component<{m: CommonJsonCardMessage}> = (props) => {
  const data = JSON.parse(props.m.data.data)
  return (
    <details>
      <summary>JSON</summary>
      <pre class="whitespace-pre-wrap break-all">{transformLink(JSON.stringify(data, null, 2))}</pre>
    </details>
  )
}

export { JsonMessage }
