import { Show, createSignal, type Component } from 'solid-js'

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
import { TextField, TextFieldRoot } from './components/ui/textfield'
import { ws } from './libs/states/connection'
import { WsActions } from './libs/ws/websocket'

const App: Component = () => {
  const [forwardId, setForwardId] = createSignal(
    'd7N9hcxquMwUNKx1RTUGEEFu6Uop17nZUQiicsKKnrG+RMBruz9jbEDxRdguWARO',
  )
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
              <div>
                <TextFieldRoot>
                  <TextField
                    value={forwardId()}
                    onChange={(e: Event) =>
                      setForwardId((e.currentTarget as HTMLInputElement).value)
                    }
                  />
                </TextFieldRoot>
                <Button
                  onClick={() => {
                    ws()?.send(WsActions.GetGroupMsgHistory, { message_id: forwardId(), group_id: 1034267197, count: 10 }, `${WsActions.GetGroupMsgHistory}_aaa`)
                  }}
                >
                  get
                </Button>
              </div>
            </ResizablePanel>
          </Resizable>
        </Show>
        <Toaster closeButton richColors />
      </ColorModer>
    </>
  )
}

export default App
