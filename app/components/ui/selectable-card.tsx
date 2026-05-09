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
      className={`w-full text-left p-4 rounded-2xl border transition-colors active:bg-canvas
        ${selected ? 'border-primary bg-primary-soft' : 'border-hairline bg-paper'} ${className}`}
      style={{ boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}
      {...props}
    >
      {children}
    </button>
  )
}
