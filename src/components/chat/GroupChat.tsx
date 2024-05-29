import { ws } from '@/libs/states/connection'
import {
  isFetchingHistory,
  setIsFetchingHistory,
} from '@/libs/states/semaphore'
import { activeId, activeType, groupConvStore } from '@/libs/states/sessions'
import { WsActions } from '@/libs/ws/websocket'
import { type Component, For, Show, createEffect, createMemo } from 'solid-js'
import { allGroups } from '../conversation-list/group-list'
import { Button } from '../ui/button'
import { Resizable, ResizableHandle, ResizablePanel } from '../ui/resizable'
import { Separator } from '../ui/separator'
import { InputArea } from './InputArea'
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

  return (
    <Show when={group() !== undefined}>
      <div class="w-full h-100vh flex flex-col">
        <div class="px-4 py-1 flex items-center">
          <div class="font-bold mr-auto flex items-center">
            {group()!.group_memo || group()!.group_name} ({activeId()},{' '}
            {activeType()}, {groupConvStore[group()!.group_id].list.length})
          </div>
          <Button
            variant="ghost"
            disabled={isFetchingHistory()}
            onClick={getGroupHistory}
          >
            <div class="i-teenyicons:history-outline" />
          </Button>
          <Button variant="ghost">
            <div class="i-teenyicons:folder-outline" />
          </Button>
          <Button variant="ghost">
            <div class="i-teenyicons:arrow-down-circle-outline" />
          </Button>
        </div>
        <Separator />
        <Resizable
          orientation="vertical"
          class="flex-grow flex flex-col of-y-auto"
        >
          <ResizablePanel
            initialSize={0.6}
            class="flex-grow of-y-auto of-hidden flex flex-col gap-2 p-2"
          >
            <For each={groupConvStore[group()!.group_id].list}>
              {(i) => <OnePieceOfGroupMessage m={i} />}
            </For>
            <pre class="hidden">
              <For each={Object.keys(groupConvStore[group()!.group_id].list)}>
                {(i) => <>i: {i}</>}
              </For>
            </pre>
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
