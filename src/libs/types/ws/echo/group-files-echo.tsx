import { setGroupFsMap, setGroupFsStore } from '@/libs/states/group-fs'
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
  setGroupFsStore(group_id, data.data)
  setGroupFsMap(group_id.toString(), group_id)
}

interface GroupFilesByFolderEcho extends CommonEchoMessage {
  data: GroupFsList
  echo: GroupFilesByFolderEchoCarried
}

interface GroupFilesByFolderEchoCarried extends EchoedObject {
  action: WsActions.GetGroupFilesByFolder
  group_id: number
  folder_id: number
  folder: string
}

function dispatchGroupFilesByFolderEcho(data: GroupFilesByFolderEcho) {
  const folder_id = data.echo.folder_id
  setGroupFsStore(folder_id, data.data)
  setGroupFsMap(data.echo.folder, folder_id)
}

interface GroupFileUrlEcho extends CommonEchoMessage {
  data: { url: string }
  echo: GroupFileUrlEchoCarried
}

interface GroupFileUrlEchoCarried extends EchoedObject {
  action: WsActions.GetGroupFileUrl
  file_name: string
}

function dispatchGroupFileUrlEcho(data: GroupFileUrlEcho) {
  const url = data.data.url
  toast('Download will start in 5s.', {
    duration: 5000,
    onAutoClose: () => {
      if (typeof window === 'undefined') {
        toast('Download failed since window is not available.')
        return
      }
      const el = document.createElement('a')
      el.href = url // .replace(/^https:\/\/(\d+\.\d+\.\d+\.\d+)/, 'http://$1')
      el.download = data.echo.file_name
      el.target = '_blank'
      el.referrerPolicy = 'no-referrer'
      el.rel = 'noreferrer'
      el.click()
      el.remove()
    }
  })
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
