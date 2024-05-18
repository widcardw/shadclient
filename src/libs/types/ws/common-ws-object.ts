import type { CommonMessageWsObject } from "./message/common-message-ws-object"
import type { CommonMetaEventWsObject } from "./meta_event/common-meta-ws-object"
import type { CommonNoticeWsObject } from "./notice/common-notice-ws-object"

interface CommonWsObject {
  post_type: 'meta_event' | 'message' | 'notice'
}

type AllWsObject = CommonMessageWsObject | CommonNoticeWsObject | CommonMetaEventWsObject

export type {
  CommonWsObject,
  AllWsObject,
}
