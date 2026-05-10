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
      <p className="text-[12px] font-semibold text-sub mb-2 px-1">{label}</p>
      <textarea value={value} {...rest} className="text-area" />
      {showCount && <p className="mt-1.5 text-[12px] text-muted px-1">{length}자</p>}
    </div>
  )
}
