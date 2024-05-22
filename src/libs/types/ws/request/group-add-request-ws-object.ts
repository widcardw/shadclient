import { setGroupRequests } from '@/libs/states/requests'
import type { CommonRequestWsObject } from './common-request-ws-object'

interface GroupAddRequestWsObject extends CommonRequestWsObject {
  request_type: 'group'
  sub_type: 'add' | 'invite'
  group_id: number
}

function dispatch(data: GroupAddRequestWsObject) {
  // add the notice to notice tab, and set the remark of this new friend
  setGroupRequests((prev) => [{ ...data, read: false }, ...prev])
}

export type { GroupAddRequestWsObject }
export { dispatch as dispatchGroupAddRequestWsObject }
