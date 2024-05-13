import type { Component } from 'solid-js'
import type { AlertDialogTriggerProps } from '@kobalte/core/alert-dialog'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogClose,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'

const InfoDialog: Component = () => {
  return (
    <AlertDialog>
      <AlertDialogTrigger
        as={(props: AlertDialogTriggerProps) => (
          <Button variant="ghost"  class="px-3" {...props}>
            <div class="i-teenyicons:info-circle-outline" />
          </Button>
        )}
      />
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Solid CQ Client</AlertDialogTitle>
          <AlertDialogDescription>
            <p>This is a client for CQ based on go-cqhttp and Solidjs.</p>
            Edit your configuration in the <div class="inline-block i-teenyicons:cog-outline" /> button
            and click on the <div class="inline-block i-teenyicons:link-outline" /> button to connect!
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogAction>Close</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

export { InfoDialog }
