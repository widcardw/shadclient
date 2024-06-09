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
import { type Component, For, Show, createSignal } from 'solid-js'
import { UnifiedMessage } from './UnifiedMessage'

const NodeMessage: Component<{ m: CommonNodeMessage }> = (props) => {
  return (
    <div>
      <div class="text-gray">{props.m.data.nickname}</div>
      {/* Unified Message Segment */}
      <For each={props.m.data.content}>{(m) => <UnifiedMessage m={m} />}</For>
    </div>
  )
}

const ForwardedDialog: Component<{ id: string }> = (props) => {
  // TODO: 点击按钮发送请求获取消息
  const requestForwardedMsg = () => {
    if (forwardStore[props.id]) return
    console.log('requestForwardedMsg', props.id)
    ws()?.send(WsActions.GetForwardMsg, { id: props.id }, { fid: props.id })
  }
  return (
    <Dialog modal>
      <DialogTrigger
        as={(_props: DialogTriggerProps) => {
          const click =
            typeof _props.onClick === 'function'
              ? (ev: MouseEvent) => {
                  requestForwardedMsg()
                  /** @ts-ignore merge click events */
                  _props.onClick?.(ev)
                }
              : requestForwardedMsg

          return (
            <Button variant="outline" {..._props} onClick={click}>
              [Forward Message]
            </Button>
          )
        }}
      />
      <DialogContent class="sm:max-w-[800px]" onInteractOutside={ev => ev.preventDefault()}>
        <DialogHeader>
          <DialogTitle>Forward Message</DialogTitle>
        </DialogHeader>
        <div class="max-h-80vh of-y-auto of-hidden flex flex-col gap-2">
          <Show when={forwardStore[props.id]} fallback="加载中">
            <For each={forwardStore[props.id]}>
              {(m) => <NodeMessage m={m} />}
            </For>
          </Show>
        </div>
      </DialogContent>
    </Dialog>
  )
}

const ForwardMessageFolded: Component<{ m: CommonForwardMessage }> = (
  props,
) => {
  return <ForwardedDialog id={props.m.data.id} />
}

export { ForwardMessageFolded }
