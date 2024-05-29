import { createSignal } from 'solid-js'

const [isSending, setIsSending] = createSignal(false)
const [isFetchingHistory, setIsFetchingHistory] = createSignal(false)

export {
  /** 当前窗格正在发送消息 */
  isSending,
  setIsSending,
  /** 当前窗格是否正在获取历史消息 */
  isFetchingHistory,
  setIsFetchingHistory,
}
