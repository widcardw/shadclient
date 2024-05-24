import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { forwardStore } from '@/libs/states/forward'
import type {
  CommonForwardMessage,
  CommonNodeMessage,
} from '@/libs/types/messages/common-message'
import type { DialogTriggerProps } from '@kobalte/core/dialog'
import { type Component, For, Show } from 'solid-js'

const NodeMessage: Component<CommonNodeMessage> = (props) => {
  return (
    <div>
      <div>{props.data.nickname}</div>
      {/* TODO: Unified Message Segment <div>{props.data.content}</div> */}
    </div>
  )
}

const ForwardedDialog: Component<{ id: string }> = (props) => {
  // TODO: 点击按钮发送请求获取消息
  return (
    <Dialog modal>
      <DialogTrigger
        as={(props: DialogTriggerProps) => (
          <Button variant="link" {...props}>
            [合并转发消息]
          </Button>
        )}
      />
      <DialogContent class="sm:max-w-[425px] max-h-80vh">
        <DialogHeader>
          <DialogTitle>合并转发消息</DialogTitle>
        </DialogHeader>
        <div class="of-y-auto flex flex-col gap-2">
          <Show when={forwardStore[props.id]} fallback="尚未加载">
            <For each={forwardStore[props.id]}>
              {(m) => <NodeMessage {...m} />}
            </For>
          </Show>
        </div>
      </DialogContent>
    </Dialog>
  )
}

const ForwardMessageFolded: Component<CommonForwardMessage> = (props) => {
  return <ForwardedDialog id={props.data.id} />
}

export { ForwardMessageFolded }
