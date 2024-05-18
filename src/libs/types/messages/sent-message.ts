import type {
  CommonAtMessage,
  CommonFileMessage,
  CommonImageMessage,
  CommonMessageSegment,
  CommonTextMessage,
} from './common-message'

type MultiTypeSentMessage =
  | CommonTextMessage
  | CommonMessageSegment
  | CommonImageMessage
  | CommonFileMessage

/**
 * 发送的消息的内容，即 message 属性的内容，不包含整个消息的对象
 */
type CqSentMessage = MultiTypeSentMessage | MultiTypeSentMessage[]

function createTextMessage(text: string): CommonTextMessage {
  return {
    type: 'text',
    data: { text },
  }
}

function createMessageSegment(
  type: string,
  data: { [key: string]: string },
): CommonMessageSegment {
  return { type, data }
}

function createImageMessage(file: string): CommonImageMessage {
  return {
    type: 'image',
    data: { file },
  }
}

function createFileMessage(url: string, name?: string): CommonFileMessage {
  return {
    type: 'file',
    data: {
      file: url,
      name: name || url.split('/').pop()?.slice(0, 32) || 'no_name',
    },
  }
}

function createAtMessage(qq: number): CommonAtMessage {
  return {
    type: 'at',
    data: { qq },
  }
}

function _createFileMessage(file: {
  name: string
  file: string
  size: number
}): CommonFileMessage {
  return {
    type: 'file',
    data: file,
  }
}

export type { CqSentMessage, MultiTypeSentMessage }
export {
  createTextMessage,
  createMessageSegment,
  createImageMessage,
  createFileMessage,
  createAtMessage,
  _createFileMessage,
}
