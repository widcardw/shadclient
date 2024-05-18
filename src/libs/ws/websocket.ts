import { setConnection } from '@/libs/states/connection'
import { toast } from 'solid-sonner'

// WebSocket 发送请求参考 https://github.com/botuniverse/onebot-11/blob/master/communication/ws.md
enum WsActions {
  /** 发送私聊 { user_id: number, message: CqSentMessage } */
  SendPrivateMsg = 'send_private_msg',
  /** 发送群聊 { group_id: number, message: CqSentMessage } */
  SendGroupMsg = 'send_group_msg',
  /** 获取消息 { message_id number } */
  GetMsg = 'get_msg',
  /** 获取合并转发消息 { id: string } 原来 go-cqhttp 是 { message_id: string } */
  GetForwardMsg = 'get_forward_msg',
  /** 撤回消息 { msg_id: number } */
  DeleteMsg = 'delete_msg',
  /** 获取好友列表 无参数 */
  GetFriendList = 'get_friend_list',
  /** 获取群聊列表 无参数 */
  GetGroupList = 'get_group_list',
  /** 获取群历史消息 { message_id: number, group_id: number, count: number } go-cqhttp 为 { message_seq: number, group_id: number } */
  GetGroupMsgHistory = 'get_group_msg_history',
  /** 获取好友历史消息 { user_id: number, message_id: number, count: number } */
  GetFriendMsgHistory = 'get_friend_msg_history',
  /** 获取群文件根目录 { group_id: number } */
  GetGroupRootFiles = 'get_group_root_files',
  /**  获取群文件列表 { group_id: number, folder_id: string } */
  GetGroupFilesByFolder = 'get_group_files_by_folder',
  /** 获取文件的下载地址 { group_id: number, file_id: string, busid: number } */
  GetGroupFileUrl = 'get_group_file_url',
  /** 上传群文件 { group_id: number, file: 本地文件路径, name: string, folder: 父目录 id } */
  UploadGroupFile = 'upload_group_file',
  /** 上传私聊文件 { user_id: number, file: 本地文件路径, name: string } */
  UploadPrivateFile = 'upload_private_file',
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
      toast.info('Connection closed!', {
        duration: Number.POSITIVE_INFINITY,
      })
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

  send(action: WsActions, params?: any, echo?: string) {
    this.ws.send(JSON.stringify({ action, params, echo }))
  }
}

export { SimpleWebSocket, WsActions }
