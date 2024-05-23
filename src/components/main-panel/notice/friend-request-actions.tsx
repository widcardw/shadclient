import { ws } from '@/libs/states/connection';
import { setFriendRequests } from '@/libs/states/requests';
import { RequestStatus } from '@/libs/types/ws/request/common-request-ws-object';
import type { FriendAddRequestWsObject } from '@/libs/types/ws/request/friend-add-request-ws-object';
import { WsActions } from '@/libs/ws/websocket';
import type { DialogTriggerProps } from '@kobalte/core/dialog';
import { type Component, createSignal } from 'solid-js';
import { Button } from '../../ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '../../ui/dialog';
import { TextField } from '../../ui/textfield';
import { TextFieldLabel, TextFieldRoot } from '../../ui/textfield';

export const FriendRequestConfirmDialog: Component<{ r: FriendAddRequestWsObject; }> = (
  props
) => {
  const [remarkName, setRemarkName] = createSignal(props.r.comment);
  const sendConfirm = () => {
    ws()?.send(
      WsActions.SetFriendAddRequest,
      { flag: props.r.flag, approve: true, remark: remarkName() },
      { user_id: props.r.user_id, remark: remarkName() }
    );
    setFriendRequests(
      (p) => p.flag === props.r.flag,
      'status',
      RequestStatus.Accepted
    );
  };
  return (
    <Dialog>
      <DialogTrigger
        as={(props: DialogTriggerProps) => (
          <Button size="sm" {...props}>
            Accept
          </Button>
        )} />
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
            <TextFieldLabel class="text-right">Remark</TextFieldLabel>
            <TextField
              class="col-span-2 md:col-span-3"
              value={remarkName()}
              onChange={(e: Event) => setRemarkName((e.currentTarget as HTMLInputElement).value)} />
          </TextFieldRoot>
        </div>
        <DialogFooter>
          <Button type="submit" onClick={sendConfirm}>
            Confirm
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
export const FriendRequestRejectButton: Component<{ r: FriendAddRequestWsObject; }> = (
  props
) => {
  return (
    <Button
      size="sm"
      variant="destructive"
      onClick={() => {
        ws()?.send(
          WsActions.SetFriendAddRequest,
          { flag: props.r.flag, approve: false },
          {}
        );
        setFriendRequests(
          (p) => p.flag === props.r.flag,
          'status',
          RequestStatus.Rejected
        );
      }}
    >
      Reject
    </Button>
  );
};
