'use client'
import { LucideIcon } from 'lucide-react'
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
    <div className="flex h-full min-h-64 flex-col items-center justify-center px-6 py-10 text-center">
      <Icon size={64} strokeWidth={1} className="mb-5 text-ink-muted" />
      <h2 className="text-[19px] font-bold leading-snug text-ink">{title}</h2>
      {description && <p className="mt-2 text-[14px] leading-relaxed text-ink-secondary">{description}</p>}
      {ctaLabel && onCta && (
        <div className="mt-6">
          <Button variant="secondary" onClick={onCta}>
            {ctaLabel}
          </Button>
        </div>
      )}
    </div>
  )
}
