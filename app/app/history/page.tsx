'use client'
import { useRouter } from 'next/navigation'
import { AppBar } from '@/components/ui/app-bar'
import { Card } from '@/components/ui/card'
import { ProgressFill } from '@/components/ui/progress-fill'
import { EmptyState } from '@/components/ui/empty-state'
import { mockApplications } from '@/lib/mock-data'
import { Clock, ChevronRight } from 'lucide-react'

export default function HistoryPage() {
  const router = useRouter()

  return (
    <div className="flex flex-col min-h-full" style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}>
      <AppBar title="발급 현황" />
      <main className="flex-1 px-5 py-3 space-y-3">
        {mockApplications.length === 0 ? (
          <EmptyState icon={Clock} title="진행 중인 발급이 없어요" description="새로운 문서를 신청해 보세요" ctaLabel="발급 신청하기" onCta={() => router.push('/issue/select')} />
        ) : (
          mockApplications.map(app => (
            <Card key={app.id} clickable onClick={() => router.push(`/history/${app.id}`)}>
              <div className="flex justify-between items-start mb-3">
                <div>
                  <span className="font-bold text-ink">{app.documentType}</span>
                  <p className="text-sm text-ink-secondary mt-0.5">{app.stageName}</p>
                </div>
                <ChevronRight size={18} className="text-ink-muted" />
              </div>
              <ProgressFill value={(app.stage / app.totalStages) * 100} />
              <p className="text-xs text-ink-muted mt-1.5">{app.stage}/{app.totalStages} 단계</p>
            </Card>
          ))
        )}
      </main>
    </div>
  )
}
