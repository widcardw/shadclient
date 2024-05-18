import { SelectedList, selectedList } from '@/libs/states/select-list'
import { Match, Switch, type Component } from 'solid-js'
import RecentConversationList from './recent-conv'
import FriendList from './friend-list'
import GroupList from './group-list'

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
