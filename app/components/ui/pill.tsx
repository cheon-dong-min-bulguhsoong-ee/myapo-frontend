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

const variantClass: Record<PillVariant, string> = {
  success:  'badge-success',
  warning:  'badge-warning',
  danger:   'badge-danger',
  info:     'badge-info',
  neutral:  'badge-neutral',
  testnet:  'badge-testnet',
  mock:     'badge-mock',
  precheck: 'badge-precheck',
  revoked:  'badge-revoked',
}

export function Pill({ variant = 'neutral', size = 'md', children }: PillProps) {
  return (
    <span className={`vpill ${size === 'sm' ? 'sm' : ''} ${variantClass[variant]}`.trim()}>
      {children}
    </span>
  )
}
