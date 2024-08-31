import { ws } from '@/libs/states/connection'
import {
  isFetchingHistory,
  setIsFetchingHistory,
} from '@/libs/states/semaphore'
import {
  activeId, cleanUpGroupHistoryTo,
  groupConvStore,
  setGroupConvStore
} from '@/libs/states/sessions'
import { WsActions } from '@/libs/ws/websocket'
import clsx from 'clsx'
import {
  type Component,
  For,
  Show, createMemo,
  createSignal, onMount
} from 'solid-js'
import {
  toAccessor, useScroll,
  useStorage,
  whenever
} from 'solidjs-use'
import { allGroups } from '../conversation-list/group-list'
import { CarbonClean } from '../icons/cleanup-icon'
import { Button } from '../ui/button'
import { Resizable, ResizableHandle, ResizablePanel } from '../ui/resizable'
import { Separator } from '../ui/separator'
import { InputArea } from './InputArea'
import { GroupFsDialog } from './fs/GroupFsDialog'
import { OnePieceOfGroupMessage } from './message/OnePieceOfMessage'

import './scroller.css'
import { GroupMemberListComp, groupMemberListStore } from './GroupMemberList'

const GroupChat: Component<{ gid: number }> = (props) => {
  const group = createMemo(() =>
    allGroups().find((i) => i.group_id === props.gid),
  )
  const [groupUsersVis, setGroupUsersVis] = createSignal(false)

  const getGroupHistory = () => {
    const first = groupConvStore[group()!.group_id]?.list?.[0]?.message_id
    console.log('get group history, message_id:', first)
    let body = { group_id: group()!.group_id, count: 17 }
    if (first !== undefined) {
      body = Object.assign(body, { message_id: first, message_seq: first })
    }
    setIsFetchingHistory(true)
    ws()?.send(WsActions.GetGroupMsgHistory, body, {
      group_id: group()!.group_id,
      e: first !== undefined,
    })
  }

  // scroll to bottom when enter
  const [scrollerArea, setScrollerArea] = createSignal<HTMLElement>()
  const { arrivedState, directions } = useScroll(scrollerArea)
  const toBottom = () => {
    const el = scrollerArea()
    if (el) {
      el.scrollTop = el.scrollHeight
    }
  }

  onMount(() => {
    // move to bottom when entering
    whenever(
      toAccessor(() => props.gid),
      () => {
        toBottom()
        setGroupUsersVis(false)
      },
      { defer: true },
    )
    // set unread count
    whenever(
      toAccessor(() => arrivedState.bottom && directions.bottom),
      () => {
        if (groupConvStore[props.gid]) setGroupConvStore(props.gid, 'unread', 0)
      },
      { defer: true },
    )
  })

  const [clampSize] = useStorage('clamp-size', 100)

  const toggleUsersVis = () => {
    if (!groupMemberListStore[props.gid]) {
      console.log('try to get group member list')
      ws()?.send(WsActions.GetGroupMemberList, { group_id: props.gid }, { gid: props.gid })
    }
    setGroupUsersVis(v => !v)
  }

  return (
    <Show when={group() !== undefined}>
      <div class="w-full h-100vh flex">
        {/* 群聊主界面 */}
        <div class="w-full h-100vh flex flex-col">
          {/* 顶部工具栏 */}
          <div class="p-1 flex items-center">
            <Button
              variant="ghost"
              class="font-bold mr-auto flex items-center"
              onClick={toggleUsersVis}
            >
              {group()?.group_memo || group()?.group_name} (
              {groupConvStore[group()?.group_id || 0]?.id},{' '}
              {groupConvStore[group()!.group_id || 0]?.list.length})
            </Button>
            <Button
              variant="ghost"
              disabled={isFetchingHistory()}
              onClick={getGroupHistory}
            >
              <div class="i-teenyicons:history-outline" />
            </Button>
            <Button variant="ghost" onClick={() => cleanUpGroupHistoryTo(props.gid, clampSize())}>
              <CarbonClean />
            </Button>
            <GroupFsDialog gid={activeId()} />
            <Button variant="ghost" onClick={toBottom}>
              <div class="i-teenyicons:arrow-down-circle-outline" />
            </Button>
          </div>
          <Separator />
          {/* 聊天界面 */}
          <Resizable
            orientation="vertical"
            class="flex-grow flex flex-col of-y-auto"
          >
            {/* 信息 */}
            <ResizablePanel
              ref={(r: HTMLElement) => setScrollerArea(r)}
              initialSize={0.6}
              class={clsx(
                'flex-grow of-y-auto of-hidden flex flex-col space-y-3 p-2',
                'scroller',
              )}
            >
              <For each={groupConvStore[group()?.group_id || 0].list}>
                {(i) => <OnePieceOfGroupMessage m={i} />}
              </For>
              {/* <pre class="hidden">
                <For each={Object.keys(groupConvStore[group()!.group_id].list)}>
                  {(i) => <>i: {i}</>}
                </For>
              </pre> */}
            </ResizablePanel>
            <ResizableHandle />
            {/* 输入框 */}
            <ResizablePanel initialSize={0.4}>
              <InputArea />
            </ResizablePanel>
          </Resizable>
        </div>
        <Show when={groupUsersVis()}>
          <Separator orientation="vertical" />
          <GroupMemberListComp gid={props.gid} />
        </Show>
      </div>
    </Show>
  )
}

export { GroupChat }
