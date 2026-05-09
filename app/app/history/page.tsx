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
    <div
      className="flex flex-col h-dvh bg-canvas"
      style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
    >
      <AppBar title="발급 내역" />

      <header className="shrink-0 px-5 pt-6 pb-4 bg-canvas">
        <h1 className="text-[22px] font-bold tracking-[-0.02em] text-ink leading-[1.3]">
          진행 중인 문서
        </h1>
        <p className="text-[15px] font-medium text-ink-secondary mt-2 leading-[1.4]">
          신청하신 서류의 발급 상황을 확인하세요.
        </p>
      </header>

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
                  <span className="block text-[17px] font-bold text-ink tracking-[-0.01em] leading-snug">
                    {app.documentType}
                  </span>
                  <p className="text-[14px] font-semibold text-primary mt-1">
                    {app.stageName}
                  </p>
                </div>
                <ChevronRight size={20} className="text-ink-muted mt-1" />
              </div>

              <div className="mt-4">
                <ProgressFill value={(app.stage / app.totalStages) * 100} />
                <div className="flex justify-between items-center mt-2.5">
                  <p className="text-[13px] font-medium text-ink-secondary">
                    {app.stage === app.totalStages ? '완료됨' : '진행 중'}
                  </p>
                  <p className="text-[13px] font-medium text-ink-muted">
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
