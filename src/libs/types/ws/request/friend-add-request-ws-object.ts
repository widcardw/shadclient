import type { CommonRequestWsObject } from "./common-request-ws-object";

interface FriendAddRequestWsObject extends CommonRequestWsObject {
  request_type: 'friend'
}

export type { FriendAddRequestWsObject }
