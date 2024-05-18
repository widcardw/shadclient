import { createSignal } from 'solid-js'
import type { SingleFriendInfo } from '../types/ws/private-user'
import type { SingleGroupInfo } from '../types/ws/group-info'
import type { PrivateMessageWsObject } from '../types/ws/message/private-message-ws-object'
import type { GroupMessageWsObject } from '../types/ws/message/group-message-ws-object'
import { createStore } from 'solid-js/store'

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

const [recentConversations, setRecentConversations] = createSignal<
  (SingleFriendInfo | SingleGroupInfo)[]
>([])

const [friendConvStore, setFriendConvStore] = createStore<
  Record<number, PrivateConversation>
>({})
const [groupConvStore, setGroupConvStore] = createStore<
  Record<number, GroupConversation>
>({})
const [groupMemberCard, setGroupMemberCard] = createStore<
  Record<number, Record<number, string>>
>({})
const [activeConv, setActiveConv] = createSignal<ConversationType>()

// const [forwardMap, setForwardMap] = createStore<Record<string, >>()

export {
  /** 最近打开的消息记录，仅包含“是谁”，不包含聊天内容 */
  recentConversations,
  setRecentConversations,
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
