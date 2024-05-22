import { toast } from 'solid-sonner'
import type { AllWsObject } from './common-ws-object'
import type { AllEchoTypes } from './echo/common-echo'

import type {
  AllMessageWsObject,
} from './message/common-message-ws-object'
import { dispatchGroupMessageWsObject } from './message/group-message-ws-object'
import { dispatchPrivateMessageWsObject } from './message/private-message-ws-object'

import { WsActions } from '@/libs/ws/websocket'
import type {
  AllMetaEventWsObject,
  CommonMetaEventWsObject,
} from './meta_event/common-meta-ws-object'
import type {
  AllNoticeWsObject,
} from './notice/common-notice-ws-object'
import { dispatchGroupFileNoticeWsObject } from './notice/group-file-notice-ws-object'
import { dispatchGroupRecallNoticeWsObject } from './notice/group-recall-notice-ws-object'
import { dispatchPrivateFileNoticeWsObject } from './notice/private-file-notice-ws-object'
import { dispatchPrivateRecallNoticeWsObject } from './notice/private-recall-notice-ws-object'
import type { AllRequestWsObject } from './request/common-request-ws-object'
import { dispatchFriendAddRequestWsObject } from './request/friend-add-request-ws-object'
import { dispatchGroupAddRequestWsObject } from './request/group-add-request-ws-object'

/**
 * 将接收到的消息发派到各个处理函数上
 * @param data WebSocket 接收到的消息对象，可能是带有 post_type 的或者是 echo 的消息
 */
function dispatchMessage(data: any) {
  // if the message contains `echo`, it will be handled by `echo` handlers
  if (Object.hasOwn(data, 'echo')) {
    const d = data as AllEchoTypes
    try {
      d.echo = JSON.parse(data.echo)
    } catch (e) {
      d.echo = { action: WsActions.Unknown }
    }
    dispatchEchoWsObject(d)
    console.log(d)
  } else if (Object.hasOwn(data, 'post_type')) {
    const d = data as AllWsObject
    switch (d.post_type) {
      case 'message': {
        dispatchCommonWsObject(d as AllMessageWsObject)
        console.log(d)
        break
      }
      case 'meta_event': {
        dispatchMetaWsObject(d as AllMetaEventWsObject)
        break
      }
      case 'notice': {
        dispatchNoticeWsObject(d as AllNoticeWsObject)
        console.log(d)
        break
      }
      case 'request': {
        dispatchReuqestWsObject(d as AllRequestWsObject)
        console.log(d)
        break
      }
      default: {
        console.log('Received unsupported post type', data)
      }
    }
  } else {
    console.log('Received unsupported ws message', data)
  }
}

function dispatchEchoWsObject(data: AllEchoTypes) {
  // echo 的内容可能会比较复杂，甚至还包含了是否发送成功
  if (data.retcode !== 0) {
    toast.error('Error occurred in echo', {
      description: `${data.echo}, retcode: ${data.retcode}`,
      duration: Number.POSITIVE_INFINITY,
    })
    console.error(data)
    return
  }
  // TODO: 按照一定的规则划分 echo，其内容是 JSON.stringify 的字符串，具体请查看 buildEcho
  switch (data.echo.action) {
    case WsActions.DeleteMsg: {
      break
    }
    case WsActions.GetForwardMsg: {
      break
    }
    case WsActions.GetFriendList: {
      break
    }
    case WsActions.GetFriendMsgHistory: {
      break
    }
    case WsActions.GetGroupFileUrl: {
      break
    }
    case WsActions.GetGroupFilesByFolder: {
      break
    }
    case WsActions.GetGroupList: {
      break
    }
    case WsActions.GetGroupMsgHistory: {
      break
    }
    case WsActions.GetGroupRootFiles: {
      break
    }
    case WsActions.GetMsg: {
      break
    }
    case WsActions.SendGroupMsg: {
      break
    }
    case WsActions.SendPrivateMsg: {
      break
    }
    case WsActions.UploadGroupFile: {
      break
    }
    case WsActions.UploadPrivateFile: {
      break
    }
    default: {
      console.error('Received unknown echo object', data)
    }
  }
}

/** 接收到群聊或者私聊消息，暂时还没写临时会话消息的适配 */
function dispatchCommonWsObject(data: AllMessageWsObject) {
  switch (data.message_type) {
    case 'group': {
      dispatchGroupMessageWsObject(data)
      break
    }
    case 'private': {
      dispatchPrivateMessageWsObject(data)
      break
    }
    default: {
      console.log('Received unsupported message ws object', data)
    }
  }
}

/** 接收到通知，包括好友添加、撤回消息、文件上传、拍一拍 */
function dispatchNoticeWsObject(data: AllNoticeWsObject) {
  switch (data.notice_type) {
    case 'friend_add': {
      // TODO: 可能只需要 toast 一下？不知道这是什么 api
      break
    }
    case 'friend_recall': {
      dispatchPrivateRecallNoticeWsObject(data)
      break
    }
    case 'group_recall': {
      dispatchGroupRecallNoticeWsObject(data)
      break
    }
    case 'group_upload': {
      dispatchGroupFileNoticeWsObject(data)
      break
    }
    case 'offline_file': {
      dispatchPrivateFileNoticeWsObject(data)
      break
    }
    case 'poke': {
      // TODO
      break
    }
    default: {
      console.log('Received unsupported notice ws object', data)
    }
  }
}

/** 好友添加请求的处理，或者是群邀请的处理 */
function dispatchReuqestWsObject(data: AllRequestWsObject) {
  switch (data.request_type) {
    case 'friend': {
      dispatchFriendAddRequestWsObject(data)
      break
    }
    case 'group': {
      dispatchGroupAddRequestWsObject(data)
      break
    }
    default: {
      console.log('Received unsupported request ws object', data)
    }
  }
}

/** 元信息的处理，主要是检测是否连接成功，心跳暂时没有做检测 */
function dispatchMetaWsObject(data: CommonMetaEventWsObject) {
  const d2 = data as AllMetaEventWsObject
  switch (d2.meta_event_type) {
    case 'lifecycle': {
      toast.success('Lifecycle successfully created!')
      break
    }
    case 'heartbeat': {
      break
    }
    default: {
      console.log('Received unsupported meta event ws object', data)
    }
  }
}

export { dispatchMessage }
