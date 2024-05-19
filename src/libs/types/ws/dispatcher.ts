import { toast } from 'solid-sonner'
import type { AllWsObject } from './common-ws-object'
import type { AllEchoTypes } from './echo/common-echo'
import type {
  AllMessageWsObject,
  CommonMessageWsObject,
} from './message/common-message-ws-object'
import type {
  AllMetaEventWsObject,
  CommonMetaEventWsObject,
} from './meta_event/common-meta-ws-object'
import type {
  AllNoticeWsObject,
  CommonNoticeWsObject,
} from './notice/common-notice-ws-object'

/**
 * 将接收到的消息发派到各个处理函数上
 * @param data WebSocket 接收到的消息对象，可能是带有 post_type 的或者是 echo 的消息
 */
function dispatchMessage(data: any) {
  // if the message contains `echo`, it will be handled by `echo` handlers
  if (Object.hasOwn(data, 'echo')) {
    const d = data as AllEchoTypes
    dispatchEchoWsObject(d)
    console.log(d)
  } else if (Object.hasOwn(data, 'post_type')) {
    const d = data as AllWsObject
    switch (d.post_type) {
      case 'message': {
        dispatchCommonWsObject(d)
        console.log(d)
        break
      }
      case 'notice': {
        dispatchNoticeWsObject(d)
        console.log(d)
        break
      }
      case 'meta_event': {
        dispatchMetaWsObject(d)
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
    })
    console.error(data)
    return
  }
  // TODO: 按照一定的规则划分 echo，还要考虑一下，要不要把 echo 的内容变成一个 JSON 字符串，这样可能效率并不高
}

/** 接收到群聊或者私聊消息，暂时还没写临时会话消息的适配 */
function dispatchCommonWsObject(data: CommonMessageWsObject) {
  const d2 = data as AllMessageWsObject
  switch (d2.message_type) {
    case 'group': {
      break
    }
    case 'private': {
      break
    }
    default: {
      console.log('Received unsupported message ws object', data)
    }
  }
}

/** 接收到通知，包括好友申请、撤回消息、文件上传、拍一拍 */
function dispatchNoticeWsObject(data: CommonNoticeWsObject) {
  const d2 = data as AllNoticeWsObject
  switch (d2.notice_type) {
    case 'friend_add': {
      break
    }
    case 'friend_recall': {
      break
    }
    case 'group_recall': {
      break
    }
    case 'group_upload': {
      break
    }
    case 'offline_file': {
      break
    }
    case 'poke': {
      break
    }
    default: {
      console.log('Received unsupported notice ws object', data)
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
