import { type Component, For, Match, Show, Switch, createSignal } from 'solid-js'

import ColorModer from './components/dark-theme/ColorModeProvider'
import { NoticePanel } from './components/main-panel/notice-panel'
import { WithConvList } from './components/main-panel/with-conv-list'
import LeftToolBar from './components/tool-bar/left-tool-bar'
import { Button } from './components/ui/button'
import { Toaster } from './components/ui/sonner'
import { SelectedList, selectedList } from './libs/states/select-list'

const App: Component = () => {
  return (
    <>
      <ColorModer>
        <LeftToolBar />
        <Switch fallback={<WithConvList />}>
          <Match when={selectedList() === SelectedList.Notice}>
            <NoticePanel />
          </Match>
          <Match when={selectedList() === SelectedList.None}>
            <div class="p-4">
              Not selected
            </div>
          </Match>
        </Switch>
        <Toaster closeButton richColors />
      </ColorModer>
    </>
  )
}

export default App
