import type { MultiTypeReceivedMessage } from '../../messages/received-message'
import type { CommonWsObject } from '../common-ws-object'
import type { GroupMessageWsObject } from './group-message-ws-object'
import type { PrivateMessageWsObject } from './private-message-ws-object'

interface CommonMessageWsObject extends CommonWsObject {
  post_type: 'message'
  message_type: 'group' | 'private'
}

type AllMessageWsObject = GroupMessageWsObject | PrivateMessageWsObject

function dedupAtMessage(message: MultiTypeReceivedMessage[]): MultiTypeReceivedMessage[] {
  // 去除重复的 at 消息
  const atMap = new Set<number>()
  for (let i = message.length - 1; i >= 0; i--) {
    const item = message[i]
    if (item.type === 'at') {
      if (atMap.has(item.data.qq)) {
        message.splice(i, 1)
      } else {
        atMap.add(item.data.qq)
      }
    }
  }
  return message
}

export type { CommonMessageWsObject, AllMessageWsObject }

export { dedupAtMessage }