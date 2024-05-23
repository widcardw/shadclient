import { RequestStatus } from '@/libs/types/ws/request/common-request-ws-object';
import type { Component } from 'solid-js';
import { Button } from '../ui/button';

export const OperatedButton: Component<{ status: RequestStatus; }> = (props) => {
  return (
    <Button>
      {props.status === RequestStatus.Accepted ? 'Accepted' : 'Rejected'}
    </Button>
  );
};
