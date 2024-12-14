import { Button } from '@/components/ui/button'
import type { MultiTypeReceivedMessage as MultiTypeMsg } from '@/libs/types/messages/received-message'
import type { CommonMessageWsObject } from '@/libs/types/ws/message/common-message-ws-object'
import type { GroupMessageWsObject } from '@/libs/types/ws/message/group-message-ws-object'
import type { PrivateMessageWsObject } from '@/libs/types/ws/message/private-message-ws-object'
import { type Component, For, Match, Show, Switch, createMemo } from 'solid-js'
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
import { Badge } from '@/components/ui/badge'
import { ws } from '@/libs/states/connection'
import { activeId } from '@/libs/states/sessions'
import { UnifyInfoType } from '@/libs/types/ws/unify-info'
import { timeToHourMinute } from '@/libs/utils/date-format'
import { roleToVariant } from '@/libs/utils/role'
import { WsActions } from '@/libs/ws/websocket'
import type { AlertDialogTriggerProps } from '@kobalte/core/alert-dialog'
import { sendEl } from '../InputArea'

const OnePieceOfPrivateMessage: Component<{ m: PrivateMessageWsObject }> = (
  props,
) => {
  const deleteMsg = () => {
    ws()?.send(
      WsActions.DeleteMsg,
      { message_id: props.m.message_id },
      {
        t: UnifyInfoType.Private,
        id: activeId(),
        message_id: props.m.message_id,
      },
    )
  }

  const addMention = () => {
    const el = sendEl()
    if (el) {
      el.value += `[CQ:reply,id=${props.m.message_id}]`
    }
  }

  return (
    <div class="one-piece" id={props.m.message_id.toString()}>
      <div title="user info" class="flex items-center gap-2">
        <span class="text-muted-foreground flex items-center gap-2">
          {props.m.sender.remark || props.m.sender.nickname}
          <Show when={props.m.deleted}>
            <Badge variant="outline">已撤回</Badge>
          </Show>
          <span class="icon text-0.875rem font-mono">
            {timeToHourMinute(props.m.time)}
          </span>
        </span>
        <Button
          variant="link"
          class="icon px-0 hover:text-blue"
          onClick={addMention}
        >
          <div class="i-teenyicons:attach-outline" />
        </Button>
        {/* 自己发送的消息可撤回 */}
        <Show
          when={
            props.m.self_id === props.m.user_id && props.m.deleted !== true
          }
        >
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
      <div class="max-w-800px rounded p-2 bg-muted" style={{ width: 'fit-content' }}>
        <Show
          when={Array.isArray(props.m.message)}
          fallback={<UnifiedMessage m={props.m.message as unknown as MultiTypeMsg} />}
        >
          <For each={props.m.message}>
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
    ws()?.send(
      WsActions.DeleteMsg,
      { message_id: props.m.message_id },
      {
        t: UnifyInfoType.Group,
        id: activeId(),
        message_id: props.m.message_id,
      },
    )
  }

  const addAt = () => {
    const el = sendEl()
    if (el) {
      el.value += `[CQ:at,qq=${props.m.sender.user_id}]`
    }
  }

  const addMention = () => {
    const el = sendEl()
    if (el) {
      el.value += `[CQ:reply,id=${props.m.message_id}]`
    }
  }

  const title = createMemo(() => {
    const res: string[] =[]
    if (props.m?.sender?.card) {
      res.push(props.m.sender.card)
    } else if (props.m?.sender?.nickname) {
      res.push(props.m.sender.nickname)
    } else {
      res.push(props.m.user_id.toString())
    }

    if (props.m?.time) {
      res.push(new Date(props.m.time * 1000).toLocaleString())
    }

    return res.join(' ')
  })

  return (
    <div class="one-piece space-y-1" id={(props.m?.message_id || 0).toString()}>
      <div title={title()} class="flex items-center gap-2">
        <span class="text-muted-foreground">
          {props.m?.sender?.card || props.m?.sender?.nickname || props.m?.user_id}
        </span>
        <Show when={props.m?.deleted}>
          <Badge variant="secondary">Recalled</Badge>
        </Show>
        <Show
          when={
            props.m?.sender?.role === 'admin' ||
            props.m?.sender?.role === 'owner' ||
            props.m?.sender?.user_id === props.m?.self_id
          }
        >
          <Badge variant={roleToVariant(props.m?.sender?.role)}>
            {props.m?.self_id === props.m?.sender?.user_id
              ? 'me'
              : props.m?.sender?.role}
          </Badge>
        </Show>
        <span class="icon font-mono text-0.875rem text-muted-foreground">
          {timeToHourMinute(props.m?.time)}
        </span>
        <div
          class="i-teenyicons:at-outline icon px-0 hover:text-blue"
          onClick={addAt}
        />
        <div
          class="i-teenyicons:attach-outline icon px-0 hover:text-blue"
          onClick={addMention}
        />
        {/* 自己发送的消息可撤回 */}
        <Show
          when={
            props.m?.self_id === props.m?.sender?.user_id &&
            props.m?.deleted !== true
          }
        >
          <AlertDialog>
            <AlertDialogTrigger
              as={(props: AlertDialogTriggerProps) => (
                // @ts-ignore pass props to div
                <div
                  class="i-teenyicons:bin-outline icon px-0 hover:accent-red"
                  {...props}
                />
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
      <div class="max-w-800px rounded p-2 bg-muted" style={{ width: 'fit-content' }}>
        <Show
          when={Array.isArray(props.m?.message)}
          fallback={<pre>{JSON.stringify(props.m)}</pre>}
        >
          <For each={props.m?.message as MultiTypeMsg[]}>
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
