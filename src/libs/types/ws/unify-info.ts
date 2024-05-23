import type { SingleGroupInfo } from "./group-info"
import type { SingleFriendInfo } from "./private-user-info"

enum UnifyInfoType {
    Group = 0,
    Private = 1,
}

interface AbstractInfo {
    type: UnifyInfoType
}

type UnifyInfo = SingleFriendInfo | SingleGroupInfo

export type {
    AbstractInfo, UnifyInfo,
}

export { UnifyInfoType }