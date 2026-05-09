import { HTMLAttributes, ReactNode } from 'react'

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode
  clickable?: boolean
  variant?: 'soft' | 'paper' | 'outline' | 'ink' | 'blue'
}

export function Card({
  children,
  clickable,
  variant = 'soft',
  className = '',
  ...props
}: CardProps) {
  const variantClass =
    variant === 'ink'
      ? 'card ink'
      : variant === 'blue'
        ? 'card blue'
        : variant === 'outline'
          ? 'card outline'
          : variant === 'paper'
            ? 'ds-card'
            : 'card'

  return (
    <div
      className={`${variantClass} ${clickable ? 'press cursor-pointer transition-colors active:bg-hairline-soft' : ''} ${className}`}
      {...props}
    >
      {children}
    </div>
  )
}
