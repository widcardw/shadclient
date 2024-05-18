import type { CommonWsObject } from '../common-ws-object'
import type { GroupMessageWsObject } from './group-message-ws-object'
import type { PrivateMessageWsObject } from './private-message-ws-object'

interface CommonMessageWsObject extends CommonWsObject {
  post_type: 'message'
  message_type: 'group' | 'private'
}

type AllMessageWsObject = GroupMessageWsObject | PrivateMessageWsObject

export type { CommonMessageWsObject, AllMessageWsObject }
