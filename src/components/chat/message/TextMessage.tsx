import type { CommonTextMessage } from '@/libs/types/messages/common-message'
import { transformLink } from '@/libs/utils/transform-link'
import type { Component } from 'solid-js'

const TextMessage: Component<{ m: CommonTextMessage }> = (props) => {
  return <>{transformLink(props.m.data.text)}</>
}

export { TextMessage }
