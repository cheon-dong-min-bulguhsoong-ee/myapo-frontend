'use client'
import type { ButtonHTMLAttributes, ReactNode } from 'react'

type Variant = 'primary' | 'secondary' | 'danger' | 'ghost' | 'inverted' | 'text-link'

interface ButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'color'> {
  variant?: Variant
  children: ReactNode
  fullWidth?: boolean
}

const variantClass: Record<Exclude<Variant, 'text-link'>, string> = {
  primary:  'btn-primary',
  secondary:'btn-secondary',
  danger:   'btn-danger',
  ghost:    'btn-ghost',
  inverted: 'btn-inverted',
}

export function Button({ variant = 'primary', children, fullWidth, className = '', ...props }: ButtonProps) {
  if (variant === 'text-link') {
    return (
      <button
        type="button"
        {...props}
        className={`inline-flex min-h-10 items-center justify-center px-1 text-sm font-semibold text-primary transition-opacity active:opacity-70 disabled:cursor-not-allowed disabled:text-muted ${className}`}
      >
        {children}
      </button>
    )
  }
  const base = variantClass[variant]
  const widthClass = fullWidth === false ? '' : ''
  return (
    <button
      type="button"
      {...props}
      className={`${base} ${widthClass} ${className}`.trim()}
    >
      {children}
    </button>
  )
}
