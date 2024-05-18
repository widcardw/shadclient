import { createSignal } from 'solid-js'
import { toast } from 'solid-sonner'
import { SimpleWebSocket } from '../ws/websocket'
import { dispatchMessage } from '../types/ws/dispatcher'

const [connected, setConnected] = createSignal(false)
const toggleConnected = () => setConnected(!connected())

const [ws, setWs] = createSignal<SimpleWebSocket>()

function runConnect(url: string) {
  const i = new SimpleWebSocket(url)
  setWs(i)
  ws()?.connect()
  ws()?.listen((data) => {
    dispatchMessage(data)
  })
}

function runDisconnect() {
  setConnected(false)
  ws()?.disconnect()
  setWs(undefined)
}

/**
 * 应当受限于 DOM 中，因为 url 是从 localStorage 中读取的
 */
async function setConnection(config?: {connect: boolean, url?: string}) {
  setIsConnecting(true)
  return new Promise<void>((resolve) => {
    if (config?.connect && config?.url) {
      runConnect(config.url)
    } else {
      runDisconnect()
    }
    setConnected(config?.connect || false)
    setIsConnecting(false)
    resolve()
  })
}

const [isConnecting, setIsConnecting] = createSignal(false)

export {
  connected,
  setConnected,
  setConnection,
  toggleConnected,
  isConnecting,
  setIsConnecting,
  ws,
  setWs,
}
