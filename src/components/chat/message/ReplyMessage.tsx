import type { CommonReplyMessage } from '@/libs/types/messages/common-message'
import type { Component } from 'solid-js'

// TODO
const ReplyMessage: Component<{ m: CommonReplyMessage }> = (props) => {
  return <>[回复]</>
}

export { ReplyMessage }
