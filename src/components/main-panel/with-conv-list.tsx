import { activeId, activeType } from '@/libs/states/sessions'
import { UnifyInfoType } from '@/libs/types/ws/unify-info'
import { type Component, Match, Switch, createEffect } from 'solid-js'
import { GroupChat } from '../chat/GroupChat'
import { PrivateChat } from '../chat/PrivateChat'
import CurrentConversationList from '../conversation-list/current-conv'
import { Resizable, ResizableHandle, ResizablePanel } from '../ui/resizable'

const WithConvList: Component = () => {
  return (
    <Resizable class="h-full flex-grow">
      {/* 最近会话列表 */}
      <ResizablePanel initialSize={0.2} minSize={0.15}>
        <CurrentConversationList />
      </ResizablePanel>
      <ResizableHandle />
      {/* 聊天主面板 */}
      <ResizablePanel initialSize={0.8}>
        <div class="hidden">{activeId()}, type: {activeType()}</div>
        <Switch fallback={<div class="p-4 text-muted-foreground">No chat selected.</div>}>
          <Match when={activeType() === UnifyInfoType.Private}>
            <PrivateChat uid={activeId()} />
          </Match>
          <Match when={activeType() === UnifyInfoType.Group}>
            <GroupChat gid={activeId()} />
          </Match>
        </Switch>
      </ResizablePanel>
    </Resizable>
  )
}

export { WithConvList }
