'use client'
import { InputHTMLAttributes, ReactNode } from 'react'

interface TextFieldProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'className'> {
  label: string
  trailing?: ReactNode
  hint?: string
  error?: string
}

export function TextField({ label, trailing, hint, error, ...inputProps }: TextFieldProps) {
  const inputClass = `ds-input ${error ? 'ds-input-error' : ''}`
  return (
    <div>
      <p className="ds-control-label text-ink-secondary mb-2">{label}</p>
      {trailing ? (
        <div className="flex gap-2">
          <input {...inputProps} className={`${inputClass} flex-1`} />
          {trailing}
        </div>
      ) : (
        <input {...inputProps} className={inputClass} />
      )}
      {(hint || error) && (
        <p
          className={`mt-1.5 ds-overline normal-case tracking-normal ${error ? 'text-danger' : 'text-ink-muted'}`}
        >
          {error ?? hint}
        </p>
      )}
    </div>
  )
}
