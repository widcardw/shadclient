import type { CommonFileMessage } from '@/libs/types/messages/common-message'
import { beautifyFileSize } from '@/libs/utils/file-size'
import type { Component } from 'solid-js'

const FileMessage: Component<CommonFileMessage> = (props) => {
  const size = beautifyFileSize(props.data.size)
  return (
    <a
      href={props.data.file}
      target="_blank"
      class="text-blue"
      download={props.data.name}
      rel="noreferrer"
    >
      [文件] {props.data.name} {size}
    </a>
  )
}

export { FileMessage }
