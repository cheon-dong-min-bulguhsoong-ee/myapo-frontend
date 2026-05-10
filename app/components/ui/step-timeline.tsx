'use client'
import { Check, Clock, X } from 'lucide-react'
import { StepDot, type StepStatus } from './step-dot'

interface Stage {
  label: string
  status: StepStatus
}

interface StepTimelineProps {
  stages: Stage[]
}

const labelTone: Record<StepStatus, string> = {
  done:   'text-success',
  active: 'text-primary',
  wait:   'text-muted',
  error:  'text-danger',
}

const labelWeight: Record<StepStatus, string> = {
  done:   'font-bold',
  active: 'font-bold',
  wait:   'font-medium',
  error:  'font-bold',
}

function dotInner(status: StepStatus) {
  if (status === 'done')  return <Check size={12} strokeWidth={3} />
  if (status === 'active')return <Clock size={12} strokeWidth={3} />
  if (status === 'error') return <X size={12} strokeWidth={3} />
  return null
}

/**
 * Horizontal step indicator matching A-02 progress card.
 * Dots flow left-to-right with connector lines between them; labels render
 * below in a `grid-cols-N` row.
 */
export function StepTimeline({ stages }: StepTimelineProps) {
  return (
    <div className="w-full">
      <div className="flex items-center gap-0 mb-3">
        {stages.map((s, i) => (
          <div key={i} className="flex items-center" style={{ flex: i === stages.length - 1 ? '0 0 auto' : '1 1 auto' }}>
            <StepDot status={s.status}>{dotInner(s.status)}</StepDot>
            {i < stages.length - 1 && (
              <div className={s.status === 'done' ? 'step-line step-line-done' : 'step-line'} />
            )}
          </div>
        ))}
      </div>
      <div
        className="grid text-center"
        style={{ gridTemplateColumns: `repeat(${stages.length}, minmax(0, 1fr))` }}
      >
        {stages.map((s, i) => (
          <div key={i} className={`text-[10px] ${labelWeight[s.status]} ${labelTone[s.status]}`}>
            {s.label}
          </div>
        ))}
      </div>
    </div>
  )
}
