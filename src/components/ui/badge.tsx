import { cn } from '@/libs/cn'
import type { VariantProps } from 'class-variance-authority'
import { cva } from 'class-variance-authority'
import { type ComponentProps, splitProps } from 'solid-js'

export const badgeVariants = cva(
  'inline-flex items-center rounded-md px-2.5 py-0.5 text-xs font-semibold transition-shadow focus-visible:(outline-none ring-1.5 ring-ring)',
  {
    variants: {
      variant: {
        default:
          'bg-primary text-primary-foreground shadow hover:bg-primary/80',
        secondary:
          'bg-secondary text-secondary-foreground hover:bg-secondary/80',
        destructive:
          'bg-destructive text-destructive-foreground shadow hover:bg-destructive/80',
        outline: 'border text-foreground',
        owner: 'bg-yellow-500 text-primary-foreground shadow hover:bg-yellow-500/80',
        admin: 'bg-green-600 text-primary-foreground shadow hover:bg-green-400/80',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
)

export const Badge = (
  props: ComponentProps<'div'> & VariantProps<typeof badgeVariants>,
) => {
  const [local, rest] = splitProps(props, ['class', 'variant'])

  return (
    <div
      class={cn(
        badgeVariants({
          variant: local.variant,
        }),
        local.class,
      )}
      {...rest}
    />
  )
}
