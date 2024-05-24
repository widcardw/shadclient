import { activeConv, groupMemberCard } from '@/libs/states/sessions'
import type { CommonAtMessage } from '@/libs/types/messages/common-message'
import type { Component } from 'solid-js'

const AtMessage: Component<CommonAtMessage> = (props) => {
  const group_id = activeConv()?.id
  return (
    <>
      {group_id &&
        `@${groupMemberCard[group_id]?.[props.data.qq] || props.data.qq}`}
    </>
  )
}

export { AtMessage }
