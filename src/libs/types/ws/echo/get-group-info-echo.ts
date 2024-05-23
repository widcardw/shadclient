import { setInviteStore } from '@/components/main-panel/notice-panel'
import type { WsActions } from '@/libs/ws/websocket'
import type { SingleGroupInfo } from '../group-info'
import type { CommonEchoMessage, EchoedObject } from './common-echo'

interface GetGroupInfoEcho extends CommonEchoMessage {
  data: SingleGroupInfo
  echo: GetGroupInfoEchoCarried
}

interface GetGroupInfoEchoCarried extends EchoedObject {
  action: WsActions.GetGroupInfo
  group_id: number
}

function dispatch(data: GetGroupInfoEcho) {
  const group_id = data.echo.group_id
  setInviteStore(group_id, data.data)
}

export { dispatch as dispatchGetGroupInfoEcho }
export type { GetGroupInfoEcho, GetGroupInfoEchoCarried }
