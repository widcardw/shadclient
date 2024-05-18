import type { CommonEchoMessage } from './common-echo'

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
}

interface GroupFilesByFolderEcho extends CommonEchoMessage {
  data: GroupFsList
}

interface GroupFileUrlEcho extends CommonEchoMessage {
  data: {
    url: string
  }
}

export type {
  GroupFile,
  GroupFileFolder,
  GroupFsList,
  GroupRootFilesEcho,
  GroupFilesByFolderEcho,
  GroupFileUrlEcho,
}
