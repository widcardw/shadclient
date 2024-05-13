import { ToggleButton } from '@/components/ui/toggle'
import { connected, isConnecting, setConnection } from '@/libs/states/connection'
import { Show, type Component } from 'solid-js'
import { Button } from '../ui/button'

const ConnectWsButton: Component = () => {
  return (
    <Show
      when={!isConnecting()}
      fallback={
        <Button variant="ghost" class="px-3">
          <div class="i-teenyicons:loader-outline animate-spin" />
        </Button>
      }
    >
      <ToggleButton
        pressed={connected()}
        onChange={(pressed) => setConnection(pressed)}
      >
        <div class="i-teenyicons:link-outline" />
      </ToggleButton>
    </Show>
  )
}

export default ConnectWsButton
