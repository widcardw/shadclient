import type { CommonEchoMessage } from "./common-echo";

interface FriendAddRequestEcho extends CommonEchoMessage {
  flag: string
  approve: boolean
  remark: string
}

export type { FriendAddRequestEcho }