import {
  groupConvStore,
  groupMemberCard,
  setGroupConvStore,
} from '@/libs/states/sessions'
import { _createFileMessage } from '../../messages/sent-message'
import {
  type GroupMessageWsObject,
  getGroupName,
} from '../message/group-message-ws-object'
import type { CommonNoticeWsObject } from './common-notice-ws-object'
import type { FileNotice } from './file-notice'
import { groupMemberListStore } from '@/components/chat/GroupMemberList'

interface GroupFileNoticeWsObject extends CommonNoticeWsObject {
  notice_type: 'group_upload'
  group_id: number
  user_id: number
  file: FileNotice
  time: number
  self_id: number
}

function dispatch(data: GroupFileNoticeWsObject) {
  const { group_id, user_id, file, time } = data
  const foundGroupMember = groupMemberListStore[group_id].find(i => i.user_id === Number(user_id))
  const groupMsgWsObject: GroupMessageWsObject = {
    post_type: 'message',
    message_type: 'group',
    sub_type: 'normal',
    message_id: -1,
    group_id,
    user_id,
    anonymous: null,
    message: [
      _createFileMessage({ name: file.name, file: file.url, size: file.size }),
    ],
    raw_message: '',
    font: 0,
    sender: {
      user_id,
      nickname: '',
      card: foundGroupMember?.card || foundGroupMember?.nickname || user_id.toString(), // TODO
      sex: '',
      age: 0,
      area: '',
      level: '',
      role: 'member', // TODO
    },
    time,
    self_id: -1,
  }
  const session = groupConvStore[group_id]
  if (session) {
    setGroupConvStore(group_id, 'list', (prev) => [...prev, groupMsgWsObject])
    return
  }

  setGroupConvStore(group_id, {
    type: 'group',
    nick: getGroupName(group_id),
    list: [groupMsgWsObject],
    id: group_id,
  })
}

export type { GroupFileNoticeWsObject }
export { dispatch as dispatchGroupFileNoticeWsObject }
