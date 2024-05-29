import { setIsFetchingHistory } from '@/libs/states/semaphore'
import { setGroupConvStore } from '@/libs/states/sessions'
import type { WsActions } from '@/libs/ws/websocket'
import type { GroupMessageWsObject } from '../message/group-message-ws-object'
import type { CommonEchoMessage, EchoedObject } from './common-echo'

interface GroupHistoryEcho extends CommonEchoMessage {
  data: { messages: GroupMessageWsObject[] }
  echo: GroupHistoryEchoCarried
}

interface GroupHistoryEchoCarried extends EchoedObject {
  action: WsActions.GetGroupMsgHistory
  group_id: number
  e?: boolean
}

function dispatch(data: GroupHistoryEcho) {
  const messages = data.data.messages
  if (data.echo.e)
    messages.pop()
  const group_id = data.echo.group_id
  setGroupConvStore(group_id, 'list', (prev) => [...messages, ...prev])
  setIsFetchingHistory(false)
}

export type { GroupHistoryEcho, GroupHistoryEchoCarried }
export { dispatch as dispatchGroupHistoryEcho }
