import type { CqReceivedMessage } from '../../messages/received-message'
import type { CommonMessageWsObject } from './common-message-ws-object'
import type { GroupUser } from '../group-user'

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
}

export type { GroupMessageWsObject }
