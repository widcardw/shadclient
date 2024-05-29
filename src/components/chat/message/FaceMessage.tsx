import type { CommonFaceMessage, CommonMarketFaceMessage } from '@/libs/types/messages/common-message'
import type { Component } from 'solid-js'

const CQ_FACE_BASE_URL =
  'https://cdn.jsdelivr.net/gh/Yan-Zero/QFace@master/gif/s'
const KOISHI_QFACE_BASE_URL = 'https://koishi.js.org/QFace/gif/s'

const FaceMessage: Component<{ m: CommonFaceMessage }> = (props) => {
  return (
    <img
      class="w-5 h-5"
      src={`${KOISHI_QFACE_BASE_URL}${props.m.data.id}.gif`}
      alt={`[表情:${props.m.data.id}]`}
    />
  )
}

const MarketFaceMessage: Component<{ m: CommonMarketFaceMessage }> = (props) => {
  return <>{props.m.data.summary}</>
}

export { FaceMessage, MarketFaceMessage, CQ_FACE_BASE_URL, KOISHI_QFACE_BASE_URL }
