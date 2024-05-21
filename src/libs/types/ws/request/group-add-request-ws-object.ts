import type { CommonRequestWsObject } from "./common-request-ws-object";

interface GroupAddRequestWsObject extends CommonRequestWsObject {
  request_type: 'group'
  sub_type: 'add' | 'invite'
  group_id: number
}

export type { GroupAddRequestWsObject }