import type { WsActions } from "@/libs/ws/websocket";
import type { GroupUser } from "../group-user";
import type { CommonEchoMessage, EchoedObject } from "./common-echo";
import { setGroupMemberListStore, setGroupMemberSet } from "@/components/chat/GroupMemberList";

interface GotMemberInfo extends GroupUser {
  join_time?: number
  last_sent_time: number
  title?: string
  title_expire_time?: number
  card_chargeable?: boolean
}

interface GetGroupMemberListEcho extends CommonEchoMessage {
  data: GotMemberInfo[]
  echo: GetGroupMemberListEchoCarried
}

interface GetGroupMemberListEchoCarried extends EchoedObject {
  action: WsActions.GetGroupMemberList
  gid: number
}

/** TODO */
function dispatch(data: GetGroupMemberListEcho) {
  const gid = data.echo.gid
  setGroupMemberListStore(gid, data.data.filter(i =>
    ((Date.now() / 1000 - i.last_sent_time) <= 5 * 24 * 3600) ||
    i.role === 'owner' ||
    i.role === 'admin')
  )
  setGroupMemberSet(gid, new Set(data.data.map(i => i.user_id)))
}

export type { GotMemberInfo, GetGroupMemberListEcho, GetGroupMemberListEchoCarried }
export { dispatch as dispatchGetGroupMemberListEcho }
