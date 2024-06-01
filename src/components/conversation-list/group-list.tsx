import {
  activeId,
  activeType,
  recentList,
  setActiveConv,
  setActiveId,
  setActiveType,
  setGroupConvStore,
  setRecentList,
} from '@/libs/states/sessions'
import type { SingleGroupInfo } from '@/libs/types/ws/group-info'
import { getGroupName } from '@/libs/types/ws/message/group-message-ws-object'
import { UnifyInfoType } from '@/libs/types/ws/unify-info'
import { type Component, For, Show, createMemo, createSignal } from 'solid-js'
import { useDebounceFn } from 'solidjs-use'
import { Button } from '../ui/button'
import { Separator } from '../ui/separator'
import { TextField, TextFieldRoot } from '../ui/textfield'

const [allGroups, setAllGroups] = createSignal<SingleGroupInfo[]>([])

const GroupList: Component = () => {
  const [search, setSearch] = createSignal('')
  const filteredGroup = createMemo<SingleGroupInfo[]>(() => {
    const trimSearch = search().trim()
    if (trimSearch === '') return allGroups()
    return allGroups().filter(
      (i) =>
        i.group_memo?.includes(trimSearch) || i.group_name.includes(trimSearch),
    )
  })

  const debouncedSearch = useDebounceFn((e: InputEvent) => {
    setSearch((e.target as HTMLInputElement).value)
  }, 500)

  const addToRecent = (g: SingleGroupInfo) => {
    if (
      !recentList().some(
        (i) => i.type === UnifyInfoType.Group && i.group_id === g.group_id,
      )
    ) {
      setGroupConvStore(g.group_id, {
        id: g.group_id,
        nick: getGroupName(g.group_id),
        list: [],
        type: 'group',
        unread: 0,
      })
      setRecentList((prev) => [...prev, { ...g, type: UnifyInfoType.Group }])
    }
    // TODO: change tab, change chat panel
    // setActiveConv(UnifyInfoType.Group, g.group_id)
    setActiveType(UnifyInfoType.Group)
    setActiveId(g.group_id)
    console.log('add group', activeId(), activeType())
  }

  return (
    <div class="h-100vh flex flex-col">
      <TextFieldRoot class="block w-full sticky p-1">
        <TextField
          placeholder="Search"
          value={search()}
          onInput={(e: InputEvent) => debouncedSearch(e)}
        />
      </TextFieldRoot>
      <Separator />
      <div class="flex-grow of-y-auto flex flex-col gap-1 p-1">
        <Show when={filteredGroup().length > 0}>
          <For each={filteredGroup()}>
            {(group) => (
              <Button
                variant="ghost"
                class="block w-full text-left  whitespace-nowrap overflow-hidden text-ellipsis"
                onClick={() => addToRecent(group)}
              >
                {group?.group_memo ||
                  group?.group_name ||
                  `群聊 ${group.group_id}`}
              </Button>
            )}
          </For>
        </Show>
      </div>
    </div>
  )
}

export default GroupList
export { allGroups, setAllGroups }
