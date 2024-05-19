import type { CqReceivedMessage } from '../../messages/received-message'
import type { CommonMessageWsObject } from './common-message-ws-object'
import type { SingleFriendInfo } from '../private-user'
import { friendConvStore, setFriendConvStore } from '@/libs/states/sessions'
import { allFriends } from '@/components/conversation-list/friend-list'

interface PrivateMessageWsObject extends CommonMessageWsObject {
  message_type: 'private'
  sub_type: string
  message_id: number
  user_id: number
  message: CqReceivedMessage
  raw_message: string
  font: number
  sender: SingleFriendInfo
  target_id: number
  time: number
  self_id: number
  deleted?: boolean
}

function getPrivateName(user_id: number) {
  const found = allFriends().find(u => u.user_id === user_id)
  return found?.remark || found?.nickname || `用户-${user_id}`
}

function dispatch(data: PrivateMessageWsObject) {
  const { user_id } = data
  const session = friendConvStore[user_id]
  if (session) {
    setFriendConvStore(user_id, 'list', prev => [...prev, data])
    return
  }

  setFriendConvStore(user_id, {
    type: 'private',
    nick: data.sender.nickname,
    list: [data],
    id: user_id
  })
}

export type { PrivateMessageWsObject }
export { dispatch as dispatchPrivateMessageWsObject, getPrivateName }
