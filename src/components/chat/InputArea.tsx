import { ws } from '@/libs/states/connection'
import { isSending, setIsSending } from '@/libs/states/semaphore'
import { activeId, activeType } from '@/libs/states/sessions'
import type { CommonImageMessage } from '@/libs/types/messages/common-message'
import {
  MultiTypeSentMessage,
  createImageMessage,
  createTextMessage,
} from '@/libs/types/messages/sent-message'
import { UnifyInfoType } from '@/libs/types/ws/unify-info'
import { msgContentToSvg, transformTex } from '@/libs/utils/transform-tex'
import { u8toBase64 } from '@/libs/utils/u8Tob64'
import { WsActions } from '@/libs/ws/websocket'
import type { HoverCardTriggerProps } from '@kobalte/core/hover-card'
import type { PopoverTriggerProps } from '@kobalte/core/popover'
import clsx from 'clsx'
import { nanoid } from 'nanoid'
import { type Component, For, Show, createSignal } from 'solid-js'
import { toast } from 'solid-sonner'
import { useDebounceFn, useFileDialog, useStorage, whenever } from 'solidjs-use'
import { FormulaFx } from '../icons/math-icon'
import { Button } from '../ui/button'
import { HoverCard, HoverCardContent, HoverCardTrigger } from '../ui/hover-card'
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover'
import { Separator } from '../ui/separator'
import { TextField, TextFieldRoot } from '../ui/textfield'
import { ToggleButton } from '../ui/toggle'
import { CQ_FACE_IDS, KOISHI_QFACE_BASE_URL } from './message/FaceMessage'

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
const [bufferedImgs, setBufferedImgs] = createSignal<CommonImageMessage[]>([])

