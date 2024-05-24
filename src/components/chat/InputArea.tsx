import { ws } from '@/libs/states/connection'
import { isSending } from '@/libs/states/semaphore'
import { activeType } from '@/libs/states/sessions'
import { UnifyInfoType } from '@/libs/types/ws/unify-info'
import clsx from 'clsx'
import { type Component, createSignal } from 'solid-js'
import { useStorage } from 'solidjs-use'
import { TablerMathXDivideY2 } from '../icons/math-icon'
import { Button } from '../ui/button'
import { ToggleButton } from '../ui/toggle'

const [sendEl, setSendEl] = createSignal<HTMLTextAreaElement>()

const InputArea: Component = () => {
  const [sendBy] = useStorage('sendBy', 'Ctrl Enter')
  return (
    <div class="flex flex-col h-full">
      <div title="toolbar" class="flex p-1 gap-1">
        <Button variant="ghost" class="px-3">
          <div class="i-teenyicons:image-outline" />
        </Button>
        <Button variant="ghost" class="px-3">
          <div class="i-teenyicons:attachment-outline" />
        </Button>
        <Button variant="ghost" class="px-3">
          <div class="i-teenyicons:mood-smile-outline" />
        </Button>
        <ToggleButton>
          <TablerMathXDivideY2 />
        </ToggleButton>
        <ToggleButton>
          <div class="i-teenyicons:code-outline" />
        </ToggleButton>
      </div>
      <div class="flex-1 flex">
        <textarea
          class={clsx(
            'border-none !outline-none resize-none',
            'm0 p4 flex-1 leading-loose',
            'disabled:op-50',
          )}
          ref={(r) => setSendEl(r)}
          placeholder={`${sendBy()} 发送消息`}
          disabled={ws() === undefined || isSending() || activeType() === UnifyInfoType.None}
        />
      </div>
    </div>
  )
}

export { sendEl, setSendEl, InputArea }
