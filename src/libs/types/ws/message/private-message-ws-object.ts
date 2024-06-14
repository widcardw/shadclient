import { allFriends } from '@/components/conversation-list/friend-list'
import { friendConvStore, setFriendConvStore } from '@/libs/states/sessions'
import { produce } from 'solid-js/store'
import type { CqReceivedMessage } from '../../messages/received-message'
import type { SingleFriendInfo } from '../private-user-info'
import { type CommonMessageWsObject, dedupAtMessage } from './common-message-ws-object'

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
  const found = allFriends().find((u) => u.user_id === user_id)
  return found?.remark || found?.nickname || `用户-${user_id}`
}

function dispatch(data: PrivateMessageWsObject) {
  const { user_id, raw_message } = data
  // 屏蔽空消息
  if (raw_message.trim() === '') return

  const session = friendConvStore[user_id]

  data.message = dedupAtMessage(data.message)
  if (session) {
    // setFriendConvStore(user_id, 'list', prev => [...prev, data])
    setFriendConvStore(
      user_id,
      produce((conv) => {
        conv.list = [...conv.list, data]
        conv.unread = conv.unread + 1
      }),
    )
    return
  }

  setFriendConvStore(user_id, {
    type: 'private',
    nick: data.sender.nickname,
    list: [data],
    id: user_id,
    unread: 1,
  })
}

export type { PrivateMessageWsObject }
export { dispatch as dispatchPrivateMessageWsObject, getPrivateName }
