'use client'
import { InputHTMLAttributes, ReactNode } from 'react'

interface TextFieldProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'className'> {
  label: string
  trailing?: ReactNode
}

export function TextField({ label, trailing, ...inputProps }: TextFieldProps) {
  return (
    <div>
      <p className="text-sm font-semibold text-ink mb-1.5">{label}</p>
      {trailing ? (
        <div className="flex gap-2">
          <input
            {...inputProps}
            className="flex-1 h-[52px] px-4 rounded-2xl border border-hairline bg-paper text-sm focus:outline-none focus:border-primary"
          />
          {trailing}
        </div>
      ) : (
        <input
          {...inputProps}
          className="w-full h-[52px] px-4 rounded-2xl border border-hairline bg-paper text-sm focus:outline-none focus:border-primary"
        />
      )}
    </div>
  )
}
