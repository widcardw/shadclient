import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import type { CommonImageMessage } from '@/libs/types/messages/common-message'
import type { DialogTriggerProps } from '@kobalte/core/dialog'
import clsx from 'clsx'
import { type Component, Match, Show, Switch, createSignal } from 'solid-js'

enum ImageLoadingStatus {
  Loading = 0,
  Success = 1,
  Error = 2,
}

const ImageMessage: Component<{ m: CommonImageMessage }> = (props) => {
  return (
    <img
      src={props.m.data.url}
      alt="图片"
      referrerPolicy="no-referrer"
      class="max-w-400px max-h-400px block"
    />
  )
}

const ZommImageMessage: Component<{ m: CommonImageMessage }> = (props) => {
  const [cls, setCls] = createSignal('max-w-full max-h-full')
  const setNormal = () => setCls('max-w-full max-h-full')
  const setWFull = () => setCls('max-w-full')
  const setHFull = () => setCls('max-h-full')
  const [loadStatus, setLoadStatus] = createSignal(ImageLoadingStatus.Loading)

  return (
    <Dialog>
      <DialogTrigger
        as={(_props: DialogTriggerProps) => (
          <Switch>
            <Match when={loadStatus() === ImageLoadingStatus.Success}>
              {/* @ts-ignore cast html element to image element */}
              <img
                src={props.m.data.url}
                alt="图片"
                referrerPolicy="no-referrer"
                class="max-w-400px max-h-400px block cursor-zoom-in"
                {..._props}
                onError={() => setLoadStatus(ImageLoadingStatus.Error)}
                onLoad={() => {
                  setLoadStatus(ImageLoadingStatus.Success)
                }}
              />
            </Match>
            <Match when={loadStatus() === ImageLoadingStatus.Error}>
              [图片加载失败]
            </Match>
            <Match when={loadStatus() === ImageLoadingStatus.Loading}>
              [图片加载中]
            </Match>
          </Switch>
        )}
      />
      <DialogContent class="max-w-[1280px] of-y-auto">
        <DialogHeader>
          <DialogTitle>Image Details</DialogTitle>
        </DialogHeader>
        <div class="max-h-70vh overflow-auto">
          <img
            src={props.m.data.url}
            alt="图片"
            referrerPolicy="no-referrer"
            class={clsx('block mx-auto', cls())}
          />
        </div>

        <DialogFooter>
          <Button onClick={setNormal}>Normal</Button>
          <Button onClick={setWFull}>Width Full</Button>
          <Button onClick={setHFull}>Height Full</Button>
          <Button
            as={'a'}
            class="!underline-none"
            href={props.m.data.url}
            target="_blank"
            rel="noopener noreferrer"
            download={props.m.data.file}
          >
            Download
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export { ZommImageMessage as ImageMessage }
