import { createStore } from 'solid-js/store'
import type { GroupFsList } from '../types/ws/echo/group-files-echo'

const [groupFsStore, setGroupFsStore] =
  createStore<Record<string, GroupFsList>>()

export { groupFsStore, setGroupFsStore }
