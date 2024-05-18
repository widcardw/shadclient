interface GroupUser {
  user_id: number
  nickname: string
  card: string
  sex: string
  age: number
  area: string
  level: string
  role: 'owner' | 'admin' | 'member'
  title?: string
}

export type { GroupUser }
