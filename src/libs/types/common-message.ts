interface CommonMessageType {
  type: string
}

interface CommonTextMessage extends CommonMessageType {
  type: 'text'
  data: {
    /**
     * 消息内容
     */
    text: string
  }
}

interface CommonReplyMessage extends CommonMessageType {
  type: 'reply'
  data: {
    /**
     * 消息 id
     */
    id: number
  }
}

interface CommonImageMessage extends CommonMessageType {
  type: 'image'
  data: {
    /**
     * 图片的路径
     */
    file: string
    url?: string
  }
}

interface CommonAtMessage extends CommonMessageType {
  type: 'at'
  data: {
    qq: number
  }
}

interface CommonFileMessage extends CommonMessageType {
  type: 'file'
  data: {
    /**
     * 文件的路径
     */
    file: string
    /**
     * 文件名
     */
    name: string
    size?: number
  }
}

interface CommonJsonCardMessage extends CommonMessageType {
  type: 'json'
  data: {
    data: string
  }
}

interface CommonFaceMessage extends CommonMessageType {
  type: 'face'
  data: {
    id: string
  }
}

interface CommonRecordMessage extends CommonMessageType {
  type: 'record'
  data: {
    file: string
    url: string
  }
}

interface CommonVideoMessage extends CommonMessageType {
  type: 'video'
  data: {
    file: string
    url: string
  }
}

interface CommonForwardMessage extends CommonMessageType {
  type: 'forward'
  data: {
    id: string
  }
  details?: any // TODO: ReceivedForwardedMessage
}

interface CommonMessageSegment extends CommonMessageType {
  type: string
  data: { [key: string]: string }
}

export type {
  CommonAtMessage,
  CommonFaceMessage,
  CommonFileMessage,
  CommonForwardMessage,
  CommonImageMessage,
  CommonJsonCardMessage,
  CommonMessageSegment,
  CommonRecordMessage,
  CommonReplyMessage,
  CommonTextMessage,
  CommonVideoMessage,
}
