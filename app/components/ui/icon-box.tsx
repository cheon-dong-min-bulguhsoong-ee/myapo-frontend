'use client'
import type { LucideIcon } from 'lucide-react'
import type { ReactNode } from 'react'

type Tone = 'blue' | 'green' | 'yellow' | 'red' | 'info' | 'neutral' | 'purple'

interface IconBoxProps {
  icon?: LucideIcon
  tone: Tone
  size?: 'sm' | 'md' | 'lg'
  children?: ReactNode
  className?: string
}

const sizeClass: Record<NonNullable<IconBoxProps['size']>, string> = {
  sm: 'w-8 h-8',
  md: 'w-12 h-12',
  lg: 'w-14 h-14',
}

const iconSize: Record<NonNullable<IconBoxProps['size']>, number> = {
  sm: 16,
  md: 22,
  lg: 26,
}

export function IconBox({ icon: Icon, tone, size = 'md', children, className = '' }: IconBoxProps) {
  return (
    <div
      className={`ds-icon-box ds-tone-${tone} ${sizeClass[size]} flex items-center justify-center flex-shrink-0 ${className}`.trim()}
    >
      {Icon ? <Icon size={iconSize[size]} strokeWidth={2} /> : children}
    </div>
  )
}
