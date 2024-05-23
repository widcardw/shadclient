import { recentList } from '@/libs/states/sessions'
import { UnifyInfoType } from '@/libs/types/ws/unify-info'
import { type Component, For, Show, createMemo, createSignal } from 'solid-js'
import { useDebounceFn } from 'solidjs-use'
import { Button } from '../ui/button'
import { Separator } from '../ui/separator'
import { TextField, TextFieldRoot } from '../ui/textfield'

/**
 * 最近会话列表，包含了私聊和群聊的一个个小的实例
 */
const RecentConversationList: Component = () => {
  const [search, setSearch] = createSignal('')
  const filteredRecentList = createMemo(() => {
    const trimSearch = search().trim()
    if (trimSearch === '') return recentList()
    return recentList().filter((i) => {
      switch (i.type) {
        case UnifyInfoType.Group: {
          return (
            i.group_memo?.includes(trimSearch) ||
            i.group_name.includes(trimSearch)
          )
        }
        case UnifyInfoType.Private: {
          i.remark?.includes(trimSearch) || i.nickname.includes(trimSearch)
        }
      }
    })
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
        <Show when={filteredRecentList().length > 0} fallback="No friends">
          <For each={filteredRecentList()}>
            {(item) => (
              <Show
                when={item.type === UnifyInfoType.Private}
                fallback={
                  <Button variant="ghost" class="block w-full text-left">
                    {/* @ts-ignore item type should be Group */}
                    {item.group_memo || item.group_name || `群聊 ${item.group_id}`}
                  </Button>
                }
              >
                <Button variant="ghost" class="block w-full text-left">
                  {/* @ts-ignore item type should be Private */}
                  {item.remark || item.nickname || item.user_id}
                </Button>
              </Show>
            )}
          </For>
        </Show>
      </div>
    </>
  )
}

export default RecentConversationList
