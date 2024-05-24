import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { ws } from '@/libs/states/connection'
import { forwardStore } from '@/libs/states/forward'
import type {
  CommonForwardMessage,
  CommonNodeMessage,
} from '@/libs/types/messages/common-message'
import { WsActions } from '@/libs/ws/websocket'
import type { DialogTriggerProps } from '@kobalte/core/dialog'
import { type Component, For, Show } from 'solid-js'
import { UnifiedMessage } from './UnifiedMessage'

const NodeMessage: Component<CommonNodeMessage> = (props) => {
  return (
    <div>
      <div>{props.data.nickname}</div>
      {/* Unified Message Segment */}
      <For each={props.data.content}>{(m) => <UnifiedMessage {...m} />}</For>
    </div>
  )
}

const ForwardedDialog: Component<{ id: string }> = (props) => {
  // TODO: 点击按钮发送请求获取消息
  const requestForwardedMsg = () => {
    console.log('requestForwardedMsg', props.id)
    ws()?.send(WsActions.GetForwardMsg, { id: props.id }, { fid: props.id })
  }
  return (
    <Dialog modal>
      <DialogTrigger
        as={(props: DialogTriggerProps) => (
          <Button variant="link" onClick={requestForwardedMsg} {...props}>
            [合并转发消息]
          </Button>
        )}
      />
      <DialogContent class="sm:max-w-[425px] max-h-80vh">
        <DialogHeader>
          <DialogTitle>合并转发消息</DialogTitle>
        </DialogHeader>
        <div class="of-y-auto flex flex-col gap-2">
          <Show when={forwardStore[props.id]} fallback="加载中">
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
