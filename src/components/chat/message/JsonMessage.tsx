import type { CommonJsonCardMessage } from '@/libs/types/messages/common-message'
import { transformLink } from '@/libs/utils/transform-link'
import { type Component, For, Show } from 'solid-js'

interface JsonCardDetail {
  appid: string
  appType: number
  title: string
  desc: string
  icon: string
  preview: string
  url: string
  scene: number
  host: {
    uin: number
    nick: string
  }
  shareTemplateId: string
  shareTemplateData: any
  qqdocurl: string
}

interface JsonCardDataType {
  ver: string
  prompt: string
  config: any
  app: string
  view: string
  meta: Record<string, JsonCardDetail>
}

function formatPreviewUrl(url: string) {
  if (url.startsWith('http')) return url
  return `https://${url}`
}

const MiniappCard: Component<{ card: JsonCardDetail }> = (props) => {
  return (
    <a
      href={props.card.qqdocurl}
      target="_blank"
      rel="noreferrer"
      class="block text-primary"
    >
      <div class="flex items-center gap-2">
        <img
          class="w-4 h-4 rounded-2px"
          src={props.card.icon}
          alt="[miniapp]"
          referrerPolicy="no-referrer"
        />
        <div class="font-bold">{props.card.title}</div>
      </div>
      <div>{props.card.desc}</div>
      <img
        src={formatPreviewUrl(props.card.preview)}
        alt="[preview]"
        referrerPolicy="no-referrer"
        class="max-w-400px rounded"
      />
    </a>
  )
}

const JsonMessage: Component<{ m: CommonJsonCardMessage }> = (props) => {
  const data = JSON.parse(props.m.data.data) as JsonCardDataType
  return (
    <>
      <Show when={data.app.includes('miniapp')}>
        <For each={Object.keys(data.meta)}>
          {(key) => <MiniappCard card={data.meta[key]} />}
        </For>
      </Show>
      <details>
        <summary>JSON</summary>
        <pre class="whitespace-pre-wrap break-all">
          {transformLink(JSON.stringify(data, null, 2))}
        </pre>
      </details>
    </>
  )
}

export { JsonMessage }
