import type { CommonTextMessage } from '@/libs/types/messages/common-message'
import { transformLink } from '@/libs/utils/transform-link'
import type { Component } from 'solid-js'
import { Show } from 'solid-js'

const TextMessage: Component<{ m: CommonTextMessage }> = (props) => {
  return (
    <Show when={props.m.data.text.trim() !== ''}>
      <span class="whitespace-pre-wrap">{transformLink(props.m.data.text)}</span>
    </Show>
  )
}

export { TextMessage }
