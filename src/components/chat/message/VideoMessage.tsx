import type { CommonVideoMessage } from '@/libs/types/messages/common-message'
import type { Component } from 'solid-js'

const VideoMessage: Component<{ m: CommonVideoMessage }> = (props) => {
  return (
    <video src={props.m.data.file} controls>
      <track kind="captions" />
    </video>
  )
}

export { VideoMessage }
