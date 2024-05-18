import type { CommonWsObject } from '../common-ws-object'

interface CommonNoticeWsObject extends CommonWsObject {
  post_type: 'notice'
  notice_type:
    | 'group_upload'
    | 'offline_file'
    | 'friend_recall'
    | 'group_recall'
    | 'poke'
    | 'friend_add'
}

export type { CommonNoticeWsObject }
