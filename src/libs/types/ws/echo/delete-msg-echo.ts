import { friendConvStore, groupConvStore, setFriendConvStore, setGroupConvStore } from '@/libs/states/sessions'
import type { WsActions } from '@/libs/ws/websocket'
import { toast } from 'solid-sonner'
import { UnifyInfoType } from '../unify-info'
import type { CommonEchoMessage, EchoedObject } from './common-echo'

interface DeleteMsgEcho extends CommonEchoMessage {
  echo: DeleteMsgCarried
}

interface DeleteMsgCarried extends EchoedObject {
  action: WsActions.DeleteMsg
  t: UnifyInfoType
  id: number
  message_id: number
}

function dispatch(data: DeleteMsgEcho) {
  toast('Recalled a message.')
  const { t, id, message_id } = data.echo
  if (t === UnifyInfoType.Private) {
    const session = friendConvStore[id]
    if (session) {
    const i = session.list.findIndex(m => m.message_id === message_id)
      setFriendConvStore(id, 'list', i, 'deleted', true)
    }
  } else if (t === UnifyInfoType.Group) {
    const session = groupConvStore[id]
    if (session) {
      const i = session.list.findIndex(m => m.message_id === message_id)
      setGroupConvStore(id, 'list', i, 'deleted', true)
    }
  }
}

export type { DeleteMsgEcho, DeleteMsgCarried }
export { dispatch as dispatchDeleteMsgEcho }
