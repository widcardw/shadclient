import { groupConvStore, setGroupConvStore } from '@/libs/states/sessions'
import type { CommonNoticeWsObject } from './common-notice-ws-object'

interface GroupRecallNoticeWsObject extends CommonNoticeWsObject {
  notice_type: 'group_recall'
  group_id: number
  user_id: number
  message_id: number
  operator_id: number
  time: number
  self_id: number
}

function dispatch(data: GroupRecallNoticeWsObject) { 
  const { group_id } = data
  const session = groupConvStore[group_id]
  if (session) {
    // 将撤回的消息更新到会话中
    const i = session.list.findIndex(m => m.message_id === data.message_id)
    if (i !== -1) {
      setGroupConvStore(group_id, 'list', i, 'deleted', true)
    }
  }
}

export type { GroupRecallNoticeWsObject }
export { dispatch as dispatchGroupRecallNoticeWsObject }