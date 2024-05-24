import { ws } from '@/libs/states/connection'
import {
  friendRequests,
  groupRequests,
} from '@/libs/states/requests'
import type { SingleGroupInfo } from '@/libs/types/ws/group-info'
import { getGroupName } from '@/libs/types/ws/message/group-message-ws-object'
import { RequestStatus } from '@/libs/types/ws/request/common-request-ws-object'
import type { GroupAddRequestWsObject } from '@/libs/types/ws/request/group-add-request-ws-object'
import { WsActions } from '@/libs/ws/websocket'
import { type Component, For, Show, onMount } from 'solid-js'
import { createStore } from 'solid-js/store'
import { OperatedButton } from './notice/OperatedButton'
import { FriendRequestConfirmDialog, FriendRequestRejectButton } from './notice/friend-request-actions'
import { GroupConfirmButton, GroupRejectDialog } from './notice/group-request-actions'

const [inviteStore, setInviteStore] = createStore<
  Record<number, SingleGroupInfo>
>({})

const GroupAddRequestDesc: Component<{ r: GroupAddRequestWsObject }> = (
  props,
) => {
  return (
    <div>
      <div class="font-bold">
        {props.r.user_id} request to join the group{' '}
        {getGroupName(props.r.group_id)} ({props.r.group_id})
      </div>
      <div>{props.r.comment}</div>
    </div>
  )
}

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

const NoticePanel: Component = () => {
  return (
    <div class="of-y-auto p-4 w-full flex flex-col gap-4">
      {/* 好友请求 */}
      <For each={friendRequests}>
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
                <FriendRequestRejectButton r={r} />
              </Show>
            </div>
          </div>
        )}
      </For>

      {/* 加群请求 */}
      <For each={groupRequests}>
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
                <GroupConfirmButton r={r} />
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
