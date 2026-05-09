import { StepDot } from './step-dot'

interface Stage {
  label: string
  status: 'done' | 'active' | 'wait' | 'error'
}

export function StepTimeline({ stages }: { stages: Stage[] }) {
  return (
    <div>
      {stages.map((s, i) => (
        <StepDot key={i} status={s.status} label={s.label} isLast={i === stages.length - 1} />
      ))}
    </div>
  )
}
