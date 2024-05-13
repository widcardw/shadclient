import { createSignal } from 'solid-js'

const [connected, setConnected] = createSignal(false)
const toggleConnected = () => setConnected(!connected())

function setConnection(connect: boolean) {
  setIsConnecting(true)
  setTimeout(() => {
    setConnected(connect)
    setIsConnecting(false)
  }, 1000)
}

const [isConnecting, setIsConnecting] = createSignal(false)

export {
  connected,
  setConnected,
  setConnection,
  toggleConnected,
  isConnecting,
  setIsConnecting,
}
