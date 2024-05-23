import type { AbstractInfo, UnifyInfoType } from "./unify-info"

interface SingleFriendInfo extends AbstractInfo {
  type: UnifyInfoType.Private
  user_id: number
  nickname: string
  remark?: string
}

export type { SingleFriendInfo }
