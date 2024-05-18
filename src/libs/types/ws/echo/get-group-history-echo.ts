import type { GroupMessageWsObject } from '../message/group-message-ws-object'
import type { CommonEchoMessage } from './common-echo'

interface GroupHistoryEcho extends CommonEchoMessage {
  data: { messages: GroupMessageWsObject[] }
}

export type { GroupHistoryEcho }
