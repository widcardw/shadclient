import type { CommonNoticeWsObject } from './common-notice-ws-object'
import type { FileNotice } from './file-notice'

interface PrivateFileNoticeWsObject extends CommonNoticeWsObject {
  notice_type: 'offline_file'
  user_id: number
  file: FileNotice
  time: number
  self_id: number
}

export type { PrivateFileNoticeWsObject }
