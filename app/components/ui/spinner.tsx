'use client'

interface SpinnerProps {
  size?: 'xs' | 'sm' | 'md' | 'lg'
  tone?: 'primary' | 'ink' | 'inverted'
  className?: string
}

const sizeClass: Record<NonNullable<SpinnerProps['size']>, string> = {
  xs: 'w-3 h-3 border-2',
  sm: 'w-4 h-4 border-2',
  md: 'w-5 h-5 border-2',
  lg: 'w-8 h-8',
}

const toneClass: Record<NonNullable<SpinnerProps['tone']>, string> = {
  primary:  'border-primary border-t-transparent',
  ink:      'border-ink border-t-transparent',
  inverted: 'border-white border-t-transparent',
}

export function Spinner({ size = 'sm', tone = 'primary', className = '' }: SpinnerProps) {
  const lgBorder = size === 'lg' ? 'border-[3px]' : ''
  return (
    <div
      role="status"
      aria-label="로딩 중"
      className={`${sizeClass[size]} ${lgBorder} ${toneClass[tone]} rounded-full animate-spin ${className}`.trim()}
    />
  )
}
