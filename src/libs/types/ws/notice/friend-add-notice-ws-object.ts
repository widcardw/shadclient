import { toast } from 'solid-sonner'
import type { CommonNoticeWsObject } from './common-notice-ws-object'

interface FriendAddNoticeWsObject extends CommonNoticeWsObject {
  notice_type: 'friend_add'
  user_id: number
  time: number
  self_id: number
}

function dispatch(data: FriendAddNoticeWsObject) {
  toast(`Added ${data.user_id} into friends!`)
}

export type { FriendAddNoticeWsObject }
export { dispatch as dispatchFriendAddNotice }
