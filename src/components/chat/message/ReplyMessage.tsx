import {
  activeId,
  activeType,
  friendConvStore,
  groupConvStore,
} from '@/libs/states/sessions'
import type { CommonReplyMessage } from '@/libs/types/messages/common-message'
import type { MultiTypeReceivedMessage } from '@/libs/types/messages/received-message'
import { UnifyInfoType } from '@/libs/types/ws/unify-info'
import { type Component, For, Show, createMemo } from 'solid-js'
import { UnifiedMessage } from './UnifiedMessage'

// TODO
const ReplyMessage: Component<{ m: CommonReplyMessage }> = (props) => {
  const foundMsg = createMemo(() => {
    if (activeType() === UnifyInfoType.Private && activeId()) {
      const found = friendConvStore[activeId()]?.list.find(
        (i) => i.message_id.toString() === props.m.data.id.toString(),
      )
      return found
    }
    if (activeType() === UnifyInfoType.Group && activeId()) {
      const found = groupConvStore[activeId()]?.list.find(
        (i) => i.message_id.toString() === props.m.data.id.toString(),
      )
      return found
    }
  })
  return (
    <Show when={foundMsg()} fallback="[回复]">
      <div
        class="border-l-(4px zinc-500) p-2 rounded-md mb-1 space-y-1 shadow text-sm bg-muteddark"
        style={{ 'box-sizing': 'border-box' }}
      >
        <div class="flex items-center space-x-2">
          <div class="i-teenyicons:quote-outline" />
          <div class="text-foreground/50">{foundMsg()?.sender.nickname}</div>
        </div>
        <div class="min-w-100px max-w-800px whitespace-pre-wrap break-all">
          <For
            each={(foundMsg()?.message as MultiTypeReceivedMessage[]).filter(
              (i) => i.type !== 'reply',
            )}
          >
            {(i) => <UnifiedMessage m={i} />}
          </For>
        </div>
      </div>
    </Show>
  )
}

export { ReplyMessage }
