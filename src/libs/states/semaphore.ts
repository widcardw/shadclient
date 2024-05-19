import { createSignal } from "solid-js";

const [isSending, setIsSending] = createSignal(false)

export {
    /** 当前窗格正在发送消息 */
    isSending,
    setIsSending
}
