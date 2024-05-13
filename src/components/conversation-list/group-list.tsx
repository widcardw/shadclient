import { createSignal, type Component } from 'solid-js'

const [allGroups, setAllGroups] = createSignal([])

const GroupList: Component = () => {
  return <div>group list</div>
}

export default GroupList
export { allGroups, setAllGroups }
