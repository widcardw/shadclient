import type { CommonWsObject } from '../common-ws-object'
import type { FriendAddNoticeWsObject } from './friend-add-notice-ws-object'
import type { GroupFileNoticeWsObject } from './group-file-notice-ws-object'
import type { GroupRecallNoticeWsObject } from './group-recall-notice-ws-object'
import type { PrivateFileNoticeWsObject } from './private-file-notice-ws-object'
import type { PrivatePokeNoticeWsObject } from './private-poke-notice-ws-object'
import type { PrivateRecallNoticeWsObject } from './private-recall-notice-ws-object'

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

type AllNoticeWsObject =
  | FriendAddNoticeWsObject
  | GroupFileNoticeWsObject
  | GroupRecallNoticeWsObject
  | PrivateFileNoticeWsObject
  | PrivatePokeNoticeWsObject
  | PrivateRecallNoticeWsObject

export type { CommonNoticeWsObject, AllNoticeWsObject }
