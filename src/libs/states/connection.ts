import { SimpleWebSocket } from '@/ws/websocket'
import { createSignal } from 'solid-js'
import { WSURL } from '../config'
import { toast } from 'solid-sonner'

const [connected, setConnected] = createSignal(false)
const toggleConnected = () => setConnected(!connected())

const [ws, setWs] = createSignal<SimpleWebSocket>()

function runConnect() {
  const i = new SimpleWebSocket(WSURL)
  setWs(i)
  ws()?.connect()
  ws()?.listen((data) => {
    if (data.post_type === 'meta_event' && data.meta_event_type === 'heartbeat') return
    if (data.post_type === 'meta_event' && data.meta_event_type === 'lifecycle' && data.sub_type === 'connect')
      toast.success('Lifecycle connected!')
    console.log(data)
  })
}

function runDisconnect() {
  setConnected(false)
  ws()?.disconnect()
  setWs(undefined)
}

async function setConnection(connect: boolean) {
  // promisify
  setIsConnecting(true)
  return new Promise<void>((resolve) => {
    if (connect) {
      runConnect()
    } else {
      runDisconnect()
    }
    setConnected(connect)
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
  runConnect,
  runDisconnect,
}
