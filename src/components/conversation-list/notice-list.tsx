import { createSignal, type Component } from 'solid-js'

const [allNotices, setAllNotices] = createSignal([])

const NoticeList: Component = () => {
  return <div>notice list</div>
}

export default NoticeList
export { allNotices, setAllNotices }
