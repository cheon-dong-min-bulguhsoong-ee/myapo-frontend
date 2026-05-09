'use client'
import { TextareaHTMLAttributes } from 'react'

interface TextAreaProps extends Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, 'className'> {
  label: string
  showCount?: boolean
}

export function TextArea({ label, showCount, value, ...rest }: TextAreaProps) {
  const length = typeof value === 'string' ? value.length : 0
  return (
    <div className="space-y-1.5">
      <p className="ds-control-label text-ink px-1">{label}</p>
      <textarea
        value={value}
        {...rest}
        className="ds-input ds-textarea"
      />
      {showCount && <p className="ds-caption text-ink-muted px-1">{length}자</p>}
    </div>
  )
}
