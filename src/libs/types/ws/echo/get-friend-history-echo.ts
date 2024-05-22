import { setFriendConvStore } from '@/libs/states/sessions'
import type { WsActions } from '@/libs/ws/websocket'
import type { PrivateMessageWsObject } from '../message/private-message-ws-object'
import type { CommonEchoMessage } from './common-echo'

interface FriendHistoryEcho extends CommonEchoMessage {
  data: { messages: PrivateMessageWsObject[] }
  echo: FriendHistoryEchoCarried
}

interface FriendHistoryEchoCarried {
  action: WsActions.GetFriendMsgHistory
  user_id: number
}

function dispatch(data: FriendHistoryEcho) {
  const messages = data.data.messages
  messages.pop()
  const user_id = data.echo.user_id
  setFriendConvStore(user_id, 'list', (prev) => [...messages, ...prev])
}

export type { FriendHistoryEcho, FriendHistoryEchoCarried }
export { dispatch as dispatchGetFriendHistoryEcho }
