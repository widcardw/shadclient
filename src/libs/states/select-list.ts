import { createSignal } from 'solid-js'

enum SelectedList {
  None = 0,
  Recent = 1,
  Friends = 2,
  Groups = 3,
}

/**
 * 当前选中的列表，可选：最近会话、好友、群聊
 */
const [selectedList, setSelectedList] = createSignal<SelectedList>(SelectedList.None)

export { SelectedList }
export { selectedList, setSelectedList }
