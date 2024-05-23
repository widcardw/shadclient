import type { Component } from 'solid-js'
import CurrentConversationList from '../conversation-list/current-conv'
import { Resizable, ResizableHandle, ResizablePanel } from '../ui/resizable'

const WithConvList: Component = () => {
  return (
    <Resizable style={{ 'flex-grow': 1 }}>
      {/* 最近会话列表 */}
      <ResizablePanel initialSize={0.3} minSize={0.2}>
        <CurrentConversationList />
      </ResizablePanel>
      <ResizableHandle />
      {/* 聊天主面板 */}
      <ResizablePanel initialSize={0.7}>
        <div>main panel</div>
      </ResizablePanel>
    </Resizable>
  )
}

export { WithConvList }
