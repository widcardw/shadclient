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

type CqReceivedMessage = MultiTypeReceivedMessage | MultiTypeReceivedMessage[]

export type { CqReceivedMessage, MultiTypeReceivedMessage }
