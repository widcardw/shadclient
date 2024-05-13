import { createSignal, type Component } from 'solid-js'

const [allFriends, setAllFriends] = createSignal([])

const FriendList: Component = () => {
  return <div>friend list</div>
}

export default FriendList
export { allFriends, setAllFriends }
