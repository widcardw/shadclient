import type { WsActions } from '@/libs/ws/websocket'
import { toast } from 'solid-sonner'
import type { CommonEchoMessage, EchoedObject } from './common-echo'

interface DeleteMsgEcho extends CommonEchoMessage {
  echo: DeleteMsgCarried
}

interface DeleteMsgCarried extends EchoedObject {
  action: WsActions.DeleteMsg
}

function dispatch(data: DeleteMsgEcho) {
  toast('Recalled a message.')
}

export type { DeleteMsgEcho, DeleteMsgCarried }
export { dispatch as dispatchDeleteMsgEcho }
