import {
  activeId,
  activeType,
  cleanUpFriendHistoryTo,
  cleanUpGroupHistoryTo,
  friendConvStore,
  groupConvStore,
  recentList,
  setActiveConv,
  setActiveId,
  setActiveType,
  setFriendConvStore,
  setGroupConvStore,
  setRecentList,
} from '@/libs/states/sessions'
import type { SingleGroupInfo } from '@/libs/types/ws/group-info'
import { getGroupName } from '@/libs/types/ws/message/group-message-ws-object'
import type { SingleFriendInfo } from '@/libs/types/ws/private-user-info'
import { type UnifyInfo, UnifyInfoType } from '@/libs/types/ws/unify-info'
import { type Component, For, Show, createMemo, createSignal } from 'solid-js'
import { useDebounceFn, useStorage } from 'solidjs-use'
import { Badge } from '../ui/badge'
import { Button } from '../ui/button'
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuTrigger,
} from '../ui/context-menu'
import { Separator } from '../ui/separator'
import { TextField, TextFieldRoot } from '../ui/textfield'

const FriendButton: Component<{ i: SingleFriendInfo }> = (props) => {
  const changeTab = (o: SingleFriendInfo) => {
    // setActiveConv(UnifyInfoType.Private, o.user_id)
    setActiveType(UnifyInfoType.Private)
    setActiveId(o.user_id)
    setFriendConvStore(o.user_id, 'unread', 0)
  }
  return (
    <Button
      variant={
        activeType() === UnifyInfoType.Private && activeId() === props.i.user_id
          ? 'secondary'
          : 'ghost'
      }
      class="block w-full flex justify-between gap-2"
      onClick={() => changeTab(props.i)}
    >
      {props.i.remark || props.i.nickname || props.i.user_id}
      <Show when={friendConvStore[props.i.user_id].unread}>
        <span class="text-gray">{friendConvStore[props.i.user_id].unread}</span>
      </Show>
    </Button>
  )
}

const GroupButton: Component<{ i: SingleGroupInfo }> = (props) => {
  const changeTab = (o: SingleGroupInfo) => {
    // setActiveConv(UnifyInfoType.Group, o.group_id)
    setActiveType(UnifyInfoType.Group)
    setActiveId(o.group_id)
    setGroupConvStore(o.group_id, 'unread', 0)
    if (groupConvStore[o.group_id]?.nick?.startsWith('群聊')) {
      setGroupConvStore(o.group_id, 'nick', getGroupName(o.group_id))
    }
  }
  return (
    <Button
      variant={
        activeType() === UnifyInfoType.Group && activeId() === props.i.group_id
          ? 'secondary'
          : 'ghost'
      }
      class="block w-full flex justify-between gap-2"
      onClick={() => changeTab(props.i)}
    >
      <span class="of-x-hidden text-ellipsis">
        {props.i.group_memo || props.i.group_name || `群聊 ${props.i.group_id}`}
      </span>
      <Show when={groupConvStore[props.i.group_id].unread}>
        <Badge variant="default">{groupConvStore[props.i.group_id].unread}</Badge>
      </Show>
    </Button>
  )
}

/**
 * 最近会话列表，包含了私聊和群聊的一个个小的实例
 */
const RecentConversationList: Component = () => {
  const [search, setSearch] = createSignal('')
  const filteredRecentList = createMemo(() => {
    const trimSearch = search().trim()
    if (trimSearch === '') return recentList()
    return recentList().filter((i) => {
      switch (i.type) {
        case UnifyInfoType.Group: {
          return (
            i.group_memo?.includes(trimSearch) ||
            i.group_name.includes(trimSearch)
          )
        }
        case UnifyInfoType.Private: {
          i.remark?.includes(trimSearch) || i.nickname.includes(trimSearch)
        }
      }
    })
  })

  const debouncedSearch = useDebounceFn((e: InputEvent) => {
    setSearch((e.target as HTMLInputElement).value)
  }, 500)

  const markAsRead = (o: UnifyInfo) => {
    if (o.type === UnifyInfoType.Private) {
      setFriendConvStore(o.user_id, 'unread', 0)
    } else {
      setGroupConvStore(o.group_id, 'unread', 0)
    }
  }

  const hideList = (o: UnifyInfo) => {
    let idx = -1
    if (o.type === UnifyInfoType.Private) {
      idx = recentList().findIndex(
        (i) => i.type === UnifyInfoType.Private && i.user_id === o.user_id,
      )
    } else if (o.type === UnifyInfoType.Group) {
      idx = recentList().findIndex(
        (i) => i.type === UnifyInfoType.Group && i.group_id === o.group_id,
      )
    }
    if (idx !== -1) {
      setRecentList((prev) => prev.filter((_, i) => i !== idx))
    }
    return idx
  }

  const removeAndDeleteHistory = (o: UnifyInfo) => {
    const idx = hideList(o)
    if (idx !== -1) {
      if (o.type === UnifyInfoType.Private) {
        setFriendConvStore(o.user_id, 'list', [])
      } else {
        setGroupConvStore(o.group_id, 'list', [])
      }
    }
  }

  const [clampSize] = useStorage('clamp-size', 60)

  const cleanHistory = (o: UnifyInfo) => {
    if (o.type === UnifyInfoType.Private) {
      cleanUpFriendHistoryTo(o.user_id, clampSize())
    } else if (o.type === UnifyInfoType.Group) {
      cleanUpGroupHistoryTo(o.group_id, clampSize())
    }
  }

  return (
    <div class="h-100vh flex flex-col">
      <TextFieldRoot class="block w-full sticky p-1">
        <TextField
          placeholder="Search"
          value={search()}
          onInput={(e: InputEvent) => debouncedSearch(e)}
        />
      </TextFieldRoot>
      <Separator />
      <div class="flex-grow of-y-auto flex flex-col gap-1 p-1">
        <Show
          when={filteredRecentList().length > 0}
          fallback={<div class="p-4">Empty here.</div>}
        >
          <For each={filteredRecentList()}>
            {(i) => (
              <ContextMenu>
                <ContextMenuTrigger>
                  <Show
                    when={i.type === UnifyInfoType.Private}
                    fallback={<GroupButton i={i as SingleGroupInfo} />}
                  >
                    <FriendButton i={i as SingleFriendInfo} />
                  </Show>
                </ContextMenuTrigger>
                <ContextMenuContent>
                  <ContextMenuItem inset onClick={() => markAsRead(i)}>
                    Mark as read
                  </ContextMenuItem>
                  <ContextMenuSeparator />
                  <ContextMenuItem inset onClick={() => hideList(i)}>
                    Hide
                  </ContextMenuItem>
                  <ContextMenuItem inset class="text-red" onClick={() => cleanHistory(i)}>
                    Clean history to {clampSize()} msgs
                  </ContextMenuItem>
                  <ContextMenuItem inset class="text-red" onClick={() => removeAndDeleteHistory(i)}>
                    Remove and delete history
                  </ContextMenuItem>
                </ContextMenuContent>
              </ContextMenu>
            )}
          </For>
        </Show>
      </div>
    </div>
  )
}

export default RecentConversationList
