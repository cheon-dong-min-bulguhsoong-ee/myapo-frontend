'use client'
import { useRouter } from 'next/navigation'
import { AppBar } from '@/components/ui/app-bar'
import { Card } from '@/components/ui/card'
import { Pill } from '@/components/ui/pill'
import { Button } from '@/components/ui/button'
import { EmptyState } from '@/components/ui/empty-state'
import { mockDisputes } from '@/lib/mock-data'
import { AlertCircle, ChevronRight } from 'lucide-react'

const statusMap = {
  received: { label: '접수됨', variant: 'warning' as const },
  reviewing: { label: '검토중', variant: 'info' as const },
  closed: { label: '처리완료', variant: 'success' as const },
}

export default function DisputesPage() {
  const router = useRouter()

  return (
    <div className="flex flex-col min-h-dvh" style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}>
      <AppBar title="이의 신청" />
      <main className="flex-1 px-5 py-3 space-y-3">
        {mockDisputes.length === 0 ? (
          <EmptyState icon={AlertCircle} title="이의 신청 내역이 없어요" />
        ) : (
          mockDisputes.map(d => (
            <Card key={d.id} clickable onClick={() => router.push(`/disputes/${d.id}`)}>
              <div className="flex justify-between items-start">
                <div className="space-y-1.5">
                  <span className="font-bold text-ink">{d.documentType}</span>
                  <div className="flex gap-2 items-center">
                    <Pill variant={statusMap[d.status].variant}>{statusMap[d.status].label}</Pill>
                    <span className="text-xs text-ink-muted">{d.stage} 단계</span>
                  </div>
                  <p className="text-xs text-ink-muted">{d.createdAt}</p>
                </div>
                <ChevronRight size={18} className="text-ink-muted" />
              </div>
            </Card>
          ))
        )}
      </main>
      <div className="px-5 pb-6">
        <Button fullWidth variant="danger" onClick={() => router.push('/disputes/new')}>이의 신청하기</Button>
      </div>
    </div>
  )
}
