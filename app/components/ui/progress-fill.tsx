'use client'
import { ProgressBar } from '@toss/tds-mobile'

interface ProgressFillProps {
  value: number // 0-100
}

export function ProgressFill({ value }: ProgressFillProps) {
  return <ProgressBar progress={Math.max(0, Math.min(1, value / 100))} size="light" />
}
