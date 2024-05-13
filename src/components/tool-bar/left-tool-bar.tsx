import clsx from 'clsx'
import type { Component } from 'solid-js'
import { Button } from '../ui/button'
import ModeToggle from '../dark-theme/toggle-mode'
import SettingsDialog from './settings-dialog'
import { InfoDialog } from './info-dialog'
import ConnectWsButton from './connect-ws'
import { setConnection } from '@/libs/states/connection'

const LeftToolBar: Component = () => {
  return (
    <div
      class={clsx(
        'h-full',
        'flex flex-col items-center gap-1 py-1',
        'border-r',
        'w-3rem',
      )}
    >
      <Button variant="ghost" class="px-3">
        <div class="i-teenyicons:message-text-alt-outline" />
      </Button>
      <Button variant="ghost" class="px-3">
        <div class="i-teenyicons:user-circle-solid" />
      </Button>
      <Button variant="ghost" class="px-3">
        <div class="i-teenyicons:users-outline" />
      </Button>
      <div class="flex-grow" />
      <ConnectWsButton />
      <Button variant="ghost" class="px-3" onClick={() => setConnection(false)}>
        <div class="i-teenyicons:link-remove-outline" />
      </Button>

      <InfoDialog />

      <SettingsDialog />

      <ModeToggle />
    </div>
  )
}

export default LeftToolBar
