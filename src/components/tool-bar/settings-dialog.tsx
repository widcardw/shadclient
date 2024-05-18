import { createSignal, type Component } from 'solid-js'

import type { DialogTriggerProps } from '@kobalte/core/dialog'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  TextField,
  TextFieldLabel,
  TextFieldRoot,
} from '@/components/ui/textfield'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { useStorage } from 'solidjs-use'
import { WSURL } from '@/libs/config'

const SettingsDialog: Component = () => {
  const [wsUrl, setWsUrl] = useStorage('wsUrl', WSURL)
  const [sendBy, setSendBy] = useStorage('sendBy', 'Ctrl Enter')
  const [open, setOpen] = createSignal(false)

  return (
    <Dialog open={open()} onOpenChange={setOpen}>
      <DialogTrigger
        as={(props: DialogTriggerProps) => (
          <Button variant="ghost" class="px-3" {...props}>
            <div class="i-teenyicons:cog-outline" />
          </Button>
        )}
      />
      <DialogContent class="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit profile</DialogTitle>
          <DialogDescription>
            Make changes to your profile here. Click save when you're done.
          </DialogDescription>
        </DialogHeader>
        <div class="grid gap-4 py-4">
          <TextFieldRoot class="grid grid-cols-3 items-center gap-4 md:grid-cols-4">
            <TextFieldLabel class="text-right">WS Server</TextFieldLabel>
            <TextField
              class="col-span-2 md:col-span-3"
              value={wsUrl()}
              onChange={(e: Event) =>
                setWsUrl((e.currentTarget as HTMLInputElement).value)
              }
            />
          </TextFieldRoot>
          <TextFieldRoot class="grid grid-cols-3 items-center gap-4 md:grid-cols-4">
            <TextFieldLabel class="text-right">Send by</TextFieldLabel>
            <Select
              class="col-span-2 md:col-span-3"
              options={['Ctrl Enter', 'Enter']}
              defaultValue={sendBy()}
              required
              itemComponent={(props) => (
                <SelectItem item={props.item}>{props.item.rawValue}</SelectItem>
              )}
              onChange={setSendBy}
            >
              <SelectTrigger>
                <SelectValue<string>>
                  {(state) => state.selectedOption()}
                </SelectValue>
              </SelectTrigger>
              <SelectContent />
            </Select>
          </TextFieldRoot>
        </div>
        <DialogFooter>
          <Button type="submit" onClick={() => setOpen(false)}>
            Save changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default SettingsDialog
