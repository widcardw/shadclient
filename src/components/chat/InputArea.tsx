import { ws } from '@/libs/states/connection'
import { isSending, setIsSending } from '@/libs/states/semaphore'
import { activeId, activeType } from '@/libs/states/sessions'
import type { CommonImageMessage } from '@/libs/types/messages/common-message'
import {
  createImageMessage,
  createTextMessage,
} from '@/libs/types/messages/sent-message'
import { UnifyInfoType } from '@/libs/types/ws/unify-info'
import { WsActions } from '@/libs/ws/websocket'
import clsx from 'clsx'
import { type Component, Show, createSignal } from 'solid-js'
import { toast } from 'solid-sonner'
import { useStorage } from 'solidjs-use'
import { FormulaFx } from '../icons/math-icon'
import { Button } from '../ui/button'
import { Separator } from '../ui/separator'
import { ToggleButton } from '../ui/toggle'

type InputElKeyboardEvent = KeyboardEvent & {
  currentTarget: HTMLInputElement
  target: Element
}

type TextareaElKeyboardEvent = KeyboardEvent & {
  currentTarget: HTMLTextAreaElement
  target: Element
}

type TextareaElClipboardEvent = ClipboardEvent & {
  currentTarget: HTMLTextAreaElement
  target: Element
}

const [sendEl, setSendEl] = createSignal<HTMLTextAreaElement>()
const [pastedImgs, setPastedImgs] = createSignal<CommonImageMessage[]>([])

const InputArea: Component = () => {
  const [sendBy] = useStorage('sendBy', 'Ctrl Enter')

  const sendSimpleMessage = () => {
    if (sendEl() === undefined) {
      toast.error('未找到聊天窗口')
      return
    }
    const msg = sendEl()!.value
    if (msg.trim() === '') {
      toast.error('消息为空')
      return
    }
    setIsSending(true)
    if (activeType() === UnifyInfoType.Group) {
      console.log('send group message', msg, activeId())
      ws()?.send(
        WsActions.SendGroupMsg,
        {
          group_id: activeId(),
          message: [createTextMessage(msg)],
        },
        {},
      )
    } else if (activeType() === UnifyInfoType.Private) {
      console.log('send private message', msg, activeId())
      ws()?.send(
        WsActions.SendPrivateMsg,
        {
          user_id: activeId(),
          message: [createTextMessage(msg)],
        },
        {},
      )
    }
  }

  const onPasteImg = async (e: TextareaElClipboardEvent) => {
    if (activeType() === UnifyInfoType.None) return
    const clipboardData = e.clipboardData
    if (!clipboardData) return
    const pasted = await Promise.all(
      Array.from(clipboardData.items).map((item) => {
        if (item.kind !== 'file') return Promise.resolve('')
        if (!item.type.startsWith('image/'))
          return Promise.resolve(
            `暂不支持粘贴的文件类型: ${item.type}，请通过文件接口发送`,
          )
        return new Promise((resolve, reject) => {
          const blob = item.getAsFile()
          if (!blob) return resolve('')
          const reader = new FileReader()
          reader.onload = () => {
            if (reader.result && typeof reader.result === 'string') {
              // biome-ignore lint/style/useTemplate: template may cause ts error
              const b64 = 'base64://' + reader.result.split(',')[1]
              setPastedImgs((p) => [...p, createImageMessage(b64)])
              resolve('')
            }
          }
          reader.onerror = reject
          reader.readAsDataURL(blob)
        })
      }),
    )
    const el = sendEl()
    if (el) el.value += pasted.join('\n')
  }

  const handleSendImages = () => {
    if (pastedImgs().length === 0) return
    if (activeType() === UnifyInfoType.Group) {
      ws()?.send(
        WsActions.SendGroupMsg,
        {
          group_id: activeId(),
          message: pastedImgs(),
        },
        {},
      )
    } else if (activeType() === UnifyInfoType.Private) {
      ws()?.send(
        WsActions.SendPrivateMsg,
        {
          user_id: activeId(),
          message: pastedImgs(),
        },
        {},
      )
    }
    setPastedImgs([])
  }

  const handleKeyDown = (e: TextareaElKeyboardEvent) => {
    if (e.isComposing) return
    console.log(e.key, e.shiftKey, e.ctrlKey)
    if (sendBy() === 'Ctrl Enter') {
      if (e.ctrlKey && e.key === 'Enter') {
        sendSimpleMessage()
        e.preventDefault()
        return
      }
    } else if (sendBy() === 'Enter') {
      if (e.key === 'Enter' && !e.shiftKey) {
        sendSimpleMessage()
        e.preventDefault()
        return
      }
    }
  }

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
          <FormulaFx />
        </ToggleButton>
        <ToggleButton>
          <div class="i-teenyicons:code-outline" />
        </ToggleButton>
        <div class="flex-grow flex justify-center gap-1 items-center">
          <Show when={pastedImgs().length > 0}>
            <div>Pasted {pastedImgs().length} image{pastedImgs().length > 1 && 's'}</div>
            <Button variant="secondary" onClick={handleSendImages}>
              Send
            </Button>
            <Button variant="destructive" onClick={() => setPastedImgs([])}>
              Discard
            </Button>
          </Show>
        </div>
        <Button variant="ghost" class="px-3" onClick={sendSimpleMessage}>
          <div class="i-teenyicons:send-outline" />
        </Button>
        <Button
          variant="ghost"
          class="px-3"
          onClick={() => setIsSending(false)}
        >
          <div class="i-teenyicons:anti-clockwise-outline" />
        </Button>
      </div>
      <Separator />
      <div class="flex-1 flex">
        <textarea
          class={clsx(
            'border-none !outline-none resize-none',
            'm0 p4 flex-1 leading-loose',
            'disabled:op-50',
          )}
          ref={(r) => setSendEl(r)}
          placeholder={`${sendBy()} 发送消息`}
          disabled={
            ws() === undefined ||
            isSending() ||
            activeType() === UnifyInfoType.None
          }
          onPaste={onPasteImg}
          onKeyDown={handleKeyDown}
        />
      </div>
    </div>
  )
}

export { sendEl, setSendEl, InputArea }