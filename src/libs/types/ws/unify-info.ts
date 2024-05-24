import type { SingleGroupInfo } from "./group-info"
import type { SingleFriendInfo } from "./private-user-info"

enum UnifyInfoType {
    None = 0,
    Group = 1,
    Private = 2,
}

interface AbstractInfo {
    type: UnifyInfoType
}

type UnifyInfo = SingleFriendInfo | SingleGroupInfo

export type {
    AbstractInfo, UnifyInfo,
}

export { UnifyInfoType }