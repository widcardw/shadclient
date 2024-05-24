import { friendConvStore } from '@/libs/states/sessions'
import { type Component, For, Show, createMemo } from 'solid-js'
import { allFriends } from '../conversation-list/friend-list'
import { Button } from '../ui/button'
import { Separator } from '../ui/separator'
import { InputArea } from './InputArea'
import { OnePieceOfPrivateMessage } from './message/OnePieceOfMessage'

const PrivateChat: Component<{ uid: number }> = (props) => {
  const friend = createMemo(
    () => allFriends().find((i) => i.user_id === props.uid)!,
  )

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
          <Button variant="ghost">
            <div class="i-teenyicons:history-outline" />
          </Button>
          <Button variant="ghost">
            <div class="i-teenyicons:arrow-down-circle-outline" />
          </Button>
        </div>
        <Separator />
        <div class="flex-grow flex flex-col">
          <div class="px-2 min-h-70vh max-h-80vh of-y-auto of-hidden flex flex-col gap-2">
            <For each={friendConvStore[friend().user_id].list}>
              {(i) => <OnePieceOfPrivateMessage {...i} />}
            </For>
          </div>
          <Separator />
          <InputArea />
        </div>
      </div>
    </Show>
  )
}

export { PrivateChat }
