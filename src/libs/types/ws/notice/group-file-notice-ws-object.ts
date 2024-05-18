import type { CommonNoticeWsObject } from './common-notice-ws-object'
import type { FileNotice } from './file-notice'

interface GroupFileNoticeWsObject extends CommonNoticeWsObject {
  notice_type: 'group_upload'
  group_id: number
  user_id: number
  file: FileNotice
  time: number
  self_id: number
}

export type { GroupFileNoticeWsObject }
