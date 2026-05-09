'use client'
import { Button as TDSButton, TextButton } from '@toss/tds-mobile'
import type { ButtonHTMLAttributes, ReactNode } from 'react'

interface ButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'color'> {
  variant?: 'primary' | 'danger' | 'secondary' | 'text-link'
  children: ReactNode
  fullWidth?: boolean
}

export function Button({
  variant = 'primary',
  children,
  fullWidth,
  className,
  ...props
}: ButtonProps) {
  if (variant === 'text-link') {
    return (
      <TextButton size="medium" {...(props as React.ComponentProps<typeof TextButton>)}>
        {children}
      </TextButton>
    )
  }

  const color = variant === 'danger' ? 'danger' : variant === 'secondary' ? 'light' : 'primary'
  const size = variant === 'secondary' ? 'large' : 'xlarge'
  const display = fullWidth ? 'block' : 'inline'

  return (
    <TDSButton
      color={color}
      variant="fill"
      size={size}
      display={display}
      className={className}
      {...(props as React.ComponentProps<typeof TDSButton>)}
    >
      {children}
    </TDSButton>
  )
}
