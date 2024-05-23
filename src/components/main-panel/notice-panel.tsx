import { ws } from '@/libs/states/connection'
import {
  friendRequests,
  groupRequests,
  setFriendRequests,
  setGroupRequests,
} from '@/libs/states/requests'
import type { SingleGroupInfo } from '@/libs/types/ws/group-info'
import { getGroupName } from '@/libs/types/ws/message/group-message-ws-object'
import { RequestStatus } from '@/libs/types/ws/request/common-request-ws-object'
import type { FriendAddRequestWsObject } from '@/libs/types/ws/request/friend-add-request-ws-object'
import type { GroupAddRequestWsObject } from '@/libs/types/ws/request/group-add-request-ws-object'
import { WsActions } from '@/libs/ws/websocket'
import type { DialogTriggerProps } from '@kobalte/core/dialog'
import { type Component, For, Show, createSignal, onMount } from 'solid-js'
import { createStore } from 'solid-js/store'
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
    setFriendRequests((prev) => {
      const index = prev.findIndex((r) => r.flag === props.r.flag)
      prev[index].status = RequestStatus.Accepted
      return prev
    })
  }
  return (
    <Dialog>
      <DialogTrigger
        as={(props: DialogTriggerProps) => (
          <Button size="sm" {...props}>
            Accept
          </Button>
        )}
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
    <div>
      <div class="font-bold">
        {props.r.user_id} request to join the group{' '}
        {getGroupName(props.r.group_id)}
      </div>
      <div>{props.r.comment}</div>
    </div>
  )
}

const [inviteStore, setInviteStore] = createStore<
  Record<number, SingleGroupInfo>
>({})

const GroupInviteDesc: Component<{ r: GroupAddRequestWsObject }> = (props) => {
  onMount(() => {
    if (inviteStore[props.r.group_id] !== undefined) return
    // TODO: 请求发送失败
    ws()?.send(
      WsActions.GetGroupInfo,
      { group_id: props.r.group_id, no_cache: true },
      { group_id: props.r.group_id },
    )
  })

  return (
    <div>
      <div class="font-bold">
        {props.r.user_id} invites you to join the group{' '}
        <Show when={inviteStore[props.r.group_id]} fallback={props.r.group_id}>
          {inviteStore[props.r.group_id].group_name} {props.r.group_id}
          {inviteStore[props.r.group_id].member_count &&
            ` (${inviteStore[props.r.group_id].member_count} members)`}
        </Show>
      </div>
      <div>{props.r.comment}</div>
    </div>
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
    setGroupRequests((prev) => {
      const index = prev.findIndex((r) => r.flag === props.r.flag)
      prev[index].status = RequestStatus.Rejected
      return prev
    })
  }

  return (
    <Dialog>
      <DialogTrigger
        as={(props: DialogTriggerProps) => (
          <Button size="sm" variant="destructive" {...props}>
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
          <Button
            size="sm"
            type="submit"
            variant="destructive"
            onClick={sendReject}
          >
            Confirm
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

const NoticePanel: Component = () => {
  return (
    <div class="of-y-auto p-4 w-full flex flex-col gap-4">
      {/* 好友请求 */}
      <For each={friendRequests()}>
        {(r) => (
          <div class="border border-rounded bg-background p-4 flex justify-between items-center h-20">
            <div>
              <div class="font-bold">
                {r.comment}({r.user_id})
              </div>
              <div>Request to be added as a friend.</div>
            </div>
            <div class="flex gap-2">
              <Show
                when={r.status === RequestStatus.Unread}
                fallback={<OperatedButton status={r.status!} />}
              >
                <FriendRequestConfirmDialog r={r} />
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => {
                    ws()?.send(
                      WsActions.SetFriendAddRequest,
                      { flag: r.flag, approve: false },
                      {},
                    )
                    setFriendRequests((prev) => {
                      const index = prev.findIndex((q) => q.flag === r.flag)
                      prev[index].status = RequestStatus.Rejected
                      return prev
                    })
                  }}
                >
                  Reject
                </Button>
              </Show>
            </div>
          </div>
        )}
      </For>

      {/* 加群请求 */}
      <For each={groupRequests()}>
        {(r) => (
          <div class="border border-rounded bg-background p-4 flex justify-between items-center h-20">
            <Show
              when={r.sub_type === 'add'}
              fallback={<GroupInviteDesc r={r} />}
            >
              <GroupAddRequestDesc r={r} />
            </Show>
            <div class="flex gap-2">
              <Show
                when={r.status === RequestStatus.Unread}
                fallback={<OperatedButton status={r.status!} />}
              >
                <Button
                  size="sm"
                  onClick={() => {
                    ws()?.send(
                      WsActions.SetGroupAddRequest,
                      { flag: r.flag, approve: true, sub_type: r.sub_type },
                      {},
                    )
                    setGroupRequests((prev) => {
                      const index = prev.findIndex((q) => q.flag === r.flag)
                      prev[index].status = RequestStatus.Accepted
                      return prev
                    })
                  }}
                >
                  Accept
                </Button>
                <GroupRejectDialog r={r} />
              </Show>
            </div>
          </div>
        )}
      </For>
    </div>
  )
}

export { NoticePanel, inviteStore, setInviteStore }
