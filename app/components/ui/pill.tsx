'use client'
import type { ReactNode } from 'react'

type SemanticVariant = 'success' | 'warning' | 'danger' | 'info' | 'neutral'
type StatusVariant = 'testnet' | 'mock' | 'precheck' | 'revoked'
export type PillVariant = SemanticVariant | StatusVariant

interface PillProps {
  variant?: PillVariant
  size?: 'sm' | 'md'
  children: ReactNode
}

const classMap: Record<PillVariant, string> = {
  success: 'green',
  warning: 'yellow',
  danger: 'red',
  info: '',
  neutral: 'gray',
  testnet: 'testnet',
  mock: 'mock',
  precheck: 'precheck',
  revoked: 'revoked',
}

export function Pill({ variant = 'neutral', size = 'sm', children }: PillProps) {
  return (
    <span className={`chip ${size === 'sm' ? 'sm' : ''} ${classMap[variant]}`.trim()}>
      {children}
    </span>
  )
}
