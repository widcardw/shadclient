import { setIsSending } from '@/libs/states/semaphore'
import type { WsActions } from '@/libs/ws/websocket'
import type { CommonEchoMessage, EchoedObject } from './common-echo'

interface SendMsgEcho extends CommonEchoMessage {
  data: { message_id: number }
  echo: SendMsgEchoCarried
}

interface SendMsgEchoCarried extends EchoedObject {
  action: WsActions.SendGroupMsg | WsActions.SendPrivateMsg
}

function dispatch(data: SendMsgEcho) {
  setIsSending(false)
}

export type { SendMsgEcho }
export { dispatch as dispatchSendMsgEcho }
