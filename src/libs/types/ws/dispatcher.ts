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

function dispatchMessage(data: any) {
  // if the message contains `echo`, it will be handled by `echo` handlers
  if (Object.hasOwn(data, 'echo')) {
    const d = data as AllEchoTypes
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
