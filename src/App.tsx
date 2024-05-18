import { Show, type Component } from 'solid-js'

import ColorModer from './components/dark-theme/ColorModeProvider'
import LeftToolBar from './components/tool-bar/left-tool-bar'
import { Button } from './components/ui/button'
import { Toaster } from './components/ui/sonner'
import { SelectedList, selectedList } from './libs/states/select-list'
import CurrentConversationList from './components/conversation-list/current-conv'
import {
  Resizable,
  ResizableHandle,
  ResizablePanel,
} from './components/ui/resizable'

const App: Component = () => {
  return (
    <>
      <ColorModer>
        <LeftToolBar />
        <Show when={selectedList() !== SelectedList.None}>
          <Resizable style={{ 'flex-grow': 1 }}>
            <ResizablePanel initialSize={0.3} minSize={0.2}>
              <CurrentConversationList />
            </ResizablePanel>
            <ResizableHandle />
            <ResizablePanel initialSize={0.7}>
              <div />
            </ResizablePanel>
          </Resizable>
        </Show>
        <Toaster closeButton richColors />
      </ColorModer>
    </>
  )
}

export default App
