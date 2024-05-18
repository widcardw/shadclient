import type { CommonNoticeWsObject } from './common-notice-ws-object'

interface GroupRecallNoticeWsObject extends CommonNoticeWsObject {
  notice_type: 'group_recall'
  group_id: number
  user_id: number
  message_id: number
  operator_id: number
  time: number
  self_id: number
}

export type { GroupRecallNoticeWsObject }
