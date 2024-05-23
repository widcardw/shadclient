import { createStore } from 'solid-js/store'
import type { FriendAddRequestWsObject } from '../types/ws/request/friend-add-request-ws-object'
import type { GroupAddRequestWsObject } from '../types/ws/request/group-add-request-ws-object'

const [friendRequests, setFriendRequests] = createStore<
  FriendAddRequestWsObject[]
>([])
const [groupRequests, setGroupRequests] = createStore<
  GroupAddRequestWsObject[]
>([])

export {
  friendRequests,
  setFriendRequests,
  groupRequests,
  setGroupRequests,
}
