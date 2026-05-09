'use client'
import { ButtonHTMLAttributes, ReactNode } from 'react'

interface SelectableCardProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  selected: boolean
  children: ReactNode
}

export function SelectableCard({ selected, children, className = '', ...props }: SelectableCardProps) {
  return (
    <button
      type="button"
      className={`ds-card w-full text-left p-4 transition-colors active:bg-canvas
        ${selected ? 'ds-card-selected' : ''} ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}
