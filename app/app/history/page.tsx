'use client'
import { useRouter } from 'next/navigation'
import { AppBar } from '@/components/ui/app-bar'
import { Card } from '@/components/ui/card'
import { ProgressFill } from '@/components/ui/progress-fill'
import { EmptyState } from '@/components/ui/empty-state'
import { PageHeader } from '@/components/ui/page-header'
import { mockApplications } from '@/lib/mock-data'
import { Clock, ChevronRight } from 'lucide-react'

export default function HistoryPage() {
  const router = useRouter()

  return (
    <div className="flex flex-col h-full bg-canvas">
      <AppBar title="발급 내역" />
      <PageHeader title="진행 중인 문서" subtitle="신청하신 서류의 발급 상황을 확인하세요" />

      <main className="flex-1 overflow-y-auto px-5 pb-6 space-y-4">
        {mockApplications.length === 0 ? (
          <EmptyState
            icon={Clock}
            title="진행 중인 발급이 없어요"
            description="새로운 문서를 신청해 보세요"
            ctaLabel="발급 신청하기"
            onCta={() => router.push('/issue/select')}
          />
        ) : (
          mockApplications.map(app => (
            <Card key={app.id} clickable onClick={() => router.push(`/history/${app.id}`)}>
              <div className="flex justify-between items-start mb-4">
                <div>
                  <span className="block text-base font-bold text-ink tracking-[-0.01em] leading-snug">
                    {app.documentType}
                  </span>
                  <p className="text-sm font-semibold text-primary mt-1">
                    {app.stageName}
                  </p>
                </div>
                <ChevronRight size={20} className="text-ink-muted mt-1" />
              </div>

              <div className="mt-4">
                <ProgressFill value={(app.stage / app.totalStages) * 100} />
                <div className="flex justify-between items-center mt-2.5">
                  <p className="text-xs font-medium text-ink-secondary">
                    {app.stage === app.totalStages ? '완료됨' : '진행 중'}
                  </p>
                  <p className="text-xs font-medium text-ink-muted">
                    {app.stage}/{app.totalStages} 단계
                  </p>
                </div>
              </div>
            </Card>
          ))
        )}
      </main>
    </div>
  )
}
