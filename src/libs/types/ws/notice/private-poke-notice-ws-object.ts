import type { CommonNoticeWsObject } from './common-notice-ws-object'

interface PrivatePokeNoticeWsObject extends CommonNoticeWsObject {
  sender_id: number
  user_id: number
  target_id: number
  notice_type: 'poke'
  time: number
  self_id: number
}

export type { PrivatePokeNoticeWsObject }
