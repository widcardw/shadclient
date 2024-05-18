import type { CqReceivedMessage } from '../../messages/received-message'
import type { CommonMessageWsObject } from './common-message-ws-object'
import type { PrivateUser } from '../private-user'

interface PrivateMessageWsObject extends CommonMessageWsObject {
  message_type: 'private'
  sub_type: string
  message_id: number
  user_id: number
  message: CqReceivedMessage
  raw_message: string
  font: number
  sender: PrivateUser
  target_id: number
  time: number
  self_id: number
}

export type { PrivateMessageWsObject }
