import { cn } from '../../lib/utils'
function Skeleton({
  className,
  variant = 'default',
  ...props
}: React.HTMLAttributes<HTMLDivElement> & { variant?: 'default' | 'circle' | 'text' | 'rectangular' }) {
  const variantClasses = {
    default: 'rounded',
    circle: 'rounded-full',
    text: 'h-4 w-full rounded',
    rectangular: 'h-10 w-full rounded-md',
  }
  return (
    <div
      className={cn(
        'animate-shimmer bg-gradient-to-r from-muted via-muted/50 to-muted bg-[length:200%_100%]',
        variantClasses[variant],
        className
      )}
      {...props}
    />
  )
}
export { Skeleton }
