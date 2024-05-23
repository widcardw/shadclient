import { ws } from '@/libs/states/connection'
import { friendRequests, groupRequests } from '@/libs/states/requests'
import type { SingleGroupInfo } from '@/libs/types/ws/group-info'
import { getGroupName } from '@/libs/types/ws/message/group-message-ws-object'
import { RequestStatus } from '@/libs/types/ws/request/common-request-ws-object'
import type { FriendAddRequestWsObject } from '@/libs/types/ws/request/friend-add-request-ws-object'
import type { GroupAddRequestWsObject } from '@/libs/types/ws/request/group-add-request-ws-object'
import { WsActions } from '@/libs/ws/websocket'
import type { DialogTriggerProps } from '@kobalte/core/dialog'
import { type Component, For, Show, createSignal, onMount } from 'solid-js'
import { createStore } from 'solid-js/store'
import { Alert, AlertDescription, AlertTitle } from '../ui/alert'
import { Button } from '../ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../ui/dialog'
import { TextField } from '../ui/textfield'
import { TextFieldLabel, TextFieldRoot } from '../ui/textfield'

const OperatedButton: Component<{ status: RequestStatus }> = (props) => {
  return (
    <Button>
      {props.status === RequestStatus.Accepted ? 'Accepted' : 'Rejected'}
    </Button>
  )
}

const FriendRequestConfirmDialog: Component<{ r: FriendAddRequestWsObject }> = (
  props,
) => {
  const [remarkName, setRemarkName] = createSignal(props.r.comment)
  const sendConfirm = () => {
    ws()?.send(
      WsActions.SetFriendAddRequest,
      { flag: props.r.flag, approve: true, remark: remarkName() },
      {},
    )
  }
  return (
    <Dialog>
      <DialogTrigger
        as={(props: DialogTriggerProps) => <Button {...props}>Accept</Button>}
      />
      <DialogContent class="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Confirm Acception</DialogTitle>
          <DialogDescription>
            Make changes to his/her remark name here. Click confirm when you're
            done.
          </DialogDescription>
        </DialogHeader>
        <div class="grid gap-4 py-4">
          <TextFieldRoot class="grid grid-cols-3 items-center gap-4 md:grid-cols-4">
            <TextFieldLabel class="text-right">Remark Name</TextFieldLabel>
            <TextField
              class="col-span-2 md:col-span-3"
              value={remarkName()}
              onChange={(e: Event) =>
                setRemarkName((e.currentTarget as HTMLInputElement).value)
              }
            />
          </TextFieldRoot>
        </div>
        <DialogFooter>
          <Button type="submit" onClick={sendConfirm}>
            Confirm
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

const GroupAddRequestDesc: Component<{ r: GroupAddRequestWsObject }> = (
  props,
) => {
  return (
    <>
      <AlertTitle>
        {props.r.user_id} request to join the group{' '}
        {getGroupName(props.r.group_id)}
      </AlertTitle>
      <AlertDescription>{props.r.comment}</AlertDescription>
    </>
  )
}

const [inviteStore, setInviteStore] = createStore<
  Record<number, SingleGroupInfo>
>({})

const GroupInviteDesc: Component<{ r: GroupAddRequestWsObject }> = (props) => {
  onMount(() => {
    if (inviteStore[props.r.group_id] !== undefined) return
    // TODO
    ws()?.send(
      WsActions.GetGroupInfo,
      { group_id: props.r.group_id },
      { group_id: props.r.group_id },
    )
  })

  return (
    <>
      <AlertTitle>
        {props.r.user_id} invites you to join the group{' '}
        {inviteStore[props.r.group_id].group_name} {props.r.group_id}
        {inviteStore[props.r.group_id].member_count && ` (${inviteStore[props.r.group_id].member_count} members)`}
      </AlertTitle>
      <AlertDescription>{props.r.comment}</AlertDescription>
    </>
  )
}

const GroupRejectDialog: Component<{ r: GroupAddRequestWsObject }> = (
  props,
) => {
  const [reason, setReason] = createSignal('')

  const sendReject = () => {
    ws()?.send(
      WsActions.SetGroupAddRequest,
      {
        flag: props.r.flag,
        approve: false,
        reason: reason(),
        sub_type: props.r.sub_type,
      },
      {},
    )
  }

  return (
    <Dialog>
      <DialogTrigger
        as={(props: DialogTriggerProps) => (
          <Button variant="destructive" {...props}>
            Reject
          </Button>
        )}
      />
      <DialogContent class="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Confirm Rejection</DialogTitle>
          <DialogDescription>
            Make changes to the rejection reason here. Click confirm when you're
            done.
          </DialogDescription>
        </DialogHeader>
        <div class="grid gap-4 py-4">
          <TextFieldRoot class="grid grid-cols-3 items-center gap-4 md:grid-cols-4">
            <TextFieldLabel class="text-right">Reason</TextFieldLabel>
            <TextField
              class="col-span-2 md:col-span-3"
              value={reason()}
              onChange={(e: Event) =>
                setReason((e.currentTarget as HTMLInputElement).value)
              }
            />
          </TextFieldRoot>
        </div>
        <DialogFooter>
          <Button type="submit" variant="destructive" onClick={sendReject}>
            Confirm
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

const NoticePanel: Component = () => {
  return (
    <div class="of-y-auto p-1 grid gap-1">
      <For each={friendRequests()}>
        {(r) => (
          <Alert>
            <AlertTitle>
              {r.comment}({r.user_id})
            </AlertTitle>
            <AlertDescription>
              Request to be added as a friend.
            </AlertDescription>
            <Show
              when={r.status === RequestStatus.Unread}
              fallback={<OperatedButton status={r.status!} />}
            >
              <FriendRequestConfirmDialog r={r} />
              <Button
                variant="destructive"
                onClick={() => {
                  ws()?.send(
                    WsActions.SetFriendAddRequest,
                    { flag: r.flag, approve: false },
                    {},
                  )
                }}
              >
                Reject
              </Button>
            </Show>
          </Alert>
        )}
      </For>

      <For each={groupRequests()}>
        {(r) => (
          <Alert>
            <Show
              when={r.sub_type === 'add'}
              fallback={<GroupInviteDesc r={r} />}
            >
              <GroupAddRequestDesc r={r} />
            </Show>
            <Show
              when={r.status === RequestStatus.Unread}
              fallback={<OperatedButton status={r.status!} />}
            >
              <Button
                onClick={() => {
                  ws()?.send(
                    WsActions.SetGroupAddRequest,
                    { flag: r.flag, approve: true, sub_type: r.sub_type },
                    {},
                  )
                }}
              >
                Accept
              </Button>
              <GroupRejectDialog r={r} />
            </Show>
          </Alert>
        )}
      </For>
    </div>
  )
}

export { NoticePanel, inviteStore, setInviteStore }
