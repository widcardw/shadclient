import { IcOutlineBrokenImage } from '@/components/icons/image-broken'
import { Skeleton } from '@/components/ui/skeleton'
import type { CommonJsonCardMessage } from '@/libs/types/messages/common-message'
import { transformLink } from '@/libs/utils/transform-link'
import { type Component, For, Show, createSignal } from 'solid-js'
import { useImage } from 'solidjs-use'

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
  const { isLoading: icoLoading, error: icoError } = useImage({
    src: props.card.icon,
  })
  const { isLoading: prevLoading, error: prevError } = useImage({
    src: formatPreviewUrl(props.card.preview),
  })

  return (
    <a
      href={props.card.qqdocurl}
      target="_blank"
      rel="noreferrer"
      class="block text-primary bg-muted rounded-md space-y-1 !decoration-none"
      style={{ width: 'max-content' }}
    >
      <div class="flex items-center space-x-2">
        <Show when={!icoLoading()} fallback={<Skeleton class="w-4 h-4" />}>
          <Show
            when={!icoError()}
            fallback={<IcOutlineBrokenImage class="w-4 h-4" />}
          >
            <img
              class="w-4 h-4 rounded-2px"
              src={props.card.icon}
              alt="[miniapp]"
              referrerPolicy="no-referrer"
            />
          </Show>
        </Show>
        <div class="font-bold text-sm text-foreground/70">
          {props.card.title}
        </div>
      </div>
      <div>{props.card.desc}</div>
      <Show
        when={!prevLoading()}
        fallback={<Skeleton class="w-300px h-200px" />}
      >
        <Show
          when={!prevError()}
          fallback={<Skeleton class="w-300px h-200px animate-none" />}
        >
          <img
            src={formatPreviewUrl(props.card.preview)}
            alt="[preview]"
            referrerPolicy="no-referrer"
            class="max-w-400px rounded"
          />
        </Show>
      </Show>
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
