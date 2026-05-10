'use client'
import type { ButtonHTMLAttributes, ReactNode } from 'react'

interface SelectableCardProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  selected: boolean
  children: ReactNode
}

export function SelectableCard({ selected, children, className = '', ...props }: SelectableCardProps) {
  return (
    <button
      type="button"
      className={`selectable-card press ${selected ? 'selected' : ''} ${className}`.trim()}
      {...props}
    >
      {children}
    </button>
  )
}
