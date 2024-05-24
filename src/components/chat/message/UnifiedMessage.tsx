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

const UnifiedMessage: Component<MultiTypeReceivedMessage> = (props) => {
  return (
    <Switch fallback={<UnsupportedMessage {...props} />}>
      <Match when={props.type === 'text'}>
        <TextMessage {...(props as CommonTextMessage)} />
      </Match>
      <Match when={props.type === 'at'}>
        <AtMessage {...(props as CommonAtMessage)} />
      </Match>
      <Match when={props.type === 'reply'}>
        <ReplyMessage {...(props as CommonReplyMessage)} />
      </Match>
      <Match when={props.type === 'face'}>
        <FaceMessage {...(props as CommonFaceMessage)} />
      </Match>
      <Match when={props.type === 'file'}>
        <FileMessage {...(props as CommonFileMessage)} />
      </Match>
      <Match when={props.type === 'image'}>
        <ImageMessage {...(props as CommonImageMessage)} />
      </Match>
      <Match when={props.type === 'json'}>
        <JsonMessage {...(props as CommonJsonCardMessage)} />
      </Match>
      <Match when={props.type === 'forward'}>
        <ForwardMessageFolded {...(props as CommonForwardMessage)} />
      </Match>
    </Switch>
  )
}

export { UnifiedMessage }
