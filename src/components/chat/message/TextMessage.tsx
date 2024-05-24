import type { CommonTextMessage } from '@/libs/types/messages/common-message'
import { transformLink } from '@/libs/utils/transform-link'
import type { Component } from 'solid-js'

const TextMessage: Component<CommonTextMessage> = (props) => {
  return <>{transformLink(props.data.text)}</>
}

export { TextMessage }
