import { createSignal } from 'solid-js'
import { createStore } from 'solid-js/store'
import type { SingleGroupInfo } from '../types/ws/group-info'
import type { GroupMessageWsObject } from '../types/ws/message/group-message-ws-object'
import type { PrivateMessageWsObject } from '../types/ws/message/private-message-ws-object'
import type { SingleFriendInfo } from '../types/ws/private-user-info'
import type { UnifyInfo } from '../types/ws/unify-info'

interface AbstractConversation {
  type: 'group' | 'private'
  id: number
  nick?: string
}

interface PrivateConversation extends AbstractConversation {
  type: 'private'
  list: PrivateMessageWsObject[]
}

interface GroupConversation extends AbstractConversation {
  type: 'group'
  list: GroupMessageWsObject[]
}

type ConversationType = PrivateConversation | GroupConversation

// 最近会话列表
const [recentList, setRecentList] = createSignal<
  UnifyInfo[]
>([])

// 存储所有好友的对话
const [friendConvStore, setFriendConvStore] = createStore<
  Record<number, PrivateConversation>
>({})

// 存储所有群聊的对话
const [groupConvStore, setGroupConvStore] = createStore<
  Record<number, GroupConversation>
>({})

// 存储已经发言过的群友的昵称或者名片
const [groupMemberCard, setGroupMemberCard] = createStore<
  Record<number, Record<number, string>>
>({})

// 当前主面板显示的聊天
const [activeConv, setActiveConv] = createSignal<ConversationType>()

// 存储所有转发的消息，现在转发消息感觉还有点 bug
// const [forwardMap, setForwardMap] = createStore<Record<string, >>()

export {
  /** 最近打开的消息记录，仅包含“是谁”，不包含聊天内容 */
  recentList,
  setRecentList,
  /** 与好友聊天的记录 */
  friendConvStore,
  setFriendConvStore,
  /** 与群聊聊天的记录 */
  groupConvStore,
  setGroupConvStore,
  /** 当前主面板显示的聊天，现在是包含了聊天内容的 */
  activeConv,
  setActiveConv,
  /** 群号中对应 QQ 号的用户的昵称 */
  groupMemberCard,
  setGroupMemberCard,
}
export type { PrivateConversation, GroupConversation, ConversationType }
