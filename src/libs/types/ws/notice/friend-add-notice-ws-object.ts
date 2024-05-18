import type { CommonNoticeWsObject } from './common-notice-ws-object'

interface FriendAddNoticeWsObject extends CommonNoticeWsObject {
  notice_type: 'friend_add'
  user_id: number
  time: number
  self_id: number
}

export type { FriendAddNoticeWsObject }
