import { runDisconnect, setConnected } from '@/libs/states/connection'
import { toast } from 'solid-sonner'

class SimpleWebSocket {
  ws: WebSocket

  constructor(url: string) {
    this.ws = new WebSocket(url)
  }

  connect() {
    this.ws.addEventListener('error', (ev) => {
      runDisconnect()
      console.error(ev)
      toast.error('Connection error!', {
        duration: Number.POSITIVE_INFINITY,
        description: 'Please view the console for more details.',
      })
    })
    this.ws.addEventListener('open', (ev) => {
      console.log('connection open', ev)
      toast.success('Connection open!')
    })
    this.ws.addEventListener('close', function (ev) {
      console.log('connection close', ev)
      toast.info('Connection closed!', {
        duration: Number.POSITIVE_INFINITY,
      })
    })
  }

  listen(cb: (o: any) => void) {
    this.ws.addEventListener('message', (ev) => {
      try {
        cb(JSON.parse(ev.data))
      } catch (e) {
        console.error(e)
      }
    })
  }

  disconnect() {
    if (this.ws) this.ws.close()
  }
}

export { SimpleWebSocket }
