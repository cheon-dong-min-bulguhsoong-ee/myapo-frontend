import type { ReactNode } from 'react'

export type StepStatus = 'done' | 'active' | 'wait' | 'error'

interface StepDotProps {
  status: StepStatus
  children?: ReactNode
}

export function StepDot({ status, children }: StepDotProps) {
  const cls = {
    done:   'step-dot step-dot-done',
    active: 'step-dot step-dot-active',
    wait:   'step-dot step-dot-wait',
    error:  'step-dot step-dot-error',
  }[status]
  return <div className={cls}>{children}</div>
}
