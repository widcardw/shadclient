import { ws } from '@/libs/states/connection'
import {
  isFetchingHistory,
  setIsFetchingHistory,
} from '@/libs/states/semaphore'
import {
  activeId,
  activeType,
  groupConvStore,
  setGroupConvStore,
} from '@/libs/states/sessions'
import { WsActions } from '@/libs/ws/websocket'
import clsx from 'clsx'
import {
  type Component,
  For,
  Show,
  createEffect,
  createMemo,
  createSignal,
  onMount,
} from 'solid-js'
import { useIntersectionObserver, useStorage } from 'solidjs-use'
import { allGroups } from '../conversation-list/group-list'
import { Button } from '../ui/button'
import { Resizable, ResizableHandle, ResizablePanel } from '../ui/resizable'
import { Separator } from '../ui/separator'
import { InputArea } from './InputArea'
import { GroupFsDialog } from './fs/GroupFsDialog'
import { OnePieceOfGroupMessage } from './message/OnePieceOfMessage'

const GroupChat: Component<{ gid: number }> = (props) => {
  const group = createMemo(() =>
    allGroups().find((i) => i.group_id === props.gid),
  )

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

  // clamp messages
  const [singleClampSize] = useStorage('clamp-size', 100)
  const [clampIds, setClampIds] = createSignal(
    Array.from({ length: singleClampSize() }, (_, i) => i),
  )
  const [topEl, setTopEl] = createSignal<HTMLDivElement>()
  useIntersectionObserver(topEl, ([{ isIntersecting }]) => {
    if (isIntersecting) {
      const length = Math.min(clampIds().length + 20)
      setClampIds(Array.from({ length }, (_, i) => i))
    }
  })

  // unread
  const [bottomEl, setBottomEl] = createSignal<HTMLDivElement>()
  useIntersectionObserver(bottomEl, ([{ isIntersecting }]) => {
    if (isIntersecting) {
      setGroupConvStore(props.gid, 'unread', 0)
    }
  })

  // scroll to bottom when enter
  const [scrollerArea, setScrollerArea] = createSignal<HTMLElement>()
  const toBottom = () => {
    const el = scrollerArea()
    if (el) {
      el.scrollTop = el.scrollHeight
    }
  }

  onMount(() => {
    createEffect(() => {
      if (props.gid) {
        toBottom()
      }
    })
  })

  return (
    <Show when={group() !== undefined}>
      <div class="w-full h-100vh flex flex-col">
        <div class="px-4 py-1 flex items-center">
          <div class="font-bold mr-auto flex items-center">
            {group()?.group_memo || group()?.group_name} (
            {groupConvStore[group()?.group_id || 0]?.id},{' '}
            {groupConvStore[group()!.group_id || 0]?.list.length})
          </div>
          <Button
            variant="ghost"
            disabled={isFetchingHistory()}
            onClick={getGroupHistory}
          >
            <div class="i-teenyicons:history-outline" />
          </Button>
          <GroupFsDialog gid={activeId()} />
          <Button variant="ghost" onClick={toBottom}>
            <div class="i-teenyicons:arrow-down-circle-outline" />
          </Button>
        </div>
        <Separator />
        <Resizable
          orientation="vertical"
          class="flex-grow flex flex-col of-y-auto"
        >
          <ResizablePanel
            ref={(r: HTMLElement) => setScrollerArea(r)}
            initialSize={0.6}
            class={clsx(
              'flex-grow of-y-auto of-hidden flex flex-col space-y-2 p-2',
            )}
          >
            <div class="w-full h-1px m-0" ref={(r) => setTopEl(r)} />
            <For
              each={clampIds().slice(
                0,
                groupConvStore[group()?.group_id || 0].list.length || 0,
              )}
            >
              {(i) => {
                const l = groupConvStore[group()?.group_id || 0].list.length
                const idx = l - Math.min(clampIds().length, l) + i
                return (
                  <OnePieceOfGroupMessage
                    m={groupConvStore[group()?.group_id || 0]?.list[idx]}
                  />
                )
              }}
            </For>
            <pre class="hidden">
              <For each={Object.keys(groupConvStore[group()!.group_id].list)}>
                {(i) => <>i: {i}</>}
              </For>
            </pre>
            <div class="w-full h-1px m-0" ref={(r) => setBottomEl(r)} />
          </ResizablePanel>
          <ResizableHandle />
          <ResizablePanel initialSize={0.4}>
            <InputArea />
          </ResizablePanel>
        </Resizable>
      </div>
    </Show>
  )
}

export { GroupChat }
