import { ws } from '@/libs/states/connection';
import { setGroupRequests } from '@/libs/states/requests';
import { RequestStatus } from '@/libs/types/ws/request/common-request-ws-object';
import type { GroupAddRequestWsObject } from '@/libs/types/ws/request/group-add-request-ws-object';
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

export const GroupConfirmButton: Component<{ r: GroupAddRequestWsObject; }> = (
  props
) => {
  return (
    <Button
      size="sm"
      onClick={() => {
        ws()?.send(
          WsActions.SetGroupAddRequest,
          { flag: props.r.flag, approve: true, sub_type: props.r.sub_type },
          {}
        );
        setGroupRequests(
          (p) => p.flag === props.r.flag,
          'status',
          RequestStatus.Accepted
        );
      }}
    >
      Accept
    </Button>
  );
};
export const GroupRejectDialog: Component<{ r: GroupAddRequestWsObject; }> = (
  props
) => {
  const [reason, setReason] = createSignal('');

  const sendReject = () => {
    ws()?.send(
      WsActions.SetGroupAddRequest,
      {
        flag: props.r.flag,
        approve: false,
        reason: reason(),
        sub_type: props.r.sub_type,
      },
      {}
    );
    setGroupRequests(
      (p) => p.flag === props.r.flag,
      'status',
      RequestStatus.Rejected
    );
  };

  return (
    <Dialog>
      <DialogTrigger
        as={(props: DialogTriggerProps) => (
          <Button size="sm" variant="destructive" {...props}>
            Reject
          </Button>
        )} />
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
              onChange={(e: Event) => setReason((e.currentTarget as HTMLInputElement).value)} />
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
  );
};
