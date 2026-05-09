'use client'

interface ProgressFillProps {
  value: number // 0-100
}

export function ProgressFill({ value }: ProgressFillProps) {
  const progress = Math.max(0, Math.min(100, value))

  return (
    <progress className="ds-progress" value={progress} max={100} aria-label="진행률" />
  )
}
