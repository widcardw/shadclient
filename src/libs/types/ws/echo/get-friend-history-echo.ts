import { setIsFetchingHistory } from '@/libs/states/semaphore'
import { setFriendConvStore } from '@/libs/states/sessions'
import type { WsActions } from '@/libs/ws/websocket'
import type { PrivateMessageWsObject } from '../message/private-message-ws-object'
import type { CommonEchoMessage, EchoedObject } from './common-echo'

interface FriendHistoryEcho extends CommonEchoMessage {
  data: { messages: PrivateMessageWsObject[] }
  echo: FriendHistoryEchoCarried
}

interface FriendHistoryEchoCarried extends EchoedObject {
  action: WsActions.GetFriendMsgHistory
  user_id: number
  e?: boolean
}

function dispatch(data: FriendHistoryEcho) {
  const messages = data.data.messages
  if (data.echo.e)
    messages.pop()
  const user_id = data.echo.user_id
  setFriendConvStore(user_id, 'list', (prev) => [...messages, ...prev])
  setIsFetchingHistory(false)
}

export type { FriendHistoryEcho, FriendHistoryEchoCarried }
export { dispatch as dispatchGetFriendHistoryEcho }
