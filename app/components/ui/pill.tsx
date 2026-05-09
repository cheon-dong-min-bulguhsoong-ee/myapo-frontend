'use client'

type PillVariant = 'success' | 'warning' | 'danger' | 'info' | 'neutral'

interface PillProps {
  variant?: PillVariant
  children: React.ReactNode
}

const colorMap: Record<PillVariant, string> = {
  success: 'bg-success-soft text-success',
  warning: 'bg-warning-soft text-warning',
  danger: 'bg-danger-soft text-danger',
  info: 'bg-info-soft text-info',
  neutral: 'bg-canvas text-ink-secondary',
}

export function Pill({ variant = 'neutral', children }: PillProps) {
  return (
    <span className={`inline-flex h-6 items-center rounded-md px-2 text-xs font-bold ${colorMap[variant]}`}>
      {children}
    </span>
  )
}
