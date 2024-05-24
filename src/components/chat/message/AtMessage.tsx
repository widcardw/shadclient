import { activeId, activeType, groupMemberCard } from '@/libs/states/sessions'
import type { CommonAtMessage } from '@/libs/types/messages/common-message'
import { UnifyInfoType } from '@/libs/types/ws/unify-info'
import type { Component } from 'solid-js'

const AtMessage: Component<CommonAtMessage> = (props) => {
  return (
    <>
      {activeType() === UnifyInfoType.Group &&
        `@${groupMemberCard[activeId()]?.[props.data.qq] || props.data.qq}`}
    </>
  )
}

export { AtMessage }
