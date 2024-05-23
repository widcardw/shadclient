import type { Component } from 'solid-js'
import { allGroups } from '../conversation-list/group-list'
import { Button } from '../ui/button'
import { Separator } from '../ui/separator'

const GroupChat: Component<{ gid: number }> = (props) => {
  const group = allGroups().find((i) => i.group_id === props.gid)!

  return (
    <div class="w-full">
      <div class="p-4 flex" title="Group Info and History/File Tool Bar">
        <div class="font-bold mr-auto">
          {group.group_memo || group.group_name} ({group.group_id})
        </div>
        <Button variant="ghost">
          <div class="i-teenyicons:history-outline" />
        </Button>
        <Button variant="ghost">
          <div class="i-teenyicons:folder-outline" />
        </Button>
        <Button variant="ghost">
          <div class="i-teenyicons:arrow-down-circle-outline" />
        </Button>
      </div>
      <Separator />
      <div title="Main Chat Area">

      </div>
    </div>
  )
}

export { GroupChat }
