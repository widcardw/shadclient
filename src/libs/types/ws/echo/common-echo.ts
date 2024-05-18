// refer to src/libs/ws/websocket.ts WsActions

import { DELIMITER } from '@/libs/config'
import type { DeleteMsgEcho } from './delete-msg-echo'
import type { ForwardedEcho } from './forwarded-echo'
import type { FriendListEcho } from './friend-list-echo'
import type { GroupListEcho } from './group-list-echo'
import type { FriendHistoryEcho } from './get-friend-history-echo'
import type { GroupHistoryEcho } from './get-group-history-echo'
import type { SendMsgEcho } from './send-msg-echo'
import type {
  GroupFileUrlEcho,
  GroupFilesByFolderEcho,
  GroupRootFilesEcho,
} from './group-files-echo'

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

function buildEcho(...args: string[]) {
  return args.concat(DELIMITER)
}

export type { CommonEchoMessage, AllEchoTypes }
export { buildEcho }
