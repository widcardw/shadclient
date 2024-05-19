import { createSignal } from 'solid-js'
import { dispatchMessage } from '../types/ws/dispatcher'
import { SimpleWebSocket } from '../ws/websocket'

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
 * 设置是否连接应当都用这个接口
 * 由于 url 是由 localStorage 传入的，因此凡是涉及到 localStorage 的都必须在 DOM 中做
 */
async function setConnection(config?: { connect: boolean; url?: string }) {
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
  /** 稍作封装的 WebSocket 实例 */
  ws,
  setWs,
}
