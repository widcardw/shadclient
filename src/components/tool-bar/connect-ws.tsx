import { ToggleButton } from '@/components/ui/toggle'
import { WSURL } from '@/libs/config'
import {
  connected,
  isConnecting,
  setConnection,
} from '@/libs/states/connection'
import clsx from 'clsx'
import { type Component, Show } from 'solid-js'
import { useLocalStorage } from 'solidjs-use'
import { Button } from '../ui/button'

const ConnectWsButton: Component = () => {
  const [wsUrl] = useLocalStorage('wsUrl', WSURL)

  return (
    <>
      <Show
        when={!isConnecting()}
        fallback={
          <Button variant="ghost" size="icon">
            <div class="i-teenyicons:loader-outline animate-spin" />
          </Button>
        }
      >
        <ToggleButton
          class={clsx(
            'data-[pressed]:text-emerald-500 data-[pressed]:hover:text-emerald-400',
          )}
          pressed={connected()}
          title={connected() ? '已连接' : '连接到服务器'}
          onChange={(connect) => setConnection({ connect, url: wsUrl() })}
        >
          <div class="i-teenyicons:link-outline" />
        </ToggleButton>
      </Show>
    </>
  )
}

export default ConnectWsButton
