// refer to src/libs/ws/websocket.ts WsActions

import type { WsActions } from '@/libs/ws/websocket'
import type { DeleteMsgEcho } from './delete-msg-echo'
import type { ForwardedEcho } from './forwarded-echo'
import type { FriendAddRequestEcho } from './friend-add-request-echo'
import type { FriendListEcho } from './friend-list-echo'
import type { FriendHistoryEcho } from './get-friend-history-echo'
import type { GroupHistoryEcho } from './get-group-history-echo'
import type {
  GroupFileUrlEcho,
  GroupFilesByFolderEcho,
  GroupRootFilesEcho,
} from './group-files-echo'
import type { GroupListEcho } from './group-list-echo'
import type { SendMsgEcho } from './send-msg-echo'

// echo will be concated into string and then returned by server
interface CommonEchoMessage {
  status: string
  retcode: number
  echo: string
}

type AllEchoTypes =
  | DeleteMsgEcho
  | ForwardedEcho
  | FriendListEcho
  | GroupListEcho
  | FriendHistoryEcho
  | GroupHistoryEcho
  | SendMsgEcho
  | GroupRootFilesEcho
  | GroupFileUrlEcho
  | GroupFilesByFolderEcho
  | FriendAddRequestEcho

interface BaseEcho {
  action: WsActions
}

type EchoedObject = BaseEcho & Record<string, any>

function buildEcho(action: WsActions, obj: Record<string, any>) {
  return JSON.stringify(Object.assign(obj, { action }))
}

export type { CommonEchoMessage, AllEchoTypes, EchoedObject }
export { buildEcho }
