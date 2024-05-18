import type { SingleFriendInfo } from '@/libs/types/ws/private-user'
import { createSignal, type Component } from 'solid-js'

const [allFriends, setAllFriends] = createSignal<SingleFriendInfo[]>([])

const FriendList: Component = () => {
  return <div>friend list</div>
}

export default FriendList
export { allFriends, setAllFriends }
