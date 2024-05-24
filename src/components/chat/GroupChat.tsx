import { ws } from '@/libs/states/connection'
import { groupConvStore } from '@/libs/states/sessions'
import { WsActions } from '@/libs/ws/websocket'
import { type Component, For, Show, createMemo } from 'solid-js'
import { toast } from 'solid-sonner'
import { allGroups } from '../conversation-list/group-list'
import { Button } from '../ui/button'
import { Separator } from '../ui/separator'
import { InputArea } from './InputArea'
import { OnePieceOfGroupMessage } from './message/OnePieceOfMessage'

const GroupChat: Component<{ gid: number }> = (props) => {
  const group = createMemo(() => allGroups().find((i) => i.group_id === props.gid)!)

  const getGroupHistory = () => {
    const first = groupConvStore[group().group_id]?.list?.[0].message_id
    console.log(first)
    if (first !== undefined)
      ws()?.send(
        WsActions.GetGroupMsgHistory,
        { group_id: group().group_id, message_id: first, id: first, count: 17 },
        { group_id: group().group_id },
      )
    else toast.warning('暂无历史消息，请先发送一条后再获取')
  }

  return (
    <Show when={group() !== undefined}>
      <div class="w-full h-100vh flex flex-col">
        <div class="px-4 py-1 flex items-center">
          <div class="font-bold mr-auto flex items-center">
            {group().group_memo || group().group_name} ({group().group_id})
          </div>
          <Button variant="ghost" onClick={getGroupHistory}>
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
        <div class="flex-grow flex flex-col">
          <div class="px-2 min-h-70vh max-h-80vh of-y-auto of-hidden flex flex-col gap-2">
            <For each={groupConvStore[group().group_id].list}>
              {(i) => <OnePieceOfGroupMessage {...i} />}
            </For>
          </div>
          <Separator />
          <InputArea />
        </div>
      </div>
    </Show>
  )
}

export { GroupChat }
