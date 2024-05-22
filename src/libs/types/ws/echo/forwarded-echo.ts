import { setForwardStore } from '@/libs/states/forward'
import type { WsActions } from '@/libs/ws/websocket'
import type { CommonNodeMessage } from '../../messages/common-message'
import type { CommonEchoMessage, EchoedObject } from './common-echo'

interface ForwardedEcho extends CommonEchoMessage {
  data: { message: CommonNodeMessage[] }
  echo: ForwardedEchoCarried
}

interface ForwardedEchoCarried extends EchoedObject {
  action: WsActions.GetForwardMsg
  fid: string
}

function dispatch(data: ForwardedEcho) {
  const fid = data.echo.fid
  const messages = data.data.message
  setForwardStore(fid, messages)
}

export type { ForwardedEcho }
export { dispatch as dispatchForwardedEcho }
