import { createMemo, createSignal } from 'solid-js'
import type { FriendAddRequestWsObject } from '../types/ws/request/friend-add-request-ws-object'
import type { GroupAddRequestWsObject } from '../types/ws/request/group-add-request-ws-object'

const [friendRequests, setFriendRequests] = createSignal<
  FriendAddRequestWsObject[]
>([])
const [groupRequests, setGroupRequests] = createSignal<
  GroupAddRequestWsObject[]
>([])

const unreadCount = createMemo(
  () =>
    friendRequests().filter((i) => i.read !== true).length +
    groupRequests().filter((i) => i.read !== true).length,
)

export {
  friendRequests,
  setFriendRequests,
  groupRequests,
  setGroupRequests,
  unreadCount,
}
