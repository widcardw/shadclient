import type { CommonMetaEventWsObject } from './common-meta-ws-object'

interface HeartbeatMetaEventWsObject extends CommonMetaEventWsObject {
  meta_event_type: 'heartbeat'
  interval: number
  time: number
  self_id: number
  status: {
    app_enabled: boolean
    app_good: boolean
    app_initialized: boolean
    good: boolean
    online: boolean
  }
}

export type { HeartbeatMetaEventWsObject }
