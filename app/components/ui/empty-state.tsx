'use client'
import type { LucideIcon } from 'lucide-react'
import { Button } from './button'

interface EmptyStateProps {
  icon: LucideIcon
  title: string
  description?: string
  ctaLabel?: string
  onCta?: () => void
}

export function EmptyState({ icon: Icon, title, description, ctaLabel, onCta }: EmptyStateProps) {
  return (
    <div className="flex h-full min-h-[280px] flex-col items-center justify-center px-6 py-10 text-center">
      <Icon size={48} strokeWidth={1.5} className="mb-4 text-muted" />
      <h2 className="text-[15px] font-bold leading-snug text-ink">{title}</h2>
      {description && (
        <p className="mt-1.5 text-[12px] leading-relaxed text-sub">{description}</p>
      )}
      {ctaLabel && onCta && (
        <div className="mt-5 w-full max-w-[200px]">
          <Button variant="secondary" onClick={onCta}>
            {ctaLabel}
          </Button>
        </div>
      )}
    </div>
  )
}
