import type { CommonRecordMessage } from '@/libs/types/messages/common-message'
import type { Component } from 'solid-js'

const RecordMessage: Component<{ m: CommonRecordMessage }> = (props) => {
  return (
    <div class="flex items-center gap-2">
      <a href={props.m.data.url} target="_blank" rel="noreferrer">
        [Record Message]
      </a>
    </div>
  )
}

export { RecordMessage }
