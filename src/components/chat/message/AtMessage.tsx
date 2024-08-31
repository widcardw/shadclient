import { activeId, activeType, groupMemberCard } from '@/libs/states/sessions'
import type { CommonAtMessage } from '@/libs/types/messages/common-message'
import { UnifyInfoType } from '@/libs/types/ws/unify-info'
import type { Component } from 'solid-js'
import { groupMemberListStore } from '../GroupMemberList'

const AtMessage: Component<{ m: CommonAtMessage }> = (props) => {
  return (
    <span class="text-blue">
      {activeType() === UnifyInfoType.Group
        ? Number(props.m.data.qq) !== 0
          ? (props.m.data.name || `@${props.m.data.qq}`)
          : '@all'
        : ''}
    </span>
  )
}

export { AtMessage }
