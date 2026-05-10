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
  const className = ['doc-card press', selected && 'selected', expired && 'expired'].filter(Boolean).join(' ')
  return (
    <button
      type="button"
      role="checkbox"
      aria-checked={selected}
      disabled={disabled}
      onClick={onClick}
      className={className}
    >
      <div className="doc-card-icon" aria-hidden>{issuerIcon}</div>
      <div className="doc-card-body">
        <div className="doc-card-name">{name}</div>
        {englishName && <div className="doc-card-eng">{englishName}</div>}
        {use && <div className="doc-card-use">{use}</div>}
      </div>
      {trailing ?? (issuerCode && (
        <span className="doc-card-issuer">{issuerCode}</span>
      ))}
    </button>
  )
}
