'use client'
import { Badge } from '@toss/tds-mobile'

type PillVariant = 'success' | 'warning' | 'danger' | 'info' | 'neutral'

interface PillProps {
  variant?: PillVariant
  children: React.ReactNode
}

const colorMap: Record<PillVariant, 'green' | 'yellow' | 'red' | 'blue' | 'elephant'> = {
  success: 'green',
  warning: 'yellow',
  danger: 'red',
  info: 'blue',
  neutral: 'elephant',
}

export function Pill({ variant = 'neutral', children }: PillProps) {
  return (
    <Badge size="small" variant="weak" color={colorMap[variant]}>
      {children}
    </Badge>
  )
}
