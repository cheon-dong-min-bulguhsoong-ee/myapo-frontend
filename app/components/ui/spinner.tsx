'use client'

interface SpinnerProps {
  size?: 'xs' | 'sm' | 'md'
  tone?: 'primary' | 'ink' | 'inverted'
  className?: string
}

const sizeClass: Record<NonNullable<SpinnerProps['size']>, string> = {
  xs: 'w-3 h-3',
  sm: 'w-4 h-4',
  md: 'w-5 h-5',
}

const toneClass: Record<NonNullable<SpinnerProps['tone']>, string> = {
  primary: 'border-primary border-t-transparent',
  ink: 'border-ink border-t-transparent',
  inverted: 'border-white border-t-transparent',
}

export function Spinner({ size = 'sm', tone = 'primary', className = '' }: SpinnerProps) {
  return (
    <div
      role="status"
      aria-label="로딩 중"
      className={`${sizeClass[size]} ${toneClass[tone]} border-2 rounded-full animate-spin ${className}`.trim()}
    />
  )
}
