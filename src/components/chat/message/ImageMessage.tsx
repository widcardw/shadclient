import type { CommonImageMessage } from '@/libs/types/messages/common-message'
import type { Component } from 'solid-js'

const ImageMessage: Component<{m:CommonImageMessage}> = (props) => {
  return <img src={props.m.data.url} alt="图片" referrerPolicy="no-referrer" class="max-w-400px" />
}
export {
  ImageMessage
}