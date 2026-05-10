import type { HTMLAttributes, ReactNode } from 'react'

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode
  clickable?: boolean
}

export function Card({ children, clickable, className = '', ...props }: CardProps) {
  return (
    <div
      className={`card ${clickable ? 'press cursor-pointer' : ''} ${className}`.trim()}
      {...props}
    >
      {children}
    </div>
  )
}
