import type { CommonTextMessage } from '@/libs/types/messages/common-message'
import { transformLink } from '@/libs/utils/transform-link'
import type { Component } from 'solid-js'

const TextMessage: Component<{ m: CommonTextMessage }> = (props) => {
  return <span class="whitespace-pre-wrap">{transformLink(props.m.data.text)}</span>
}

export { TextMessage }
