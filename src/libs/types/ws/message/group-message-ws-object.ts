import { allGroups } from '@/components/conversation-list/group-list'
import {
  groupConvStore,
  groupMemberCard,
  setGroupConvStore,
  setGroupMemberCard,
} from '@/libs/states/sessions'
import { produce } from 'solid-js/store'
import type { CqReceivedMessage } from '../../messages/received-message'
import type { GroupUser } from '../group-user'
import { type CommonMessageWsObject, dedupAtMessage } from './common-message-ws-object'
import { groupMemberListStore, groupMemberSet, setGroupMemberListStore, setGroupMemberSet } from '@/components/chat/GroupMemberList'
import { ws } from '@/libs/states/connection'
import { WsActions } from '@/libs/ws/websocket'

interface GroupMessageWsObject extends CommonMessageWsObject {
  message_type: 'group'
  sub_type: string
  message_id: number
  group_id: number
  user_id: number
  anonymous: any
  message: CqReceivedMessage
  raw_message: string
  font: number
  sender: GroupUser
  time: number
  self_id: number
  deleted?: boolean
}

function getGroupName(group_id: number): string {
  return (
    allGroups()?.find((g) => g.group_id === group_id)?.group_name ||
    `群聊 ${group_id}`
  )
}

function dispatch(data: GroupMessageWsObject) {
  const { group_id, sender, raw_message } = data
  // 屏蔽空消息
  if (raw_message.trim() === '') return

  // 缓存已经发送过消息的用户的 card/nickname，用于被 @ 时将他显示出来
  // TODO: 现在可以不用这个了
  // 接收消息，先查找有没有这个群，没有则发送 echo 来获取群员列表
  // 有这个群，但没有这个成员（这时会出现一个查询操作，相当耗时），则将这个成员插入到表里面
  // 有群，有成员，直接跳过
  if (!groupMemberListStore[group_id]) {
    ws()?.send(WsActions.GetGroupMemberList, { group_id }, { gid: group_id })
  }
  else if (!groupMemberSet[group_id].has(sender.user_id)) {
    // TODO: add the user, then add the user id to the set
    setGroupMemberListStore(group_id, groupMemberListStore[group_id].length, {
      ...sender,
      last_sent_time: data.time,
    })
    setGroupMemberSet(group_id, s => {
      s.add(sender.user_id)
      return s
    })
  }
  // if (!groupMemberCard[group_id]?.[sender.user_id]) {
  //   setGroupMemberCard(group_id, {
  //     [sender.user_id]: sender.card || sender.nickname,
  //   })
  // }

  const session = groupConvStore[group_id]
  data.message = dedupAtMessage(data.message)

  if (session) {
    // // 处理群聊名称，但每次有消息进来的时候都处理一次有点逆天，不知道有没有什么好的办法
    // if (!session.nick || session.nick?.startsWith('群聊')) {
    //   setGroupConvStore(group_id, 'nick', getGroupName(group_id))
    // }
    // 将消息添加到会话
    // setGroupConvStore(group_id, 'list', (prev) => [...prev, data])
    // setGroupConvStore(group_id, 'unread', (prev) => prev + 1)
    setGroupConvStore(group_id, produce((conv) => {
      conv.list = [...conv.list, data]
      conv.unread = conv.unread + 1
    }))
    return
  }

  // 新建会话
  setGroupConvStore(group_id, {
    type: 'group',
    nick: getGroupName(group_id),
    list: [data],
    unread: 1,
    id: group_id,
  })
}

export type { GroupMessageWsObject }
export { dispatch as dispatchGroupMessageWsObject, getGroupName }
