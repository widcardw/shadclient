import { Button } from '@/components/ui/button'
import type { MultiTypeReceivedMessage as MultiTypeMsg } from '@/libs/types/messages/received-message'
import type { CommonMessageWsObject } from '@/libs/types/ws/message/common-message-ws-object'
import type { GroupMessageWsObject } from '@/libs/types/ws/message/group-message-ws-object'
import type { PrivateMessageWsObject } from '@/libs/types/ws/message/private-message-ws-object'
import { type Component, For, Match, Show, Switch } from 'solid-js'
import { UnifiedMessage } from './UnifiedMessage'

import './icon.css'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogClose,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { ws } from '@/libs/states/connection'
import { WsActions } from '@/libs/ws/websocket'
import type { AlertDialogTriggerProps } from '@kobalte/core/alert-dialog'

const OnePieceOfPrivateMessage: Component<PrivateMessageWsObject> = (props) => {
  const deleteMsg = () => {
    ws()?.send(WsActions.DeleteMsg, { msg_id: props.message_id }, {})
  }

  return (
    <div class="one-piece">
      <div title="user info">
        <span class="text-op-70">
          {props.sender.remark || props.sender.nickname}{' '}
          {props.deleted && '[已撤回]'}
        </span>
        <Button variant="link" class="icon px-3 hover:text-blue">
          <div class="i-teenyicons:at-outline" />
        </Button>
        {/* 自己发送的消息可撤回 */}
        <Show when={props.self_id === props.target_id}>
          <AlertDialog>
            <AlertDialogTrigger
              as={(props: AlertDialogTriggerProps) => (
                <Button
                  variant="link"
                  class="icon px-3 hover:text-red"
                  {...props}
                >
                  <div class="i-teenyicons:bin-outline" />
                </Button>
              )}
            />
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>
                  Are you sure to delete this message?
                </AlertDialogTitle>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogClose>Cancel</AlertDialogClose>
                <AlertDialogAction variant="destructive" onClick={deleteMsg}>
                  Confirm
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </Show>
      </div>
      <div>
        <Show
          when={Array.isArray(props.message)}
          fallback={<UnifiedMessage {...(props.message as MultiTypeMsg)} />}
        >
          <For each={props.message as MultiTypeMsg[]}>
            {(i) => <UnifiedMessage {...i} />}
          </For>
        </Show>
      </div>
    </div>
  )
}

const OnePieceOfGroupMessage: Component<GroupMessageWsObject> = (props) => {
  const deleteMsg = () => {
    ws()?.send(WsActions.DeleteMsg, { msg_id: props.message_id }, {})
  }

  return (
    <div class="one-piece">
      <div title="user info">
        <span class="text-op-70">
          [{props.sender.role}]{' '}
          {props.sender.card || props.sender.nickname}{' '}
          {props.deleted && '[已撤回]'}
        </span>
        <Button variant="link" class="icon px-3 hover:text-blue">
          <div class="i-teenyicons:at-outline" />
        </Button>
        <Button variant="link" class="icon px-3 hover:text-blue">
          <div class="i-teenyicons:attach-outline" />
        </Button>
        {/* 自己发送的消息可撤回 */}
        <Show when={props.self_id === props.sender.user_id}>
          <AlertDialog>
            <AlertDialogTrigger
              as={(props: AlertDialogTriggerProps) => (
                <Button
                  variant="link"
                  class="icon px-3 hover:accent-red"
                  {...props}
                >
                  <div class="i-teenyicons:bin-outline" />
                </Button>
              )}
            />
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>
                  Are you sure to delete this message?
                </AlertDialogTitle>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogClose>Cancel</AlertDialogClose>
                <AlertDialogAction variant="destructive" onClick={deleteMsg}>
                  Confirm
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </Show>
      </div>
      <div class="max-w-800px">
        <Show
          when={Array.isArray(props.message)}
          fallback={<UnifiedMessage {...(props.message as MultiTypeMsg)} />}
        >
          <For each={props.message as MultiTypeMsg[]}>
            {(i) => <UnifiedMessage {...i} />}
          </For>
        </Show>
      </div>
    </div>
  )
}

const OnePieceOfMessage: Component<CommonMessageWsObject> = (props) => {
  return (
    <Switch>
      <Match when={props.message_type === 'group'}>
        <OnePieceOfGroupMessage {...(props as GroupMessageWsObject)} />
      </Match>
      <Match when={props.message_type === 'private'}>
        <OnePieceOfPrivateMessage {...(props as PrivateMessageWsObject)} />
      </Match>
    </Switch>
  )
}

export { OnePieceOfMessage, OnePieceOfGroupMessage, OnePieceOfPrivateMessage }
