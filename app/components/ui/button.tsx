'use client'
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
      <button
        {...props}
        className={`inline-flex min-h-10 items-center justify-center rounded-md px-1 text-[15px] font-semibold text-primary transition-colors active:opacity-70 disabled:cursor-not-allowed disabled:text-ink-muted ${
          className ?? ''
        }`}
      >
        {children}
      </button>
    )
  }

  const variantClass =
    variant === 'danger'
      ? 'bg-danger text-white active:bg-danger-deep'
      : variant === 'secondary'
        ? 'bg-primary-soft text-primary active:bg-hairline'
        : 'bg-primary text-white active:opacity-90'

  return (
    <button
      {...props}
      className={`inline-flex min-h-14 items-center justify-center rounded-xl px-5 text-base font-bold transition-colors disabled:cursor-not-allowed disabled:bg-hairline disabled:text-ink-muted ${
        fullWidth ? 'w-full' : ''
      } ${variantClass} ${className ?? ''}`}
    >
      {children}
    </button>
  )
}
