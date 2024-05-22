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
  /** 撤回消息 { msg_id: number } */
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
}

const WsActionToApi: Record<WsActions, string> = {
  [WsActions.DeleteMsg]: 'delete_msg',
  [WsActions.GetForwardMsg]: 'get_forward_msg',
  [WsActions.GetFriendList]: 'get_friedn_list',
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
        description: `Cannot connect to server at ${
          (ev.target as WebSocket).url
        }`,
      })
    })
    this.ws.addEventListener('open', (ev) => {
      console.log('connection open', ev)
      toast.success('Connection open!')
    })
    this.ws.addEventListener('close', function (ev) {
      console.log('connection close', ev)
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
