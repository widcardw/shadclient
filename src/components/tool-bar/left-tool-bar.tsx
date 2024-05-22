import { setConnection } from '@/libs/states/connection'
import { unreadCount } from '@/libs/states/requests'
import {
  SelectedList,
  selectedList,
  setSelectedList,
} from '@/libs/states/select-list'
import clsx from 'clsx'
import { type Component, Match, Switch } from 'solid-js'
import ModeToggle from '../dark-theme/toggle-mode'
import { Badge } from '../ui/badge'
import { Button } from '../ui/button'
import ConnectWsButton from './connect-ws'
import { InfoDialog } from './info-dialog'
import SettingsDialog from './settings-dialog'

const LeftToolBar: Component = () => {
  return (
    <div
      class={clsx(
        'h-full',
        'flex flex-col items-center gap-1 py-1 px-1',
        'border-r',
      )}
    >
      <Button
        variant={selectedList() === SelectedList.Recent ? 'secondary' : 'ghost'}
        class="px-3"
        onClick={() => setSelectedList(SelectedList.Recent)}
      >
        <div class="i-teenyicons:message-text-alt-outline" />
      </Button>
      <Button
        variant={
          selectedList() === SelectedList.Friends ? 'secondary' : 'ghost'
        }
        class="px-3"
        onClick={() => setSelectedList(SelectedList.Friends)}
      >
        <div class="i-teenyicons:user-circle-solid" />
      </Button>
      <Button
        variant={selectedList() === SelectedList.Groups ? 'secondary' : 'ghost'}
        class="px-3"
        onClick={() => setSelectedList(SelectedList.Groups)}
      >
        <div class="i-teenyicons:users-outline" />
      </Button>

      <Button
        variant={selectedList() === SelectedList.Notice ? 'secondary' : 'ghost'}
        class="px-3"
        onClick={() => setSelectedList(SelectedList.Notice)}
      >
        <div class="i-teenyicons:bell-outline" />
        <Switch>
          <Match when={unreadCount() > 0 && unreadCount() <= 99}>
            <Badge class="px-2 py-1 absolute scale-50 transform-origin-tr">
              {unreadCount()}
            </Badge>
          </Match>
          <Match when={unreadCount() > 99}>
            <Badge class="px-2 py-1 absolute scale-50 transform-origin-tr">
              99+
            </Badge>
          </Match>
        </Switch>
      </Button>

      <div class="flex-grow" />

      <ConnectWsButton />
      <Button
        variant="ghost"
        class="px-3"
        onClick={() => setConnection({ connect: false })}
      >
        <div class="i-teenyicons:link-remove-outline" />
      </Button>

      <InfoDialog />

      <SettingsDialog />

      <ModeToggle />
    </div>
  )
}

export default LeftToolBar
