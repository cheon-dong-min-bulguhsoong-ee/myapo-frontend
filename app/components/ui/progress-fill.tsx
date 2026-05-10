'use client'

interface ProgressFillProps {
  value: number // 0-100
}

export function ProgressFill({ value }: ProgressFillProps) {
  const progress = Math.max(0, Math.min(100, value))
  return (
    <div
      className="progress-track"
      role="progressbar"
      aria-valuenow={progress}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label="진행률"
    >
      <div className="progress-fill" style={{ width: `${progress}%` }} />
    </div>
  )
}
