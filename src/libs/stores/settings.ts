import { useStorage } from 'solidjs-use'

// should only be used in Components
const [wsUrl, setWsUrl] = useStorage('wsUrl', 'ws://127.0.0.1:5700')
const [sendBy, setSendBy] = useStorage('sendBy', 'Ctrl Enter')


