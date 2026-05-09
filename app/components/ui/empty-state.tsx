'use client'
import { LucideIcon } from 'lucide-react'
import { Result } from '@toss/tds-mobile'

interface EmptyStateProps {
  icon: LucideIcon
  title: string
  description?: string
  ctaLabel?: string
  onCta?: () => void
}

export function EmptyState({ icon: Icon, title, description, ctaLabel, onCta }: EmptyStateProps) {
  return (
    <Result
      figure={<Icon size={64} strokeWidth={1} style={{ color: 'var(--adaptiveGrey400, #8B95A1)' }} />}
      title={title}
      description={description}
      button={
        ctaLabel && onCta ? (
          <Result.Button color="light" variant="fill" size="large" onClick={onCta}>
            {ctaLabel}
          </Result.Button>
        ) : undefined
      }
    />
  )
}
