interface PrivateUser {
  user_id: number
  nickname: string
  sex?: string
  age?: number
}

type SingleFriendInfo = PrivateUser

export type { PrivateUser, SingleFriendInfo }
