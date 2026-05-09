'use client'
import type { LucideIcon } from 'lucide-react'
import type { ReactNode } from 'react'
import { Spinner } from './spinner'

type Tone = 'info' | 'success' | 'warning' | 'danger'

interface CalloutProps {
  tone?: Tone
  icon?: LucideIcon | 'spinner'
  title: string
  description?: ReactNode
  onClick?: () => void
}

export function Callout({ tone = 'info', icon, title, description, onClick }: CalloutProps) {
  const Wrapper = onClick ? 'button' : 'div'
  return (
    <Wrapper
      onClick={onClick}
      className={`callout ${tone} press w-full text-left`}
      type={onClick ? 'button' : undefined}
    >
      {icon === 'spinner' ? (
        <Spinner size="sm" tone={tone === 'info' ? 'primary' : 'ink'} className="flex-shrink-0 mt-0.5" />
      ) : icon ? (
        renderIcon(icon)
      ) : null}
      <div className="min-w-0">
        <p className="text-[13px] font-bold text-ink leading-snug">{title}</p>
        {description && (
          <p className="text-[11px] text-ink-secondary mt-0.5 leading-snug">{description}</p>
        )}
      </div>
    </Wrapper>
  )
}

function renderIcon(Icon: LucideIcon) {
  return <Icon size={16} className="flex-shrink-0 mt-0.5" />
}
