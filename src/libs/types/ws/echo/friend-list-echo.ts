import { setAllFriends } from '@/components/conversation-list/friend-list'
import type { WsActions } from '@/libs/ws/websocket'
import type { SingleFriendInfo } from '../private-user'
import type { CommonEchoMessage, EchoedObject } from './common-echo'

interface FriendListEcho extends CommonEchoMessage {
  data: SingleFriendInfo[]
  echo: FriendListEchoCarried
}

interface FriendListEchoCarried extends EchoedObject {
  action: WsActions.GetFriendList
}

function dispatch(data: FriendListEcho) {
  setAllFriends(data.data)
}

export type { FriendListEcho }
export { dispatch as dispatchGetFriendListEcho }
