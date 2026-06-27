import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '../../lib/utils'
const badgeVariants = cva(
  'inline-flex items-center justify-center rounded-full border text-xs font-medium w-fit whitespace-nowrap shrink-0 [&>svg]:size-3 gap-1 [&>svg]:pointer-events-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 aria-invalid:border-destructive transition-all duration-150 overflow-hidden',
  {
    variants: {
      variant: {
        default:
          'border-transparent bg-primary/10 text-primary [a&]:hover:bg-primary/20',
        secondary:
          'border-transparent bg-secondary text-secondary-foreground [a&]:hover:bg-secondary/80',
        destructive:
          'border-transparent bg-destructive/10 text-destructive [a&]:hover:bg-destructive/20 focus-visible:ring-destructive/20',
        outline:
          'border-border text-foreground [a&]:hover:bg-muted [a&]:hover:text-foreground',
        success:
          'border-transparent bg-green-500/10 text-green-600 [a&]:hover:bg-green-500/20',
        warning:
          'border-transparent bg-orange-500/10 text-orange-600 [a&]:hover:bg-orange-500/20',
      },
      size: {
        default: 'px-2.5 py-1 text-xs',
        sm: 'px-2 py-0.5 text-[10px]',
        lg: 'px-3 py-1.5 text-sm',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
)
function Badge({
  className,
  variant,
  size,
  ...props
}: React.ComponentProps<'span'> &
  VariantProps<typeof badgeVariants>) {
  return (
    <span
      data-slot="badge"
      className={cn(badgeVariants({ variant, size }), className)}
      {...props}
    />
  )
}
export { Badge, badgeVariants }
