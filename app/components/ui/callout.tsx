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

const styles: Record<Tone, { surface: string; text: string }> = {
  info:    { surface: 'bg-primary-soft border-primary', text: 'text-primary' },
  success: { surface: 'bg-success-soft border-success', text: 'text-success' },
  warning: { surface: 'bg-warning-soft border-warning', text: 'text-warning' },
  danger:  { surface: 'bg-danger-soft border-danger', text: 'text-danger' },
}

export function Callout({ tone = 'info', icon, title, description, onClick }: CalloutProps) {
  const Wrapper = onClick ? 'button' : 'div'
  const s = styles[tone]
  return (
    <Wrapper
      onClick={onClick}
      type={onClick ? 'button' : undefined}
      className={`press flex w-full items-start gap-2 rounded-xl border p-3 text-left ${s.surface}`}
    >
      {icon === 'spinner' ? (
        <Spinner size="sm" tone={tone === 'info' ? 'primary' : 'ink'} className="flex-shrink-0 mt-0.5" />
      ) : icon ? (
        renderIcon(icon, s.text)
      ) : null}
      <div className="min-w-0 flex-1">
        <p className="text-sm font-bold leading-snug text-ink">{title}</p>
        {description && (
          <p className="mt-1 text-xs leading-relaxed text-sub">{description}</p>
        )}
      </div>
    </Wrapper>
  )
}

function renderIcon(Icon: LucideIcon, textClass: string) {
  return <Icon size={16} className={`flex-shrink-0 mt-0.5 ${textClass}`} />
}
