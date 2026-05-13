'use client'
import type { TextareaHTMLAttributes } from 'react'

interface TextAreaProps extends Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, 'className'> {
  label: string
  showCount?: boolean
}

export function TextArea({ label, showCount, value, ...rest }: TextAreaProps) {
  const length = typeof value === 'string' ? value.length : 0
  return (
    <div>
      <p className="mb-2 px-1 text-xs font-semibold text-sub">{label}</p>
      <textarea value={value} {...rest} className="text-area" />
      {showCount && <p className="mt-2 px-1 text-xs text-muted">{length}자</p>}
    </div>
  )
}
