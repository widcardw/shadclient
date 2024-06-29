import { CarbonRotateClockwiseAlt } from '@/components/icons/rotate-icon'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Skeleton } from '@/components/ui/skeleton'
import type { CommonImageMessage } from '@/libs/types/messages/common-message'
import type { DialogTriggerProps } from '@kobalte/core/dialog'
import { useZoomImageWheel } from '@zoom-image/solid'
import clsx from 'clsx'
import {
  type Component,
  Match,
  Show,
  Switch,
  createEffect,
  createMemo,
  createSignal,
} from 'solid-js'
import { useImage } from 'solidjs-use'

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
  // const [cls, setCls] = createSignal('max-w-full max-h-full')
  // const setNormal = () => setCls('max-w-full max-h-full')
  // const setWFull = () => setCls('max-w-full')
  // const setHFull = () => setCls('max-h-full')
  const [imgOptions] = createSignal({
    src: props.m.data.url,
    referrerPolicy: 'no-referrer',
  })
  const { isLoading, error, state } = useImage(imgOptions)
  const imgWidth = createMemo(() => state()?.width)
  const imgHeight = createMemo(() => state()?.height)

  const isLongImg = createMemo(() => {
    const w = imgWidth()
    const h = imgHeight()
    if (!w || !h) return
    if (w > 400 && h > 400 && h / w > 1.5) return true
  })

  const [imgWheelContainer, setImgWheelContainer] =
    createSignal<HTMLDivElement>()
  const { createZoomImage, zoomImageState, setZoomImageState } =
    useZoomImageWheel()

  createEffect(() => {
    const container = imgWheelContainer()
    if (container) createZoomImage(container)
  })

  const zoomInWheel = () => {
    setZoomImageState({
      currentZoom: zoomImageState.currentZoom + 0.5,
    })
  }

  const zoomOutWheel = () => {
    setZoomImageState({
      currentZoom: zoomImageState.currentZoom - 0.5,
    })
  }

  const rotate = () => {
    setZoomImageState({
      currentRotation: zoomImageState.currentRotation + 90,
    })
  }

  const reset = () => {
    setZoomImageState({
      currentZoom: 1,
      currentRotation: 0,
    })
  }

  return (
    <Dialog>
      <DialogTrigger
        as={(_props: DialogTriggerProps) => (
          <Show
            when={!isLoading()}
            fallback={<Skeleton class="w-200px h-150px" />}
          >
            <Show
              when={!error()}
              fallback={
                <Button
                  variant="outline"
                  as="a"
                  href={imgOptions().src}
                  target="_blank"
                  referrerPolicy="no-referrer"
                  rel="noreferrer"
                >
                  Failed to load image
                </Button>
              }
            >
              {/* @ts-ignore cast html element to button element */}
              <div class="relative cursor-zoom-in" style={{width: 'fit-content'}} {..._props}>
                <img
                  src={imgOptions().src}
                  alt="图片"
                  referrerPolicy="no-referrer"
                  class="max-w-400px max-h-400px block rounded"
                  style={{
                    'object-fit': isLongImg() ? 'cover' : 'inherit',
                    'object-position': isLongImg() ? 'top' : 'inherit',
                    width: isLongImg() ? '400px' : '',
                    height: isLongImg() ? '300px' : '',
                  }}
                />
                <Show when={isLongImg()}>
                  <Badge
                    variant="secondary"
                    class="absolute bottom-0 left-0 gap-1"
                  >
                    Long Image{' '}
                    <div class="i-teenyicons:double-caret-down-circle-outline" />
                  </Badge>
                </Show>
              </div>
            </Show>
          </Show>
        )}
      />
      <DialogContent class="max-w-1280px of-y-auto">
        <DialogHeader>
          <DialogTitle>Image Details</DialogTitle>
        </DialogHeader>
        <div
          class="max-h-70vh cursor-grab overflow-y-auto"
          ref={(r) => setImgWheelContainer(r)}
        >
          <img
            src={imgOptions().src}
            alt="图片"
            referrerPolicy="no-referrer"
            class={clsx('block mx-auto', 'max-w-full max-h-full')}
          />
        </div>

        <DialogFooter>
          <Button variant="ghost" onClick={reset}>
            {Math.round(zoomImageState.currentZoom * 100)}%
          </Button>
          <Button variant="ghost" onClick={zoomInWheel}>
            <div class="i-teenyicons:zoom-in-outline" />
          </Button>
          <Button variant="ghost" onClick={zoomOutWheel}>
            <div class="i-teenyicons:zoom-out-outline" />
          </Button>
          <Button variant="ghost" onClick={rotate}>
            <CarbonRotateClockwiseAlt />
          </Button>
          <Button
            as={'a'}
            variant="ghost"
            href={props.m.data.url}
            target="_blank"
            rel="noopener noreferrer"
            download={props.m.data.file}
          >
            <div class="i-teenyicons:download-outline" />
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export { ZommImageMessage as ImageMessage }
