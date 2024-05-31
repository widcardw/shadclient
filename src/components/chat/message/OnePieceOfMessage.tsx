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
import { timeToHourMinute } from '@/libs/utils/date-format'
import { WsActions } from '@/libs/ws/websocket'
import type { AlertDialogTriggerProps } from '@kobalte/core/alert-dialog'

function roleToColor(role: 'owner' | 'admin' | 'member'): string {
  switch (role) {
    case 'owner':
      return 'text-yellow-500'
    case 'admin':
      return 'text-green-600'
    case 'member':
      return 'text-blue-500'
    default:
      return 'text-gray-500'
  }
}

const OnePieceOfPrivateMessage: Component<{ m: PrivateMessageWsObject }> = (
  props,
) => {
  const deleteMsg = () => {
    ws()?.send(WsActions.DeleteMsg, { msg_id: props.m.message_id }, {})
  }

  return (
    <div class="one-piece">
      <div title="user info">
        <span class="op-70">
          {props.m.sender.remark || props.m.sender.nickname}{' '}
          {props.m.deleted && '[已撤回]'}
          <span class="icon">{timeToHourMinute(props.m.time)}</span>
        </span>
        <Button variant="link" class="icon px-0 hover:text-blue">
          <div class="i-teenyicons:at-outline" />
        </Button>
        {/* 自己发送的消息可撤回 */}
        <Show when={props.m.self_id === props.m.target_id}>
          <AlertDialog>
            <AlertDialogTrigger
              as={(props: AlertDialogTriggerProps) => (
                <Button
                  variant="link"
                  class="icon px-0 hover:text-red"
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
          when={Array.isArray(props.m.message)}
          fallback={<UnifiedMessage m={props.m.message as MultiTypeMsg} />}
        >
          <For each={props.m.message as MultiTypeMsg[]}>
            {(i) => <UnifiedMessage m={i} />}
          </For>
        </Show>
      </div>
    </div>
  )
}

const OnePieceOfGroupMessage: Component<{ m: GroupMessageWsObject }> = (
  props,
) => {
  const deleteMsg = () => {
    ws()?.send(WsActions.DeleteMsg, { msg_id: props.m.message_id }, {})
  }

  return (
    <div class="one-piece">
      <div title="user info" class="flex items-center gap-2">
        <span>
          <span class={roleToColor(props.m.sender.role)}>
            [{props.m.self_id === props.m.sender.user_id ? 'me' : props.m.sender.role}]
          </span>{' '}
          <span class="text-gray-500">
            {props.m.sender.card || props.m.sender.nickname}{' '}
            {props.m.deleted && '[已撤回] '}
            <span class="icon">{timeToHourMinute(props.m.time)}</span>
          </span>
        </span>
        <Button variant="link" class="icon px-0 hover:text-blue">
          <div class="i-teenyicons:at-outline" />
        </Button>
        <Button variant="link" class="icon px-0 hover:text-blue">
          <div class="i-teenyicons:attach-outline" />
        </Button>
        {/* 自己发送的消息可撤回 */}
        <Show when={props.m.self_id === props.m.sender.user_id}>
          <AlertDialog>
            <AlertDialogTrigger
              as={(props: AlertDialogTriggerProps) => (
                <Button
                  variant="link"
                  class="icon px-0 hover:accent-red"
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
          when={Array.isArray(props.m.message)}
          fallback={<UnifiedMessage m={props.m.message as MultiTypeMsg} />}
        >
          <For each={props.m.message as MultiTypeMsg[]}>
            {(i) => <UnifiedMessage m={i} />}
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
        <OnePieceOfGroupMessage m={props as GroupMessageWsObject} />
      </Match>
      <Match when={props.message_type === 'private'}>
        <OnePieceOfPrivateMessage m={props as PrivateMessageWsObject} />
      </Match>
    </Switch>
  )
}

export { OnePieceOfMessage, OnePieceOfGroupMessage, OnePieceOfPrivateMessage }