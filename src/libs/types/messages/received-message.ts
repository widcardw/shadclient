import type {
  CommonTextMessage,
  CommonReplyMessage,
  CommonImageMessage,
  CommonAtMessage,
  CommonJsonCardMessage,
  CommonFaceMessage,
  CommonRecordMessage,
  CommonForwardMessage,
  CommonFileMessage,
  CommonVideoMessage,
} from './common-message'

type MultiTypeReceivedMessage =
  | CommonTextMessage
  | CommonReplyMessage
  | CommonImageMessage
  | CommonAtMessage
  | CommonJsonCardMessage
  | CommonFaceMessage
  | CommonRecordMessage
  | CommonForwardMessage
  | CommonFileMessage
  | CommonVideoMessage

/**
 * 接收到的消息，应该说是 message 这个属性的内容，而不是整个消息的对象
 */
type CqReceivedMessage = MultiTypeReceivedMessage | MultiTypeReceivedMessage[]

export type { CqReceivedMessage, MultiTypeReceivedMessage }
