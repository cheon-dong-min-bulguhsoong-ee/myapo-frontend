import type { Dispute } from './mock-data'

type StatusVariant = 'success' | 'warning' | 'danger' | 'info' | 'neutral'

export const disputeStatusMap: Record<Dispute['status'], { label: string; variant: StatusVariant }> = {
  received: { label: '접수됨', variant: 'warning' },
  reviewing: { label: '검토중', variant: 'info' },
  closed: { label: '처리완료', variant: 'success' },
}
