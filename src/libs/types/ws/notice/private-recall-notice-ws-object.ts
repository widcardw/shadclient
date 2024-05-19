import { friendConvStore, setFriendConvStore } from '@/libs/states/sessions'
import type { CommonNoticeWsObject } from './common-notice-ws-object'

interface PrivateRecallNoticeWsObject extends CommonNoticeWsObject {
  notice_type: 'friend_recall'
  user_id: number
  message_id: number
  time: number
  self_id: number
}

function dispatch(data: PrivateRecallNoticeWsObject) {
  const { user_id } = data
  const session = friendConvStore[user_id]
  if (session) {
    const i = session.list.findIndex(m => m.message_id === data.message_id)
    if (i !== -1) {
      setFriendConvStore(user_id, 'list', i, 'deleted', true)
    }
  }
}

export type { PrivateRecallNoticeWsObject }
export { dispatch as dispatchPrivateRecallNoticeWsObject }