import type { CommonWsObject } from '../common-ws-object'
import type { HeartbeatMetaEventWsObject } from './heartbeat-meta-ws-object'
import type { LifeCycleMetaEventWsObject } from './life-cycle-meta-ws-object'

interface CommonMetaEventWsObject extends CommonWsObject {
  post_type: 'meta_event'
  meta_event_type: string
}

type AllMetaEventWsObject =
  | LifeCycleMetaEventWsObject
  | HeartbeatMetaEventWsObject

export type { CommonMetaEventWsObject, AllMetaEventWsObject }
