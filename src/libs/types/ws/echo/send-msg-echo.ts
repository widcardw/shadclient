import type { CommonEchoMessage } from './common-echo'

interface SendMsgEcho extends CommonEchoMessage {
  data: {
    message_id: number
  }
}

export type { SendMsgEcho }
