import {
  recentList,
  setActiveConv,
  setActiveId,
  setActiveType,
} from '@/libs/states/sessions'
import { type UnifyInfo, UnifyInfoType } from '@/libs/types/ws/unify-info'
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

  const changeTab = (o: UnifyInfo) => {
    if (o.type === UnifyInfoType.Group) {
      // setActiveConv(UnifyInfoType.Group, o.group_id)
      setActiveType(UnifyInfoType.Group)
      setActiveId(o.group_id)
    } else {
      // setActiveConv(UnifyInfoType.Private, o.user_id)
      setActiveType(UnifyInfoType.Private)
      setActiveId(o.user_id)
    }
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
        <Show when={filteredRecentList().length > 0} fallback="No friends">
          <For each={filteredRecentList()}>
            {(i) => (
              <Show
                when={i.type === UnifyInfoType.Private}
                fallback={
                  <Button
                    variant="ghost"
                    class="block w-full text-left"
                    onClick={() => changeTab(i)}
                  >
                    {/* @ts-ignore item type should be Group */}
                    {i.group_memo || i.group_name || `群聊 ${i.group_id}`}
                  </Button>
                }
              >
                <Button
                  variant="ghost"
                  class="block w-full text-left"
                  onClick={() => changeTab(i)}
                >
                  {/* @ts-ignore item type should be Private */}
                  {i.remark || i.nickname || i.user_id}
                </Button>
              </Show>
            )}
          </For>
        </Show>
      </div>
    </div>
  )
}

export default RecentConversationList
