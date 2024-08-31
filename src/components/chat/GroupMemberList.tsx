import type { GroupUser } from "@/libs/types/ws/group-user";
import { TextField } from "../ui/textfield";
import { type Component, Show, createSignal, createMemo, For } from "solid-js";
import { createStore } from "solid-js/store";
import { TextFieldRoot } from "../ui/textfield";
import { Separator } from "../ui/separator";
import { useDebounceFn } from "solidjs-use";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { roleToVariant } from "@/libs/utils/role";
import type { GotMemberInfo } from "@/libs/types/ws/echo/get-group-member-list";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "../ui/hover-card";
import type { HoverCardTriggerProps } from "@kobalte/core/hover-card";

const [groupMemberListStore, setGroupMemberListStore] = createStore<
  Record<number, GotMemberInfo[]>
>({})

const [groupMemberSet, setGroupMemberSet] = createStore<Record<number, Set<number>>>({})

const GroupMemberListComp: Component<{ gid: number }> = (props) => {
  const [search, setSearch] = createSignal('')
  const filteredUsers = createMemo(() => {
    if (!groupMemberListStore[props.gid]) return []
    const trimSearch = search().trim()
    if (trimSearch === '') return groupMemberListStore[props.gid]
    return groupMemberListStore[props.gid].filter(i =>
      i.card?.includes(trimSearch) || i.nickname?.includes(trimSearch)
    )
  })

  const debouncedSearch = useDebounceFn((e: InputEvent) => {
    setSearch((e.target as HTMLInputElement).value)
  }, 500)
  return (
    <div class="h-100vh flex flex-col w-250px">
      <TextFieldRoot class="block w-full sticky p-1">
        <TextField
          placeholder="Search"
          value={search()}
          onInput={(e: InputEvent) => debouncedSearch(e)}
        />
      </TextFieldRoot>
      <Separator />
      <div class="flex-grow of-y-auto flex flex-col gap-1 p-1 w-250px of-x-clip">
        <Button variant="ghost" disabled>
          5 日内活跃群成员 ({groupMemberListStore[props.gid]?.length || 0})
        </Button>
        <Show when={filteredUsers()?.length > 0}>
          <For each={filteredUsers()}>
            {(user) => (
              <HoverCard openDelay={2000}>
                <HoverCardTrigger as={(_props: HoverCardTriggerProps) => (
                  <Button
                    variant="ghost"
                    class="block text-left whitespace-nowrap text-ellipsis"
                    {..._props}
                  >
                    {user.card || user.nickname || user.user_id}
                    <Show
                      when={
                        user.role === 'admin' ||
                        user.role === 'owner'
                      }
                    >
                      <Badge variant={roleToVariant(user.role)} class="ml-1">
                        {user.role}
                      </Badge>
                    </Show>
                  </Button>
                )} />
                <HoverCardContent class="max-w-350px flex flex-col gap-1 p-1">
                  {user.card && <Button variant="ghost">{user.card}</Button>}
                  <Button variant="ghost">{user.nickname}</Button>
                  <Button
                    variant="ghost"
                    onClick={() => navigator.clipboard.writeText(user.user_id.toString())}
                  >{user.user_id}</Button>
                </HoverCardContent>
              </HoverCard>
            )}
          </For>
        </Show>
      </div>
    </div>
  )
}

export {
  groupMemberListStore,
  setGroupMemberListStore,
  groupMemberSet,
  setGroupMemberSet,
  GroupMemberListComp,
}
