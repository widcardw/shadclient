import type { CqReceivedMessage } from '../../messages/received-message'
import type { CommonMessageWsObject } from './common-message-ws-object'
import type { GroupUser } from '../group-user'
import { groupConvStore, setGroupConvStore } from '@/libs/states/sessions'
import { allGroups } from '@/components/conversation-list/group-list'

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
  return allGroups()?.find(g => g.group_id === group_id)?.group_name || `群聊-${group_id}`
}

function dispatch(data: GroupMessageWsObject) {
  const { group_id } = data
  const session = groupConvStore[group_id]
  if (session) {
    // // 处理群聊名称，但每次有消息进来的时候都处理一次有点逆天，不知道有没有什么好的办法
    // if (!session.nick || session.nick?.startsWith('群聊')) {
    //   setGroupConvStore(group_id, 'nick', getGroupName(group_id))
    // }
    // 将消息添加到会话
    setGroupConvStore(group_id, 'list', prev => [...prev, data])
    return
  }

  // 新建会话
  setGroupConvStore(group_id, {
    type: 'group',
    nick: getGroupName(group_id),
    list: [data],
    id: group_id
  })
}

export type { GroupMessageWsObject }
export { dispatch as dispatchGroupMessageWsObject, getGroupName }
