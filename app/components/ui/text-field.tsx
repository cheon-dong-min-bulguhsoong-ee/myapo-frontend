'use client'
import type { InputHTMLAttributes, ReactNode } from 'react'

interface TextFieldProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'className'> {
  label: string
  trailing?: ReactNode
  hint?: string
  error?: string
}

export function TextField({ label, trailing, hint, error, ...inputProps }: TextFieldProps) {
  const inputClass = `text-input ${error ? 'error' : ''}`.trim()
  return (
    <div>
      <p className="mb-2 px-1 text-xs font-semibold text-sub">{label}</p>
      {trailing ? (
        <div className="flex gap-2">
          <input {...inputProps} className={`${inputClass} flex-1`} />
          {trailing}
        </div>
      ) : (
        <input {...inputProps} className={inputClass} />
      )}
      {(hint || error) && (
        <p className={`mt-2 px-1 text-xs ${error ? 'text-danger' : 'text-muted'}`}>
          {error ?? hint}
        </p>
      )}
    </div>
  )
}
