import { setAllGroups } from '@/components/conversation-list/group-list'
import type { WsActions } from '@/libs/ws/websocket'
import type { SingleGroupInfo } from '../group-info'
import type { CommonEchoMessage, EchoedObject } from './common-echo'

interface GroupListEcho extends CommonEchoMessage {
  data: SingleGroupInfo[]
  echo: GroupListEchoCarried
}

interface GroupListEchoCarried extends EchoedObject {
  action: WsActions.GetGroupList
}

function dispatch(data: GroupListEcho) {
  setAllGroups(data.data)
}

export type { GroupListEcho, GroupListEchoCarried }
export { dispatch as dispatchGroupListEcho }
