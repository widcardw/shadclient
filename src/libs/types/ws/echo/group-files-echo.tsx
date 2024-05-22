import { setGroupFsStore } from '@/libs/states/group-fs'
import type { WsActions } from '@/libs/ws/websocket'
import { onMount } from 'solid-js'
import { toast } from 'solid-sonner'
import type { CommonEchoMessage, EchoedObject } from './common-echo'

interface GroupFile {
  group_id: number
  file_id: string
  file_name: string
  busid: number
  file_size: number
  upload_time: number
  dead_time: number
  modify_time: number
  download_times: number
  uploader: number
  uploader_name: string
}

interface GroupFileFolder {
  group_id: number
  folder_id: number
  folder_name: string
  create_time: number
  creator: number
  creator_name: string
  total_file_count: number
}

interface GroupFsList {
  files: GroupFile[]
  folders: GroupFileFolder[]
}

interface GroupRootFilesEcho extends CommonEchoMessage {
  data: GroupFsList
  echo: GroupRootFilesEchoCarried
}

interface GroupRootFilesEchoCarried extends EchoedObject {
  action: WsActions.GetGroupRootFiles
  group_id: number
}

function dispatchGroupRootFilesEcho(data: GroupRootFilesEcho) {
  const group_id = data.echo.group_id
  setGroupFsStore(group_id.toString(), data.data)
}

interface GroupFilesByFolderEcho extends CommonEchoMessage {
  data: GroupFsList
  echo: GroupFilesByFolderEchoCarried
}

interface GroupFilesByFolderEchoCarried extends EchoedObject {
  action: WsActions.GetGroupFilesByFolder
  group_id: number
  folder_id: string
}

function dispatchGroupFilesByFolderEcho(data: GroupFilesByFolderEcho) {
  const folder_id = data.echo.folder_id
  setGroupFsStore(folder_id, data.data)
}

interface GroupFileUrlEcho extends CommonEchoMessage {
  data: { url: string }
  echo: GroupFileUrlEchoCarried
}

interface GroupFileUrlEchoCarried extends EchoedObject {
  action: WsActions.GetGroupFileUrl
}

function dispatchGroupFileUrlEcho(data: GroupFileUrlEcho) {
  const url = data.data.url
  toast(
    <a
      href={url}
      target="_blank"
      download="file"
      referrerPolicy="no-referrer"
      rel="noreferrer"
    >
      Click to download
    </a>,
    {
      duration: Number.POSITIVE_INFINITY,
    },
  )
}

export type {
  GroupFile,
  GroupFileFolder,
  GroupFsList,
  GroupRootFilesEcho,
  GroupFilesByFolderEcho,
  GroupFileUrlEcho,
}

export {
  dispatchGroupFileUrlEcho,
  dispatchGroupRootFilesEcho,
  dispatchGroupFilesByFolderEcho,
}
