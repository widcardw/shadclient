import { friendConvStore, setFriendConvStore } from '@/libs/states/sessions'
import { createTextMessage } from '../../messages/sent-message'
import {
  type PrivateMessageWsObject,
  getPrivateName,
} from '../message/private-message-ws-object'
import type { CommonNoticeWsObject } from './common-notice-ws-object'

interface PrivatePokeNoticeWsObject extends CommonNoticeWsObject {
  sender_id: number
  user_id: number
  target_id: number
  notice_type: 'poke'
  time: number
  self_id: number
}

function dispatch(data: PrivatePokeNoticeWsObject) {
  const { user_id, time, self_id } = data
  const nickname = getPrivateName(user_id)
  const privateMsgWsObject: PrivateMessageWsObject = {
    post_type: 'message',
    message_type: 'private',
    sub_type: 'normal',
    message_id: 0,
    user_id,
    message: [createTextMessage('拍了拍你')],
    raw_message: '',
    font: 0,
    sender: {
      user_id,
      nickname,
    },
    target_id: self_id,
    time,
    self_id,
  }

  const session = friendConvStore[user_id]
  if (session) {
    setFriendConvStore(user_id, 'list', (prev) => [...prev, privateMsgWsObject])
    return
  }

  setFriendConvStore(user_id, {
    type: 'private',
    nick: nickname,
    list: [privateMsgWsObject],
    id: user_id,
  })
}

export type { PrivatePokeNoticeWsObject }
export { dispatch as dispatchPrivatePokeNoticeWsObject }
