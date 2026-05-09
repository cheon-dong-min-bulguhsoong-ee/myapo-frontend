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
      <p className="text-sm font-semibold text-ink px-1">{label}</p>
      <textarea
        value={value}
        {...rest}
        className="w-full h-32 p-3 rounded-2xl border border-hairline bg-paper text-sm text-ink resize-none focus:outline-none focus:border-primary"
      />
      {showCount && <p className="text-xs text-ink-muted px-1">{length}자</p>}
    </div>
  )
}
