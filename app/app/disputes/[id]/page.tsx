'use client'
import { useParams } from 'next/navigation'
import { AppBar } from '@/components/ui/app-bar'
import { Card } from '@/components/ui/card'
import { Pill } from '@/components/ui/pill'
import { mockDisputes } from '@/lib/mock-data'

const statusMap = {
  received: { label: '접수됨', variant: 'warning' as const },
  reviewing: { label: '검토중', variant: 'info' as const },
  closed: { label: '처리완료', variant: 'success' as const },
}

export default function DisputeDetailPage() {
  const { id } = useParams<{ id: string }>()
  const d = mockDisputes.find(x => x.id === id)
  if (!d) return <div className="p-5 text-ink-secondary">이의 신청을 찾을 수 없어요</div>

  return (
    <div className="flex flex-col min-h-dvh" style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}>
      <AppBar title="이의 신청 상세" />
      <main className="px-5 py-4 space-y-4">
        <Card>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="font-bold text-ink">{d.documentType}</span>
              <Pill variant={statusMap[d.status].variant}>{statusMap[d.status].label}</Pill>
            </div>
            <p className="text-sm text-ink-secondary">발생 단계: {d.stage}</p>
            <p className="text-sm text-ink-secondary">사유: {d.reason}</p>
            <p className="text-xs text-ink-muted">신청일 {d.createdAt}</p>
          </div>
        </Card>
        {d.operatorResponse && (
          <Card>
            <p className="text-xs font-semibold text-ink-muted mb-2">담당자 답변</p>
            <p className="text-sm text-ink leading-relaxed">{d.operatorResponse}</p>
          </Card>
        )}
      </main>
    </div>
  )
}
