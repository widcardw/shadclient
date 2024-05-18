import type { SingleFriendInfo } from '../private-user'
import type { CommonEchoMessage } from './common-echo'

interface FriendListEcho extends CommonEchoMessage {
  data: SingleFriendInfo[]
}

export type { FriendListEcho }
