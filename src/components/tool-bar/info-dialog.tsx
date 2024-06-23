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
import type { AlertDialogTriggerProps } from '@kobalte/core/alert-dialog'
import type { Component } from 'solid-js'

const InfoDialog: Component = () => {
  return (
    <AlertDialog>
      <AlertDialogTrigger
        as={(props: AlertDialogTriggerProps) => (
          <Button variant="ghost" size="icon" {...props}>
            <div class="i-teenyicons:info-circle-outline" />
          </Button>
        )}
      />
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Solid CQ Client</AlertDialogTitle>
          <AlertDialogDescription>
            <p>This is a client based on Lagrange.Core and Solid-js.</p>
            <p>
              Edit your configuration in the settings and click on the link
              button to connect!
            </p>
            <p>
              Find the source code on{' '}
              <a
                href="https://github.com/widcardw/shadclient"
                target="_blank"
                rel="noreferrer"
              >
                GitHub
              </a>
              .
            </p>
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
