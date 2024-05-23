import { setAllFriends } from '@/components/conversation-list/friend-list'
import type { WsActions } from '@/libs/ws/websocket'
import { toast } from 'solid-sonner'
import { UnifyInfoType } from '../unify-info'
import type { CommonEchoMessage, EchoedObject } from './common-echo'

interface FriendAddRequestEcho extends CommonEchoMessage {
  echo: FriendAddRequestEchoCarried
}

interface FriendAddRequestEchoCarried extends EchoedObject {
  action: WsActions.SetFriendAddRequest
  user_id: number
  remark: string
}

function dispatch(data: FriendAddRequestEcho) {
  toast.success('Successfully added friend!')
  setAllFriends((prev) => [
    ...prev,
    {
      type: UnifyInfoType.Private,
      user_id: data.echo.user_id,
      nickname: data.echo.remark,
    },
  ])
}

export type { FriendAddRequestEcho, FriendAddRequestEchoCarried }
export { dispatch as dispatchFriendAddRequestEcho }
