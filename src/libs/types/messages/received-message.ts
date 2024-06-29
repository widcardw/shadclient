import type {
  CommonAtMessage,
  CommonFaceMessage,
  CommonFileMessage,
  CommonForwardMessage,
  CommonImageMessage,
  CommonJsonCardMessage,
  CommonMFaceMessage,
  CommonMarketFaceMessage,
  CommonRecordMessage,
  CommonReplyMessage,
  CommonTextMessage,
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
  | CommonMarketFaceMessage
  | CommonMFaceMessage

/**
 * 接收到的消息，应该说是 message 这个属性的内容，而不是整个消息的对象
 */
type CqReceivedMessage = MultiTypeReceivedMessage[]

export type { CqReceivedMessage, MultiTypeReceivedMessage }
