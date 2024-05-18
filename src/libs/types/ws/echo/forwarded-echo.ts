import { DELIMITER } from '@/libs/config'
import type { CommonNodeMessage } from '../../messages/common-message'
import type { CommonEchoMessage } from './common-echo'

interface ForwardedEcho extends CommonEchoMessage {
  data: {
    message: CommonNodeMessage[]
  }
}

export type { ForwardedEcho }
