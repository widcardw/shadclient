import type { CommonNoticeWsObject } from './common-notice-ws-object'

interface PrivateRecallNoticeWsObject extends CommonNoticeWsObject {
  notice_type: 'friend_recall'
  user_id: number
  message_id: number
  time: number
  self_id: number
}

export type { PrivateRecallNoticeWsObject }
