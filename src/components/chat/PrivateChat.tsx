import type { Component } from 'solid-js'
import { allFriends } from '../conversation-list/friend-list'
import { Button } from '../ui/button'
import { Separator } from '../ui/separator'

const PrivateChat: Component<{ uid: number }> = (props) => {
  const friend = allFriends().find((i) => i.user_id === props.uid)!

  return (
    <div class="w-full">
      <div class="p-4 flex" title="Group Info and History/File Tool Bar">
        <div class="font-bold mr-auto">
          {friend.remark || friend.nickname} ({friend.user_id})
        </div>
        <Button variant="ghost">
          <div class="i-teenyicons:history-outline" />
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

export { PrivateChat }
