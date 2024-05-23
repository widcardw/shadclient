import type { SingleGroupInfo } from '@/libs/types/ws/group-info'
import { type Component, For, Show, createMemo, createSignal } from 'solid-js'
import { useDebounceFn } from 'solidjs-use'
import { Button } from '../ui/button'
import { Separator } from '../ui/separator'
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
        <Show when={filteredGroup().length > 0}>
          <For each={filteredGroup()}>
            {(group) => (
              <Button variant="ghost" class="block w-full text-left">
                {group.group_memo || group.group_name || `群聊 ${group.group_id}`}
              </Button>
            )}
          </For>
        </Show>
      </div>
    </>
  )
}

export default GroupList
export { allGroups, setAllGroups }
