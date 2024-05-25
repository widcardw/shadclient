import { sendEl } from '@/components/chat/InputArea'
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
  const el = sendEl()
  if (el) {
    el.value = ''
  }
}

export type { SendMsgEcho }
export { dispatch as dispatchSendMsgEcho }
