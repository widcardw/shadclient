import { createStore } from 'solid-js/store'
import type { CommonNodeMessage } from '../types/messages/common-message'

const [forwardStore, setForwardStore] = createStore<
  Record<string, CommonNodeMessage[]>
>({})

export { forwardStore, setForwardStore }
