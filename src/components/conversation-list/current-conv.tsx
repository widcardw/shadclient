import { SelectedList, selectedList } from '@/libs/states/select-list'
import { type Component, Match, Switch } from 'solid-js'
import FriendList from './friend-list'
import GroupList from './group-list'
import RecentConversationList from './recent-conv'

/**
 * 当前选中的回话列表，逻辑是 switch case，被 Resizable 包裹
 */
const CurrentConversationList: Component = () => {
  return (
    <Switch>
      <Match when={selectedList() === SelectedList.Recent}>
        <RecentConversationList />
      </Match>
      <Match when={selectedList() === SelectedList.Friends}>
        <FriendList />
      </Match>
      <Match when={selectedList() === SelectedList.Groups}>
        <GroupList />
      </Match>
    </Switch>
  )
}

export default CurrentConversationList
