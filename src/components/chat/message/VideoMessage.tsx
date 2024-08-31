import { Button } from '@/components/ui/button'
import type { CommonVideoMessage } from '@/libs/types/messages/common-message'
import { Show, createSignal, type Component } from 'solid-js'

const VideoMessage: Component<{ m: CommonVideoMessage }> = (props) => {
  const [error, setError] = createSignal(false)
  return (
    <Show
      when={!error()}
      fallback={
        <Button as="a" variant="link" class="text-red" href={props.m.data.file} target="_blank">
          [Failed to load video]
        </Button>
      }>
      <video
        src={props.m.data.file}
        style={{ 'max-width': '500px', 'max-height': '500px' }}
        controls
        onError={() => setError(true)}
      >
        <track kind="captions" />
      </video>
    </Show>
  )
}

export { VideoMessage }
