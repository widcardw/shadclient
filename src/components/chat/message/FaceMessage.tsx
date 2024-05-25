import type { CommonFaceMessage } from '@/libs/types/messages/common-message'
import type { Component } from 'solid-js'

const CQ_FACE_BASE_URL =
  'https://cdn.jsdelivr.net/gh/Yan-Zero/QFace@master/gif/s'

const FaceMessage: Component<{ m: CommonFaceMessage }> = (props) => {
  return (
    <img
      class="w-4 h-4"
      src={`${CQ_FACE_BASE_URL}${props.m.data.id}.gif`}
      alt={`[表情:${props.m.data.id}]`}
    />
  )
}

export { FaceMessage, CQ_FACE_BASE_URL }
