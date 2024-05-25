import type {
  CommonAtMessage,
  CommonFaceMessage,
  CommonFileMessage,
  CommonForwardMessage,
  CommonImageMessage,
  CommonJsonCardMessage,
  CommonReplyMessage,
  CommonTextMessage,
} from '@/libs/types/messages/common-message'
import type { MultiTypeReceivedMessage } from '@/libs/types/messages/received-message'
import { type Component, Match, Switch } from 'solid-js'
import { AtMessage } from './AtMessage'
import { FaceMessage } from './FaceMessage'
import { FileMessage } from './FileMessage'
import { ForwardMessageFolded } from './ForwardMessage'
import { ImageMessage } from './ImageMessage'
import { JsonMessage } from './JsonMessage'
import { ReplyMessage } from './ReplyMessage'
import { TextMessage } from './TextMessage'
import { UnsupportedMessage } from './UnsupportedMessage'

const UnifiedMessage: Component<{ m: MultiTypeReceivedMessage }> = (props) => {
  return (
    <Switch fallback={<UnsupportedMessage m={props.m} />}>
      <Match when={props.m.type === 'text'}>
        <TextMessage m={props.m as CommonTextMessage} />
      </Match>
      <Match when={props.m.type === 'at'}>
        <AtMessage m={props.m as CommonAtMessage} />
      </Match>
      <Match when={props.m.type === 'reply'}>
        <ReplyMessage m={props.m as CommonReplyMessage} />
      </Match>
      <Match when={props.m.type === 'face'}>
        <FaceMessage m={props.m as CommonFaceMessage} />
      </Match>
      <Match when={props.m.type === 'file'}>
        <FileMessage m={props.m as CommonFileMessage} />
      </Match>
      <Match when={props.m.type === 'image'}>
        <ImageMessage m={props.m as CommonImageMessage} />
      </Match>
      <Match when={props.m.type === 'json'}>
        <JsonMessage m={props.m as CommonJsonCardMessage} />
      </Match>
      <Match when={props.m.type === 'forward'}>
        <ForwardMessageFolded m={props.m as CommonForwardMessage} />
      </Match>
    </Switch>
  )
}

export { UnifiedMessage }
