'use client'
import type { ReactNode } from 'react'

interface DocCardProps {
  issuerIcon: string         // 'NTS', '법원', 'MOIS', …
  name: string
  englishName?: string
  use?: string
  issuerCode?: string        // 'KR-NTS', 'KR-법원', …
  selected?: boolean
  disabled?: boolean
  expired?: boolean
  onClick?: () => void
  trailing?: ReactNode
}

export function DocCard({
  issuerIcon,
  name,
  englishName,
  use,
  issuerCode,
  selected,
  disabled,
  expired,
  onClick,
  trailing,
}: DocCardProps) {
  return (
    <button
      type="button"
      role="checkbox"
      aria-checked={selected}
      disabled={disabled}
      onClick={onClick}
      className={`doc-card press w-full text-left ${selected ? 'selected' : ''} ${expired ? 'expired' : ''}`}
    >
      <span className="doc-card-icon" aria-hidden>{issuerIcon}</span>
      <div className="flex-1 min-w-0">
        <div className="text-[13px] font-bold text-ink leading-snug truncate">
          {name}
        </div>
        {englishName && (
          <div className="font-mono text-[11px] text-ink-muted leading-snug truncate">
            {englishName}
          </div>
        )}
        {use && (
          <div className="text-[11px] text-ink-secondary leading-snug mt-0.5 truncate">
            {use}
          </div>
        )}
      </div>
      {trailing ?? (issuerCode && (
        <span className="doc-card-issuer">{issuerCode}</span>
      ))}
    </button>
  )
}
