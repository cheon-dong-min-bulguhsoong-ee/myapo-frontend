import { HTMLAttributes, ReactNode } from 'react'

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode
  clickable?: boolean
}

export function Card({ children, clickable, className = '', ...props }: CardProps) {
  return (
    <div
      className={`bg-paper rounded-2xl border border-hairline p-5 ${clickable ? 'active:bg-canvas cursor-pointer' : ''} ${className}`}
      style={{ boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}
      {...props}
    >
      {children}
    </div>
  )
}
