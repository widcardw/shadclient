/// 本目录中包含的是从 WebSocket 接收到的完整的消息对象，即包含了 post_type, sender_id 等属性的完整对象
import type { CommonMessageWsObject } from './message/common-message-ws-object'
import type { CommonMetaEventWsObject } from './meta_event/common-meta-ws-object'
import type { CommonNoticeWsObject } from './notice/common-notice-ws-object'
import type { CommonRequestWsObject } from './request/common-request-ws-object'

interface CommonWsObject {
  post_type: 'meta_event' | 'message' | 'notice' | 'request'
}

type AllWsObject =
  | CommonMessageWsObject
  | CommonNoticeWsObject
  | CommonMetaEventWsObject
  | CommonRequestWsObject

export type { CommonWsObject, AllWsObject }
