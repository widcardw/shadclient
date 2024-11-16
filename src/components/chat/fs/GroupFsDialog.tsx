import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { ws } from '@/libs/states/connection'
import {
  currentFolder,
  groupFsMap,
  groupFsStore,
  setCurrentFolder,
} from '@/libs/states/group-fs'
import { suffixToIcon } from '@/libs/utils/file-icon-map'
import { beautifyFileSize } from '@/libs/utils/file-size'
import { WsActions } from '@/libs/ws/websocket'
import type { DialogTriggerProps } from '@kobalte/core/dialog'
import clsx from 'clsx'
import { type Component, For, Show, createMemo } from 'solid-js'

function dateFormater(time: number) {
  return new Date(time * 1000).toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  })
}

const GroupFsDialog: Component<{ gid: number }> = (props) => {
  const currentFolderId = createMemo(() => groupFsMap[currentFolder()])
  const currentFs = createMemo(() => groupFsStore[currentFolderId()])

  const breadcrumb = createMemo(() => {
    const slices = currentFolder().split('/')
    const res = [{ label: 'root', folder: groupFsMap[slices[0]]?.toString() }]
    for (let i = 1; i < slices.length; i++) {
      const fullFolder = `${slices[i - 1]}/${slices[i]}`
      res.push({ label: slices[i], folder: fullFolder })
    }
    return res
  })

  const requestGetRootFolder = (group_id: number) => {
    if (!groupFsStore[group_id]) {
      console.log('get root folder', group_id)
      ws()?.send(WsActions.GetGroupRootFiles, { group_id }, { group_id })
    }
    setCurrentFolder(group_id.toString())
  }

  const requestGetFolder = (
    group_id: number,
    folder_id: number,
    folder: string,
  ) => {
    if (!groupFsStore[folder_id]) {
      console.log('get folder', group_id, folder_id, folder)
      ws()?.send(
        WsActions.GetGroupFilesByFolder,
        { group_id, folder_id },
        { group_id, folder_id, folder },
      )
    }
    setCurrentFolder(folder)
  }

  const requestDownloadFile = (
    group_id: number,
    file_id: string,
    busid: number,
    file_name: string,
  ) => {
    ws()?.send(
      WsActions.GetGroupFileUrl,
      { group_id, file_id, busid },
      { file_name },
    )
  }

  return (
    <Dialog>
      <DialogTrigger
        as={(_props: DialogTriggerProps) => {
          const click =
            typeof _props.onClick === 'function'
              ? (ev: MouseEvent) => {
                  requestGetRootFolder(props.gid)
                  /** @ts-ignore merge click events */
                  _props.onClick?.(ev)
                }
              : () => requestGetRootFolder(props.gid)

          return (
            <Button variant="ghost" {..._props} onClick={click}>
              <div class="i-teenyicons:folder-outline" />
            </Button>
          )
        }}
      />
      <DialogContent class="max-w-[1280px] of-y-auto">
        <DialogHeader>
          <DialogTitle>Group File</DialogTitle>
          <DialogDescription class="flex justify-between">
            <div class="flex gap-2 items-center">
              <For each={breadcrumb()}>
                {(b, i) => (
                  <>
                    <Show when={i() !== 0}>/</Show>
                    <Button
                      variant="ghost"
                      onClick={() => setCurrentFolder(b.folder)}
                    >
                      {b.label}
                    </Button>
                  </>
                )}
              </For>
              <Show when={currentFs()?.folders.length > 0}>
                <span>{currentFs()?.folders.length} folders</span>
              </Show>
              <Show when={currentFs()?.files.length > 0}>
                <span>{currentFs()?.files.length} files</span>
              </Show>
            </div>
            <Button
              variant="ghost"
              onClick={() =>
                currentFolder().includes('/')
                  ? requestGetFolder(
                      props.gid,
                      currentFolderId(),
                      currentFolder(),
                    )
                  : requestGetRootFolder(props.gid)
              }
            >
              <div class="i-teenyicons:refresh-outline" />
            </Button>
          </DialogDescription>
        </DialogHeader>
        <div class="h-80vh of-y-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead />
                <TableHead>Filename</TableHead>
                <TableHead>Creator</TableHead>
                <TableHead class="text-right w-[120px]">Size</TableHead>
                <TableHead class="text-right">Date</TableHead>
                <TableHead>Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <Show
                when={currentFs()}
                fallback={
                  <div class="flex flex-col space-y-2">
                    <Skeleton class="h-4 w-[600px]" />
                    <Skeleton class="h-4 w-[550px]" />
                    <Skeleton class="h-4 w-[500px]" />
                  </div>
                }
              >
                <For each={currentFs()?.folders}>
                  {(folder) => (
                    <TableRow>
                      <TableCell class="text-1rem">
                        <div class="i-teenyicons:folder-outline mx-a" />
                      </TableCell>
                      <TableCell>{folder.folder_name}</TableCell>
                      <TableCell>
                        {folder.creator_name || folder.creator}
                      </TableCell>
                      <TableCell />
                      <TableCell class="text-right">
                        {dateFormater(folder.create_time)}
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          title="Enter"
                          onClick={() =>
                            requestGetFolder(
                              props.gid,
                              folder.folder_id,
                              `${currentFolder()}/${folder.folder_name}`,
                            )
                          }
                        >
                          <div class="i-teenyicons:arrow-right-circle-outline" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  )}
                </For>
                <For each={currentFs()?.files}>
                  {(file) => (
                    <TableRow>
                      <TableCell class="text-1rem">
                        <div
                          class={clsx(
                            suffixToIcon(file.file_name.split('.').pop()),
                            'mx-a',
                          )}
                        />
                      </TableCell>
                      <TableCell>{file.file_name}</TableCell>
                      <TableCell>
                        {file.uploader_name || file.uploader}
                      </TableCell>
                      <TableCell class="text-right">
                        {beautifyFileSize(file.file_size)}
                      </TableCell>
                      <TableCell class="text-right">
                        {dateFormater(file.modify_time)}
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          onClick={() =>
                            requestDownloadFile(
                              props.gid,
                              file.file_id,
                              file.busid,
                              file.file_name,
                            )
                          }
                        >
                          <div class="i-teenyicons:download-outline" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  )}
                </For>
              </Show>
            </TableBody>
          </Table>
        </div>
        <div class="hidden">
          <For each={Object.keys(currentFs()?.files || [])}>{(i) => i}</For>
          <For each={Object.keys(currentFs()?.folders || [])}>{(i) => i}</For>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export { GroupFsDialog }
