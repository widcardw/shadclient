import type { WsActions } from '@/libs/ws/websocket'
import type { CommonEchoMessage, EchoedObject } from './common-echo'

interface GroupAddRequestEcho extends CommonEchoMessage {
  echo: GroupAddRequestEchoCarried
}

interface GroupAddRequestEchoCarried extends EchoedObject {
  action: WsActions.SetGroupAddRequest
  group_id: number
  sub_type: 'add' | 'invite'
}

export type { GroupAddRequestEcho, GroupAddRequestEchoCarried }
