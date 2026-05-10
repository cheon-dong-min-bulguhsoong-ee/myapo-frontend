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

const styles: Record<Tone, { bg: string; border: string; text: string }> = {
  info:    { bg: '#E8F2FE', border: '#3182F6', text: 'text-primary' },
  success: { bg: '#E6FAF3', border: '#00C48C', text: 'text-success' },
  warning: { bg: '#FFF4DE', border: '#FFB020', text: 'text-warning' },
  danger:  { bg: '#FDE7E9', border: '#F04452', text: 'text-danger' },
}

export function Callout({ tone = 'info', icon, title, description, onClick }: CalloutProps) {
  const Wrapper = onClick ? 'button' : 'div'
  const s = styles[tone]
  return (
    <Wrapper
      onClick={onClick}
      type={onClick ? 'button' : undefined}
      className="press w-full text-left flex items-start gap-2 p-3 rounded-[8px]"
      style={{ background: s.bg, border: `1px solid ${s.border}` }}
    >
      {icon === 'spinner' ? (
        <Spinner size="sm" tone={tone === 'info' ? 'primary' : 'ink'} className="flex-shrink-0 mt-0.5" />
      ) : icon ? (
        renderIcon(icon, s.text)
      ) : null}
      <div className="min-w-0 flex-1">
        <p className="text-[15px] font-bold text-ink leading-snug">{title}</p>
        {description && (
          <p className="text-[12px] leading-relaxed text-sub mt-0.5">{description}</p>
        )}
      </div>
    </Wrapper>
  )
}

function renderIcon(Icon: LucideIcon, textClass: string) {
  return <Icon size={16} className={`flex-shrink-0 mt-0.5 ${textClass}`} />
}
