import type { SingleGroupInfo } from '../group-info'
import type { CommonEchoMessage } from './common-echo'

interface GroupListEcho extends CommonEchoMessage {
  data: SingleGroupInfo[]
}

export type { GroupListEcho }
