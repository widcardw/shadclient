import { toast } from 'solid-sonner'
import type { AllWsObject } from './common-ws-object'
import type { AllEchoTypes } from './echo/common-echo'

import type { AllMessageWsObject } from './message/common-message-ws-object'
import { dispatchGroupMessageWsObject, getGroupName } from './message/group-message-ws-object'
import { dispatchPrivateMessageWsObject } from './message/private-message-ws-object'

import { ws } from '@/libs/states/connection'
import { recentList, setRecentList } from '@/libs/states/sessions'
import { WsActionToApi, WsActions } from '@/libs/ws/websocket'
import {
  type DeleteMsgEcho,
  dispatchDeleteMsgEcho,
} from './echo/delete-msg-echo'
import {
  type ForwardedEcho,
  dispatchForwardedEcho,
} from './echo/forwarded-echo'
import {
  type FriendListEcho,
  dispatchGetFriendListEcho,
} from './echo/friend-list-echo'
import {
  type FriendHistoryEcho,
  dispatchGetFriendHistoryEcho,
} from './echo/get-friend-history-echo'
import {
  type GroupHistoryEcho,
  dispatchGroupHistoryEcho,
} from './echo/get-group-history-echo'
import { type GetGroupInfoEcho, dispatchGetGroupInfoEcho } from './echo/get-group-info-echo'
import {
  type GroupFileUrlEcho,
  type GroupFilesByFolderEcho,
  type GroupRootFilesEcho,
  dispatchGroupFileUrlEcho,
  dispatchGroupFilesByFolderEcho,
  dispatchGroupRootFilesEcho,
} from './echo/group-files-echo'
import {
  type GroupListEcho,
  dispatchGroupListEcho,
} from './echo/group-list-echo'
import { type SendMsgEcho, dispatchSendMsgEcho } from './echo/send-msg-echo'
import type {
  AllMetaEventWsObject,
  CommonMetaEventWsObject,
} from './meta_event/common-meta-ws-object'
import type { AllNoticeWsObject } from './notice/common-notice-ws-object'
import { dispatchGroupFileNoticeWsObject } from './notice/group-file-notice-ws-object'
import { dispatchGroupRecallNoticeWsObject } from './notice/group-recall-notice-ws-object'
import { dispatchPrivateFileNoticeWsObject } from './notice/private-file-notice-ws-object'
import { dispatchPrivatePokeNoticeWsObject } from './notice/private-poke-notice-ws-object'
import { dispatchPrivateRecallNoticeWsObject } from './notice/private-recall-notice-ws-object'
import type { AllRequestWsObject } from './request/common-request-ws-object'
import { dispatchFriendAddRequestWsObject } from './request/friend-add-request-ws-object'
import { dispatchGroupAddRequestWsObject } from './request/group-add-request-ws-object'
import { UnifyInfoType } from './unify-info'

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
        toast.error('Received unsupported post type')
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
      description: `${WsActionToApi[data.echo.action]}, retcode: ${data.retcode}`,
      duration: Number.POSITIVE_INFINITY,
    })
    console.error('Error occured in echo', data)
    return
  }
  // TODO: 按照一定的规则划分 echo，其内容是 JSON.stringify 的字符串，具体请查看 buildEcho
  switch (data.echo.action) {
    case WsActions.DeleteMsg: {
      dispatchDeleteMsgEcho(data as DeleteMsgEcho)
      break
    }
    case WsActions.GetForwardMsg: {
      dispatchForwardedEcho(data as ForwardedEcho)
      break
    }
    case WsActions.GetFriendList: {
      dispatchGetFriendListEcho(data as FriendListEcho)
      break
    }
    case WsActions.GetFriendMsgHistory: {
      dispatchGetFriendHistoryEcho(data as FriendHistoryEcho)
      break
    }
    case WsActions.GetGroupFileUrl: {
      dispatchGroupFileUrlEcho(data as GroupFileUrlEcho)
      break
    }
    case WsActions.GetGroupFilesByFolder: {
      dispatchGroupFilesByFolderEcho(data as GroupFilesByFolderEcho)
      break
    }
    case WsActions.GetGroupList: {
      dispatchGroupListEcho(data as GroupListEcho)
      break
    }
    case WsActions.GetGroupMsgHistory: {
      dispatchGroupHistoryEcho(data as GroupHistoryEcho)
      break
    }
    case WsActions.GetGroupRootFiles: {
      dispatchGroupRootFilesEcho(data as GroupRootFilesEcho)
      break
    }
    case WsActions.GetMsg: {
      break
    }
    case WsActions.SendGroupMsg:
    case WsActions.SendPrivateMsg: {
      dispatchSendMsgEcho(data as SendMsgEcho)
      break
    }
    case WsActions.UploadGroupFile: {
      // TODO
      break
    }
    case WsActions.UploadPrivateFile: {
      // TODO
      break
    }
    case WsActions.GetGroupInfo: {
      dispatchGetGroupInfoEcho(data as GetGroupInfoEcho)
      break
    }
    case WsActions.SetFriendAddRequest: {
      break
    }
    case WsActions.SetGroupAddRequest: {
      break
    }
    default: {
      toast.error('Received unknown echo object')
      console.error('Received unknown echo object', data)
    }
  }
}

/** 接收到群聊或者私聊消息，暂时还没写临时会话消息的适配 */
function dispatchCommonWsObject(data: AllMessageWsObject) {
  switch (data.message_type) {
    case 'group': {
      const group_id = data.group_id
      dispatchGroupMessageWsObject(data)
      if (!recentList().find(i => i.type === UnifyInfoType.Group && i.group_id === group_id))
        setRecentList(prev => [...prev, { type: UnifyInfoType.Group, group_id, group_name: getGroupName(group_id) }])
      break
    }
    case 'private': {
      const user_id = data.user_id
      dispatchPrivateMessageWsObject(data)
      if (!recentList().find(i => i.type === UnifyInfoType.Private && i.user_id === data.user_id))
        setRecentList(prev => [...prev, { type: UnifyInfoType.Private, user_id, nickname: data.sender.nickname }])
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
      dispatchPrivatePokeNoticeWsObject(data)
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
      if (d2.sub_type === 'connect') {
        toast.success('Lifecycle successfully created!')
        // 获取好友和群组列表
        ws()?.send(WsActions.GetFriendList, {}, {})
        ws()?.send(WsActions.GetGroupList, {}, {})
      } else {
        toast(`Onebot ${d2.sub_type}`)
      }
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
