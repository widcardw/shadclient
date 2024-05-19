import { useColorMode } from '@kobalte/core/color-mode'
import { Toaster as Sonner } from 'solid-sonner'

export const Toaster = (props: Parameters<typeof Sonner>[0]) => {
  const { colorMode } = useColorMode()

  return (
    <Sonner
      theme={colorMode()}
      class="toaster group"
      toastOptions={{
        classes: {
          toast:
            'group toast group-[.toaster]:(bg-background text-foreground border border-border shadow-lg)',
          description: 'group-[.toast]:text-muted-foreground',
          actionButton: 'group-[.toast]:(bg-primary text-primary-foreground)',
          cancelButton: 'group-[.toast]:(bg-muted text-muted-foreground)',
          closeButton:
            'group-[.toast]:(bg-background text-foreground border border-border)',
        },
      }}
      {...props}
    />
  )
}
