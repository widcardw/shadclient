import type { CommonMetaEventWsObject } from './common-meta-ws-object'

interface LifeCycleMetaEventWsObject extends CommonMetaEventWsObject {
  meta_event_type: 'lifecycle'
  self_id: number
  sub_type: 'connect' | 'enable' | 'disable'
  time: number
}

export type { LifeCycleMetaEventWsObject }
