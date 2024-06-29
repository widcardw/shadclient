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
} from '@/libs/types/messages/common-message'
import type { MultiTypeReceivedMessage } from '@/libs/types/messages/received-message'
import { type Component, Match, Switch } from 'solid-js'
import { AtMessage } from './AtMessage'
import { FaceMessage, MFaceMessage, MarketFaceMessage } from './FaceMessage'
import { FileMessage } from './FileMessage'
import { ForwardMessageFolded } from './ForwardMessage'
import { ImageMessage } from './ImageMessage'
import { JsonMessage } from './JsonMessage'
import { RecordMessage } from './RecordMessage'
import { ReplyMessage } from './ReplyMessage'
import { TextMessage } from './TextMessage'
import { UnsupportedMessage } from './UnsupportedMessage'
import { VideoMessage } from './VideoMessage'

const UnifiedMessage: Component<{ m: MultiTypeReceivedMessage }> = (props) => {
  return (
    <Switch fallback={<UnsupportedMessage m={props.m} />}>
      <Match when={props.m?.type === 'text'}>
        <TextMessage m={props.m as CommonTextMessage} />
      </Match>
      <Match when={props.m?.type === 'at'}>
        <AtMessage m={props.m as CommonAtMessage} />
      </Match>
      <Match when={props.m?.type === 'reply'}>
        <ReplyMessage m={props.m as CommonReplyMessage} />
      </Match>
      <Match when={props.m?.type === 'face'}>
        <FaceMessage m={props.m as CommonFaceMessage} />
      </Match>
      <Match when={props.m?.type === 'file'}>
        <FileMessage m={props.m as CommonFileMessage} />
      </Match>
      <Match when={props.m?.type === 'image'}>
        <ImageMessage m={props.m as CommonImageMessage} />
      </Match>
      <Match when={props.m?.type === 'json'}>
        <JsonMessage m={props.m as CommonJsonCardMessage} />
      </Match>
      <Match when={props.m?.type === 'marketface'}>
        <MarketFaceMessage m={props.m as CommonMarketFaceMessage} />
      </Match>
      <Match when={props.m?.type === 'mface'}>
        <MFaceMessage m={props.m as CommonMFaceMessage} />
      </Match>
      <Match when={props.m?.type === 'record'}>
        <RecordMessage m={props.m as CommonRecordMessage} />
      </Match>
      <Match when={props.m?.type === 'forward'}>
        <ForwardMessageFolded m={props.m as CommonForwardMessage} />
      </Match>
      <Match when={props.m?.type === 'video'}>
        <VideoMessage m={props.m as CommonVideoMessage} />
      </Match>
    </Switch>
  )
}

export { UnifiedMessage }
