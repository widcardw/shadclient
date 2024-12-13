import { setConnection } from '@/libs/states/connection'
import { toast } from 'solid-sonner'
import { type EchoedObject, buildEcho } from '../types/ws/echo/common-echo'

// WebSocket 发送请求参考 https://github.com/botuniverse/onebot-11/blob/master/communication/ws.md
enum WsActions {
  Unknown = 0,
  /** 发送私聊 { user_id: number, message: CqSentMessage } */
  SendPrivateMsg = 1,
  /** 发送群聊 { group_id: number, message: CqSentMessage } */
  SendGroupMsg = 2,
  /** 获取消息 { message_id number } */
  GetMsg = 3,
  /** 获取合并转发消息 { id: string } 原来 go-cqhttp 是 { message_id: string } */
  GetForwardMsg = 4,
  /** 撤回消息 { message_id: number } */
  DeleteMsg = 5,
  /** 获取好友列表 无参数 */
  GetFriendList = 6,
  /** 获取群聊列表 无参数 */
  GetGroupList = 7,
  /** 获取群历史消息 { message_id: number, group_id: number, count: number } go-cqhttp 为 { message_seq: number, group_id: number } */
  GetGroupMsgHistory = 8,
  /** 获取好友历史消息 { user_id: number, message_id: number, count: number } */
  GetFriendMsgHistory = 9,
  /** 获取群文件根目录 { group_id: number } */
  GetGroupRootFiles = 10,
  /**  获取群文件列表 { group_id: number, folder_id: string } */
  GetGroupFilesByFolder = 11,
  /** 获取文件的下载地址 { group_id: number, file_id: string, busid: number } */
  GetGroupFileUrl = 12,
  /** 上传群文件 { group_id: number, file: 本地文件路径, name: string, folder: 父目录 id } */
  UploadGroupFile = 13,
  /** 上传私聊文件 { user_id: number, file: 本地文件路径, name: string } */
  UploadPrivateFile = 14,
  /** 处理加好友请求 { flag: string, approve: boolean, remark?: string } */
  SetFriendAddRequest = 15,
  /** 处理加群请求／邀请 { flag: string, approve: boolean, sub_type/type 与上报时的一致, reason?: 拒绝理由 } */
  SetGroupAddRequest = 16,
  /** 获取群信息 { group_id: number, no_cache: boolean } */
  GetGroupInfo = 17,
  /** 获取群成员信息 { group_id: number } */
  GetGroupMemberList = 18,
}

const WsActionToApi: Record<WsActions, string> = {
  [WsActions.DeleteMsg]: 'delete_msg',
  [WsActions.GetForwardMsg]: 'get_forward_msg',
  [WsActions.GetFriendList]: 'get_friend_list',
  [WsActions.GetFriendMsgHistory]: 'get_friend_msg_history',
  [WsActions.GetGroupFileUrl]: 'get_group_file_url',
  [WsActions.GetGroupFilesByFolder]: 'get_group_files_by_folder',
  [WsActions.GetGroupList]: 'get_group_list',
  [WsActions.GetGroupMsgHistory]: 'get_group_msg_history',
  [WsActions.GetGroupRootFiles]: 'get_group_root_files',
  [WsActions.GetMsg]: 'get_msg',
  [WsActions.SendGroupMsg]: 'send_group_msg',
  [WsActions.SendPrivateMsg]: 'send_private_msg',
  [WsActions.UploadGroupFile]: 'upload_group_file',
  [WsActions.UploadPrivateFile]: 'upload_private_file',
  [WsActions.SetFriendAddRequest]: 'set_friend_add_request',
  [WsActions.SetGroupAddRequest]: 'set_group_add_request',
  [WsActions.GetGroupInfo]: 'get_group_info',
  [WsActions.GetGroupMemberList]: 'get_group_member_list',
  [WsActions.Unknown]: ''
}

class SimpleWebSocket {
  ws: WebSocket

  constructor(url: string) {
    this.ws = new WebSocket(url)
  }

  connect() {
    this.ws.addEventListener('error', (ev) => {
      setConnection()
      console.error(ev)
      toast.error('Connection error!', {
        duration: Number.POSITIVE_INFINITY,
        description: `Cannot connect to server at ${(ev.target as WebSocket).url
          }`,
      })
    })
    this.ws.addEventListener('open', (ev) => {
      console.log('connection established', ev)
      toast.success('Connection established!')
    })
    this.ws.addEventListener('close', function (ev) {
      console.log('connection close', ev)
      setConnection({ connect: false })
      toast.info('Connection closed!')
    })
  }

  listen(cb: (o: any) => void) {
    this.ws.addEventListener('message', (ev) => {
      try {
        cb(JSON.parse(ev.data))
      } catch (e) {
        console.error(e)
      }
    })
  }

  disconnect() {
    if (this.ws) this.ws.close()
  }

  send(action: WsActions, params: any, echo: Record<string, any>) {
    console.log('Send data', {
      action: WsActionToApi[action],
      params,
      echo: buildEcho(action, echo),
    })
    this.ws.send(
      JSON.stringify({
        action: WsActionToApi[action],
        params,
        echo: buildEcho(action, echo),
      }),
    )
  }
}

export { SimpleWebSocket, WsActions, WsActionToApi }
