'use client'
import { useRouter } from 'next/navigation'
import { AppBar } from '@/components/ui/app-bar'
import { Card } from '@/components/ui/card'
import { Pill } from '@/components/ui/pill'
import { Button } from '@/components/ui/button'
import { EmptyState } from '@/components/ui/empty-state'
import { PageHeader } from '@/components/ui/page-header'
import { PageFooter } from '@/components/ui/page-footer'
import { mockDisputes } from '@/lib/mock-data'
import { disputeStatusMap } from '@/lib/dispute-status'
import { AlertCircle, ChevronRight } from 'lucide-react'

export default function DisputesPage() {
  const router = useRouter()

  return (
    <div className="flex flex-col h-full bg-canvas">
      <AppBar title="이의 신청" />
      <PageHeader title="이의 신청 내역" subtitle="신고하신 건의 처리 상태를 확인하세요" />

      <main className="flex-1 overflow-y-auto px-5 pb-6 space-y-3">
        {mockDisputes.length === 0 ? (
          <EmptyState icon={AlertCircle} title="이의 신청 내역이 없어요" />
        ) : (
          mockDisputes.map(d => (
            <Card key={d.id} clickable onClick={() => router.push(`/disputes/${d.id}`)}>
              <div className="flex justify-between items-start">
                <div className="space-y-1.5">
                  <span className="font-bold text-ink">{d.documentType}</span>
                  <div className="flex gap-2 items-center">
                    <Pill variant={disputeStatusMap[d.status].variant}>{disputeStatusMap[d.status].label}</Pill>
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

      <PageFooter>
        <Button fullWidth variant="danger" onClick={() => router.push('/disputes/new')}>
          이의 신청하기
        </Button>
      </PageFooter>
    </div>
  )
}
