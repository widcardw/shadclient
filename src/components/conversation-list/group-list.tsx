import type { SingleGroupInfo } from '@/libs/types/ws/group-info'
import { createSignal, type Component } from 'solid-js'

const [allGroups, setAllGroups] = createSignal<SingleGroupInfo[]>([])

const GroupList: Component = () => {
  return <div>group list</div>
}

export default GroupList
export { allGroups, setAllGroups }
