import { friendConvStore, setFriendConvStore } from '@/libs/states/sessions'
import { _createFileMessage } from '../../messages/sent-message'
import { type PrivateMessageWsObject, getPrivateName } from '../message/private-message-ws-object'
import type { CommonNoticeWsObject } from './common-notice-ws-object'
import type { FileNotice } from './file-notice'
import { UnifyInfoType } from '../unify-info'

interface PrivateFileNoticeWsObject extends CommonNoticeWsObject {
  notice_type: 'offline_file'
  user_id: number
  file: FileNotice
  time: number
  self_id: number
}

function dispatch(data: PrivateFileNoticeWsObject) {
  const { user_id, file, time, self_id } = data
  const nickname = getPrivateName(user_id)
  const privateMsgWsObject: PrivateMessageWsObject = {
    post_type: 'message',
    message_type: 'private',
    sub_type: 'normal',
    message_id: -1,
    user_id,
    message: [_createFileMessage({ name: file.name, file: file.url, size: file.size })],
    raw_message: '',
    font: 0,
    sender: {
      type: UnifyInfoType.Private,
      user_id,
      nickname,
    },
    target_id: self_id,
    time,
    self_id,
  }

  const session = friendConvStore[user_id]
  if (session) {
    setFriendConvStore(user_id, 'list', prev => [...prev, privateMsgWsObject])
    return
  }

  setFriendConvStore(user_id, {
    type: 'private',
    nick: nickname,
    list: [privateMsgWsObject],
    id: user_id
  })
}

export type { PrivateFileNoticeWsObject }
export { dispatch as dispatchPrivateFileNoticeWsObject }
