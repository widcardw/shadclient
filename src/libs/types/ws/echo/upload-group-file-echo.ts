import type { WsActions } from '@/libs/ws/websocket'
import type { CommonEchoMessage, EchoedObject } from './common-echo'

interface UploadGroupFileEcho extends CommonEchoMessage {
  echo: UploadGroupFileEchoCarried
}

interface UploadGroupFileEchoCarried extends EchoedObject {
  action: WsActions.UploadGroupFile
}

export type { UploadGroupFileEcho, UploadGroupFileEchoCarried }
