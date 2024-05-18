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
   * 建群时间
   */
  group_create_time?: number
  /**
   * 群等级
   */
  group_level?: number
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
