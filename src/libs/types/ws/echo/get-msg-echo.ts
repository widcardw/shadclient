import type { WsActions } from '@/libs/ws/websocket'
import type { CommonEchoMessage, EchoedObject } from './common-echo'

interface GetMsgEcho extends CommonEchoMessage {
  echo: GetMsgEchoCarried
}

interface GetMsgEchoCarried extends EchoedObject {
  action: WsActions.GetMsg
  msg_id: number
}

// TODO
function dispatch(data: GetMsgEcho) {}

export type { GetMsgEcho, GetMsgEchoCarried }
export { dispatch as dispatchGetMsgEcho }