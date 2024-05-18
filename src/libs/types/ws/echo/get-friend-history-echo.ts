import type { PrivateMessageWsObject } from '../message/private-message-ws-object'
import type { CommonEchoMessage } from './common-echo'

interface FriendHistoryEcho extends CommonEchoMessage {
  data: { messages: PrivateMessageWsObject[] }
}

export type { FriendHistoryEcho }
