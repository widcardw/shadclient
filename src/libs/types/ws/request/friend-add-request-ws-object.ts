import { setFriendRequests } from '@/libs/states/requests'
import type { CommonRequestWsObject } from './common-request-ws-object'

interface FriendAddRequestWsObject extends CommonRequestWsObject {
  request_type: 'friend'
}

function dispatch(data: FriendAddRequestWsObject) {
  // add the notice to notice tab, and set the remark of this new friend
  setFriendRequests((prev) => [{ ...data, read: false }, ...prev])
}

export type { FriendAddRequestWsObject }
export { dispatch as dispatchFriendAddRequestWsObject }
