import type { CommonFileMessage } from '@/libs/types/messages/common-message'
import { beautifyFileSize } from '@/libs/utils/file-size'
import type { Component } from 'solid-js'

const FileMessage: Component<{ m: CommonFileMessage }> = (props) => {
  const size = beautifyFileSize(props.m.data.size)
  return (
    <a
      href={props.m.data.file}
      target="_blank"
      class="text-blue"
      download={props.m.data.name}
      rel="noreferrer"
    >
      [File] {props.m.data.name} {size}
    </a>
  )
}

export { FileMessage }
