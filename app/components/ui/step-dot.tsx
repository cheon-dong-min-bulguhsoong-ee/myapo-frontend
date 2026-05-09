type StepStatus = 'done' | 'active' | 'wait' | 'error'

interface StepDotProps {
  status: StepStatus
  label?: string
  isLast?: boolean
}

export function StepDot({ status, label, isLast }: StepDotProps) {
  const dotColors: Record<StepStatus, string> = {
    done: 'bg-success',
    active: 'bg-primary',
    wait: 'bg-hairline border-2 border-ink-muted',
    error: 'bg-danger',
  }

  return (
    <div className="flex gap-3 items-start">
      <div className="flex flex-col items-center">
        <div className="relative w-6 h-6 flex items-center justify-center">
          {status === 'active' && (
            <div className="absolute inset-0 rounded-full bg-primary/30 animate-pulse-ring" />
          )}
          <div className={`w-5 h-5 rounded-full ${dotColors[status]}`} />
        </div>
        {!isLast && <div className="w-0.5 h-8 bg-hairline mt-1" />}
      </div>
      {label && (
        <span className={`pt-0.5 text-sm ${status === 'active' ? 'font-semibold text-ink' : status === 'done' ? 'text-ink-secondary' : 'text-ink-muted'}`}>
          {label}
        </span>
      )}
    </div>
  )
}
