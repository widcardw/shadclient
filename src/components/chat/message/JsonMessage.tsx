import type { CommonJsonCardMessage } from '@/libs/types/messages/common-message'
import { transformLink } from '@/libs/utils/transform-link'
import type { Component } from 'solid-js'

const JsonMessage: Component<CommonJsonCardMessage> = (props) => {
  const data = JSON.parse(props.data.data)
  return (
    <details>
      <summary>JSON</summary>
      <pre>{transformLink(JSON.stringify(data, null, 2))}</pre>
    </details>
  )
}

export { JsonMessage }
