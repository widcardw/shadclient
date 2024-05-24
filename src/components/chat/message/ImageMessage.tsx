import type { CommonImageMessage } from '@/libs/types/messages/common-message'
import type { Component } from 'solid-js'

const ImageMessage: Component<CommonImageMessage> = (props) => {
  return <img src={props.data.url} alt="图片" referrerPolicy="no-referrer" class="max-w-800px" />
}
export {
  ImageMessage
}