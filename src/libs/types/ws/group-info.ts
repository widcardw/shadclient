interface SingleGroupInfo {
  /**
   * 群号
   */
  group_id: number
  /**
   * 群名
   */
  group_name: string
  /**
   * 群备注
   */
  group_memo?: string
  /**
   * 成员数
   */
  member_count?: number
  /**
   * 最大成员数
   */
  max_member_count?: number
}

export type { SingleGroupInfo }
