import {
  activeId,
  activeType,
  recentList,
  setActiveConv,
  setActiveId,
  setActiveType,
  setFriendConvStore,
  setRecentList,
} from '@/libs/states/sessions'
import type { SingleFriendInfo } from '@/libs/types/ws/private-user-info'
import { UnifyInfoType } from '@/libs/types/ws/unify-info'
import { type Component, For, Show, createMemo, createSignal } from 'solid-js'
import { useDebounceFn } from 'solidjs-use'
import { Button } from '../ui/button'
import { Separator } from '../ui/separator'
import { TextField, TextFieldRoot } from '../ui/textfield'

const [allFriends, setAllFriends] = createSignal<SingleFriendInfo[]>([])

const FriendList: Component = () => {
  const [search, setSearch] = createSignal('')
  const filteredFriends = createMemo(() => {
    const trimSearch = search().trim()
    if (trimSearch === '') return allFriends()
    return allFriends().filter(
      (i) => i.remark?.includes(trimSearch) || i.nickname.includes(trimSearch),
    )
  })

  const debouncedSearch = useDebounceFn((e: InputEvent) => {
    setSearch((e.target as HTMLInputElement).value)
  }, 500)

  const addToRecent = (f: SingleFriendInfo) => {
    if (
      !recentList().some(
        (i) => i.type === UnifyInfoType.Private && i.user_id === f.user_id,
      )
    ) {
      setFriendConvStore(f.user_id, { type: 'private', list: [] })
      setRecentList((prev) => [...prev, { ...f, type: UnifyInfoType.Private }])
    }
    // TODO: change tab, change chat panel
    // setActiveConv(UnifyInfoType.Private, f.user_id)
    setActiveType(UnifyInfoType.Private)
    setActiveId(f.user_id)
    console.log('add friend', f, activeId(), activeType())
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
        <Show when={filteredFriends().length > 0}>
          <For each={filteredFriends()}>
            {(friend) => (
              <Button
                variant="ghost"
                class="block w-full text-left whitespace-nowrap overflow-hidden text-ellipsis"
                onClick={() => addToRecent(friend)}
              >
                {friend.remark || friend.nickname || friend.user_id}
              </Button>
            )}
          </For>
        </Show>
      </div>
    </div>
  )
}

export default FriendList
export { allFriends, setAllFriends }
