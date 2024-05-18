import { ToggleButton } from '@/components/ui/toggle'
import {
  connected,
  isConnecting,
  setConnection,
} from '@/libs/states/connection'
import { Show, type Component } from 'solid-js'
import { Button } from '../ui/button'
import { useLocalStorage } from 'solidjs-use'
import { WSURL } from '@/libs/config'

const ConnectWsButton: Component = () => {
  const [wsUrl] = useLocalStorage('wsUrl', WSURL)

  return (
    <>
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
          onChange={(connect) => setConnection({ connect, url: wsUrl() })}
        >
          <div class="i-teenyicons:link-outline" />
        </ToggleButton>
      </Show>
    </>
  )
}

export default ConnectWsButton
