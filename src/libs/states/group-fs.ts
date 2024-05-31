import { createSignal } from 'solid-js'
import { createStore } from 'solid-js/store'
import type { GroupFsList } from '../types/ws/echo/group-files-echo'

const [groupFsStore, setGroupFsStore] =
  createStore<Record<number, GroupFsList>>()

// groupid/path/to/folder -> id
const [groupFsMap, setGroupFsMap] = createStore<Record<string, number>>()

const [currentFolder, setCurrentFolder] = createSignal('')

export { groupFsStore, setGroupFsStore, groupFsMap, setGroupFsMap, currentFolder, setCurrentFolder }
