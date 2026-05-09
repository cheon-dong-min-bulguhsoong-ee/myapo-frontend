'use client'

interface ProgressFillProps {
  value: number // 0-100
}

export function ProgressFill({ value }: ProgressFillProps) {
  const progress = Math.max(0, Math.min(100, value))

  return (
    <div className="h-1.5 w-full overflow-hidden rounded-full bg-hairline" role="progressbar" aria-valuenow={progress} aria-valuemin={0} aria-valuemax={100}>
      <div className="h-full rounded-full bg-primary transition-[width]" style={{ width: `${progress}%` }} />
    </div>
  )
}
