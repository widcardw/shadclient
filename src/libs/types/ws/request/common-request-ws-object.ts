import type { CommonWsObject } from "../common-ws-object";
import type { FriendAddRequestWsObject } from "./friend-add-request-ws-object";
import type { GroupAddRequestWsObject } from "./group-add-request-ws-object";

interface CommonRequestWsObject extends CommonWsObject {
  post_type: 'request'
  time: number
  user_id: number
  request_type: 'friend' | 'group'
  comment: string
  flag: string
  read?: boolean
}

type AllRequestWsObject = FriendAddRequestWsObject | GroupAddRequestWsObject

export type { CommonRequestWsObject, AllRequestWsObject }
