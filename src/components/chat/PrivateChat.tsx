import { ws } from '@/libs/states/connection'
import {
  isFetchingHistory,
  setIsFetchingHistory,
} from '@/libs/states/semaphore'
import { friendConvStore, setFriendConvStore } from '@/libs/states/sessions'
import { WsActions } from '@/libs/ws/websocket'
import {
  type Component,
  For,
  Show,
  createEffect,
  createMemo,
  createSignal,
  onCleanup,
  onMount,
} from 'solid-js'
import { allFriends } from '../conversation-list/friend-list'
import { Button } from '../ui/button'
import { Resizable, ResizableHandle, ResizablePanel } from '../ui/resizable'
import { Separator } from '../ui/separator'
import { InputArea } from './InputArea'
import { OnePieceOfPrivateMessage } from './message/OnePieceOfMessage'

const PrivateChat: Component<{ uid: number }> = (props) => {
  const friend = createMemo(
    () => allFriends().find((i) => i.user_id === props.uid)!,
  )

  const getPrivateHistory = () => {
    const first = friendConvStore[friend()!.user_id]?.list?.[0]?.message_id
    console.log('get private history, message_id:', first)
    let body = { user_id: friend()!.user_id, count: 17 }
    if (first !== undefined) {
      body = Object.assign(body, { message_id: first, message_seq: first })
    }
    setIsFetchingHistory(true)
    ws()?.send(WsActions.GetFriendMsgHistory, body, {
      user_id: friend()!.user_id,
      e: first !== undefined,
    })
  }

  // unread count
  const [bottomEl, setBottomEl] = createSignal<HTMLDivElement>()
  const observerCb: IntersectionObserverCallback = (entries) => {
    for (const entry of entries) {
      if (entry.isIntersecting) {
        setFriendConvStore(props.uid, 'unread', 0)
        break
      }
    }
  }
  const observer = new IntersectionObserver(observerCb)
  onMount(() => observer.observe(bottomEl()!))
  onCleanup(() => observer.disconnect())

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
      if (props.uid) {
        toBottom()
      }
    })
  })

  return (
    <Show when={friend() !== undefined}>
      <div class="w-full h-100vh flex flex-col">
        <div
          class="px-4 py-1 flex items-center"
          title="Group Info and History/File Tool Bar"
        >
          <div class="font-bold mr-auto flex items-center">
            {friend().remark || friend().nickname} ({friend().user_id})
          </div>
          <Button
            variant="ghost"
            disabled={isFetchingHistory()}
            onClick={getPrivateHistory}
          >
            <div class="i-teenyicons:history-outline" />
          </Button>
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
            class="flex-grow of-y-auto of-hidden flex flex-col gap-2 p-2"
          >
            <For each={friendConvStore[friend().user_id].list}>
              {(i) => <OnePieceOfPrivateMessage m={i} />}
            </For>
            <pre class="hidden">
              <For each={Object.keys(friendConvStore[friend()!.user_id].list)}>
                {(i) => <>i: {i}</>}
              </For>
            </pre>
            <div class="w-full h-1" ref={r => setBottomEl(r)} />
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

export { PrivateChat }