const InputArea: Component = () => {
  const [sendBy] = useStorage('sendBy', 'Ctrl Enter')
  const [enableTex, setEnableTex] = useStorage('enable-tex', true)
  const [isIMEComposing, setIsIMEComposing] = createSignal(false)
  const startIME = () => setIsIMEComposing(true)
  const stopIME = () => setTimeout(() => setIsIMEComposing(false), 50)

  // 使用 toolbar 上的按钮选择图片
  const {
    files: selectedImgs,
    open: openImgDlg,
    reset: resetImgs,
  } = useFileDialog({ accept: 'image/*' })
  whenever(
    selectedImgs,
    async () => {
      console.log('triggle selected image change')
      const fs = selectedImgs()
      if (!fs) return
      const imgMsgs = await Promise.all(
        Array.from(fs).map(async (f) => {
          const bytes = new Uint8Array(await f.arrayBuffer())
          const b64 = u8toBase64(bytes)
          return createImageMessage(b64)
        }),
      )
      setBufferedImgs((prev) => [...prev, ...imgMsgs])
      resetImgs()
    },
    { defer: true },
  )

  // 选择 toolbar 上的按钮填入文件路径
  const [filePathVisible, setFilePathVisible] = createSignal(false)
  const [filePathToUpload, setFilePathToUpload] = createSignal('')
  const handleFilePathVisibility = (v: boolean) => {
    if (v && bufferedImgs().length) {
      toast('请现将图片发送或先取消发送')
      return
    }
    setFilePathVisible(v)
  }
  const handleFileUpload = () => {
    const path = filePathToUpload()
    console.log('ready to upload', path)
    if (path.trim() === '') return
    if (activeType() === UnifyInfoType.Private) {
      ws()?.send(
        WsActions.UploadPrivateFile,
        {
          user_id: activeId(),
          file: path,
          name: path.split('/').pop() || `file_${nanoid(10)}`,
        },
        {},
      )
    } else if (activeType() === UnifyInfoType.Group) {
      ws()?.send(
        WsActions.UploadGroupFile,
        {
          group_id: activeId(),
          file: path,
          name: path.split('/').pop() || `file_${nanoid(10)}`,
        },
        {},
      )
    }
    toast('文件已发送，请在其他终端确认发送情况')
    setFilePathVisible(false)
  }
  const handleFileUploadCancel = () => {
    setFilePathToUpload('')
    setFilePathVisible(false)
  }
  const handleFileUploadToolTip = () => {
    toast('提示', {
      description:
        'Windows 端使用“Shift 右键”复制文件路径\nmacOS 端使用“Cmd+Option+C”复制文件路径',
      descriptionClass: 'whitespace-pre-wrap',
      duration: 10000,
    })
  }

  // 预览公式
  const [texPreview, setTexPreview] = createSignal('Nothing to preview.')
  const debouncedPreview = useDebounceFn(() => {
    const el = sendEl()
    if (!enableTex() || !el) return
    const msg = el.value
    console.log('debounced tex', msg)
    if (!msg.startsWith('/am') || msg.startsWith('/tex')) return
    setTexPreview(msgContentToSvg(msg))
  }, 800)

  // 仅发送文本消息
  const handlePreprocess = async (msg: string) => {
    if (enableTex() && msg && (msg.startsWith('/am') || msg.startsWith('/tex')))
      return await transformTex(msg)
    return msg
  }
  const sendSimpleMessage = async () => {
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
          message: await handlePreprocess(msg), // buildMessage(msg),
        },
        {},
      )
    } else if (activeType() === UnifyInfoType.Private) {
      console.log('send private message', msg, activeId())
      ws()?.send(
        WsActions.SendPrivateMsg,
        {
          user_id: activeId(),
          message: await handlePreprocess(msg), // buildMessage(msg),
        },
        {},
      )
    }
  }

  // 在 textarea 粘贴图片时，将图片添加到 buffered images 中
  const onPasteImg = async (e: TextareaElClipboardEvent) => {
    if (activeType() === UnifyInfoType.None) return
    if (filePathVisible()) return
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
              setBufferedImgs((p) => [...p, createImageMessage(b64)])
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

  // 将缓存的图片发送出去
  const handleSendImages = () => {
    if (bufferedImgs().length === 0) return
    if (activeType() === UnifyInfoType.Group) {
      ws()?.send(
        WsActions.SendGroupMsg,
        {
          group_id: activeId(),
          message: bufferedImgs(),
        },
        {},
      )
    } else if (activeType() === UnifyInfoType.Private) {
      ws()?.send(
        WsActions.SendPrivateMsg,
        {
          user_id: activeId(),
          message: bufferedImgs(),
        },
        {},
      )
    }
    setBufferedImgs([])
  }

  // 用于监听快捷键发送
  const handleKeyDown = (e: TextareaElKeyboardEvent) => {
    if (isIMEComposing()) return
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
    debouncedPreview()
  }

  const handleAddFace = (id: number) => {
    const el = sendEl()
    if (el) {
      el.value =
        // biome-ignore lint/style/useTemplate: long expression
        el.value.slice(0, el.selectionStart) +
        `[CQ:face,id=${id}]` +
        el.value.slice(el.selectionEnd)
    }
  }

  return (
    <div class="flex flex-col h-full">
      <div title="toolbar" class="flex p-1 gap-1">
        {/* 左侧工具栏 */}
        <Button
          variant="ghost"
          disabled={filePathVisible()}
          class="px-3"
          onClick={() => openImgDlg()}
        >
          <div class="i-teenyicons:image-outline" />
        </Button>
        <ToggleButton
          disabled={bufferedImgs().length > 0}
          pressed={filePathVisible()}
          onChange={handleFilePathVisibility}
        >
          <div class="i-teenyicons:attachment-outline" />
        </ToggleButton>
        <Popover>
          <PopoverTrigger
            as={(_props: PopoverTriggerProps) => (
              <Button variant="ghost" class="px-3" {..._props}>
                <div class="i-teenyicons:mood-smile-outline" />
              </Button>
            )}
          />
          <PopoverContent
            withClose={false}
            class="grid grid-cols-6 gap-2 max-h-[400px] max-w-[400px] of-y-auto of-hidden"
          >
            <For each={CQ_FACE_IDS}>
              {(id) => (
                <Button
                  variant="ghost"
                  class="px-3"
                  onClick={() => handleAddFace(id)}
                >
                  <img
                    class="w-5 h-5"
                    src={`${KOISHI_QFACE_BASE_URL}${id}.gif`}
                    alt={`[表情:${id}]`}
                  />
                </Button>
              )}
            </For>
          </PopoverContent>
        </Popover>

        <HoverCard placement="top" fitViewport>
          <HoverCardTrigger
            as={(_props: HoverCardTriggerProps) => (
              // @ts-ignore cast button to element
              <ToggleButton
                pressed={enableTex()}
                onChange={(b) => setEnableTex(b)}
                {..._props}
              >
                <FormulaFx />
              </ToggleButton>
            )}
          />
          <HoverCardContent class="of-x-auto of-hidden">
            <div class="block mx-auto" innerHTML={texPreview()} />
          </HoverCardContent>
        </HoverCard>

        <ToggleButton disabled>
          <div class="i-teenyicons:code-outline" />
        </ToggleButton>
        {/* 中间备用栏，用于发送图片，文件等 */}
        <div class="flex-grow flex justify-center gap-1 items-center">
          {/* 图片发送 */}
          <Show when={bufferedImgs().length > 0}>
            <div>
              Buffered {bufferedImgs().length} image
              {bufferedImgs().length > 1 && 's'}
            </div>
            <Button variant="secondary" class="px-3" onClick={handleSendImages}>
              <div class="i-teenyicons:send-outline" />
            </Button>
            <Button
              variant="destructive"
              class="px-3"
              onClick={() => setBufferedImgs([])}
            >
              <div class="i-teenyicons:bin-outline" />
            </Button>
          </Show>
          {/* 文件发送 */}
          <Show when={filePathVisible()}>
            <TextFieldRoot class="w-60% max-w-800px">
              <TextField
                placeholder="填入本地文件路径"
                onChange={(e: Event) => {
                  setFilePathToUpload((e.target as HTMLInputElement).value)
                }}
              />
            </TextFieldRoot>
            <Button variant="secondary" class="px-3" onClick={handleFileUpload}>
              <div class="i-teenyicons:send-outline" />
            </Button>
            <Button
              variant="destructive"
              class="px-3"
              onClick={handleFileUploadCancel}
            >
              <div class="i-teenyicons:bin-outline" />
            </Button>
            <Button
              variant="outline"
              class="px-3"
              onClick={handleFileUploadToolTip}
            >
              <div class="i-teenyicons:question-outline" />
            </Button>
          </Show>
        </div>
        {/* 右侧发送，恢复按钮 */}
        <Button
          variant="ghost"
          disabled={isSending()}
          class="px-3"
          onClick={sendSimpleMessage}
        >
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
      {/* 输入框 */}
      <div class="flex-1 flex">
        <textarea
          class={clsx(
            'border-none !outline-none resize-none',
            'm0 p4 flex-1 leading-loose',
            'bg-background',
            'disabled:bg-secondary/50',
            'break-all',
          )}
          ref={(r) => setSendEl(r)}
          placeholder={`Press ${sendBy()} to send a message.`}
          disabled={
            ws() === undefined ||
            isSending() ||
            activeType() === UnifyInfoType.None
          }
          onPaste={onPasteImg}
          onKeyDown={handleKeyDown}
          onCompositionStart={startIME}
          onCompositionEnd={stopIME}
        />
      </div>
    </div>
  )
}

export { sendEl, setSendEl, InputArea }
