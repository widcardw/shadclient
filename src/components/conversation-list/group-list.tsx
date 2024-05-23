import type { SingleGroupInfo } from '@/libs/types/ws/group-info'
import { type Component, For, Show, createMemo, createSignal } from 'solid-js'
import { useDebounceFn } from 'solidjs-use'
import { Button } from '../ui/button'
import { TextField, TextFieldRoot } from '../ui/textfield'

const [allGroups, setAllGroups] = createSignal<SingleGroupInfo[]>([])

const GroupList: Component = () => {
  const [search, setSearch] = createSignal('')
  const filteredGroup = createMemo(() => {
    const trimSearch = search().trim()
    if (trimSearch === '') return allGroups()
    return allGroups().filter(
      (i) => i.group_memo?.includes(trimSearch) || i.group_name.includes(trimSearch)
    )
  })

  const debouncedSearch = useDebounceFn((e: InputEvent) => {
    setSearch((e.target as HTMLInputElement).value)
  }, 1000)

  return (
    <div class="grid gap-1 of-auto p-1">
      <TextFieldRoot class="block w-full sticky">
        <TextField
          placeholder="Search"
          value={search()}
          onInput={(e: InputEvent) => debouncedSearch(e)}
        />
      </TextFieldRoot>
        <Show when={filteredGroup().length > 0} fallback="No Groups">
          <For each={filteredGroup()}>
            {(group) => (
              <Button variant="ghost" class="block w-full text-left">
                {group.group_memo || group.group_name || group.group_id}
              </Button>
            )}
          </For>
        </Show>
    </div>
  )
}

export default GroupList
export { allGroups, setAllGroups }
