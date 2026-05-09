'use client'
import type { ButtonHTMLAttributes, ReactNode } from 'react'

interface ButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'color'> {
  variant?: 'primary' | 'danger' | 'secondary' | 'ghost' | 'inverted' | 'text-link'
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
      <button
        {...props}
        className={`inline-flex min-h-10 items-center justify-center px-1 ds-body font-semibold text-primary transition-opacity active:opacity-70 disabled:cursor-not-allowed disabled:text-ink-muted ${
          className ?? ''
        }`}
      >
        {children}
      </button>
    )
  }

  const variantClass =
    variant === 'danger'
      ? 'danger'
      : variant === 'secondary'
        ? 'secondary'
        : variant === 'ghost'
          ? 'ghost'
          : variant === 'inverted'
            ? 'inverted'
            : 'primary'

  return (
    <button
      {...props}
      className={`btn press min-h-13 px-6 text-base disabled:cursor-not-allowed disabled:bg-hairline disabled:text-ink-muted ${
        fullWidth ? 'w-full' : ''
      } ${variantClass} ${className ?? ''}`}
    >
      {children}
    </button>
  )
}
