import type { SingleFriendInfo } from '@/libs/types/ws/private-user-info'
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

  return (
    <>
      <TextFieldRoot class="block w-full sticky p-1">
        <TextField
          placeholder="Search"
          value={search()}
          onInput={(e: InputEvent) => debouncedSearch(e)}
        />
      </TextFieldRoot>
      <Separator />
      <div class="grid gap-1 p-1 of-y-auto">
        <Show when={filteredFriends().length > 0}>
          <For each={filteredFriends()}>
            {(friend) => (
              <Button variant="ghost" class="block w-full text-left">
                {friend.remark || friend.nickname || friend.user_id}
              </Button>
            )}
          </For>
        </Show>
      </div>
    </>
  )
}

export default FriendList
export { allFriends, setAllFriends }
