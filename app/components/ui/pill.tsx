'use client'

type PillVariant = 'success' | 'warning' | 'danger' | 'info' | 'neutral'

interface PillProps {
  variant?: PillVariant
  children: React.ReactNode
}

const colorMap: Record<PillVariant, string> = {
  success: 'green',
  warning: 'yellow',
  danger: 'red',
  info: '',
  neutral: 'gray',
}

export function Pill({ variant = 'neutral', children }: PillProps) {
  return (
    <span className={`chip sm ${colorMap[variant]}`}>
      {children}
    </span>
  )
}
