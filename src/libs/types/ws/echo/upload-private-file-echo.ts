import type { WsActions } from '@/libs/ws/websocket'
import type { CommonEchoMessage, EchoedObject } from './common-echo'

interface UploadPrivateFileEcho extends CommonEchoMessage {
  echo: UploadPrivateFileEchoCarried
}

interface UploadPrivateFileEchoCarried extends EchoedObject {
  action: WsActions.UploadPrivateFile
}

export type { UploadPrivateFileEcho, UploadPrivateFileEchoCarried }
