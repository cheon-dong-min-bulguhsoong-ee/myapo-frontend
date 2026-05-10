'use client'
import { useRouter } from 'next/navigation'
import { Clock, ChevronRight } from 'lucide-react'
import { AppBar } from '@/components/ui/app-bar'
import { Pill } from '@/components/ui/pill'
import { ProgressFill } from '@/components/ui/progress-fill'
import { EmptyState } from '@/components/ui/empty-state'
import { mockApplications } from '@/lib/mock-data'

export default function HistoryPage() {
  const router = useRouter()

  return (
    <div className="flex flex-col flex-1 min-h-full">
      <AppBar
        title="발급 내역"
        badges={<Pill variant="testnet" size="sm">Testnet</Pill>}
      />

      <main className="app-content flex-1 overflow-y-auto">
        <div className="text-[15px] font-bold text-ink mb-1">진행 중인 발급이에요</div>
        <div className="text-[12px] leading-relaxed text-sub mb-2">신청하신 서류의 발급 상황을 확인하세요</div>

        {mockApplications.length === 0 ? (
          <EmptyState
            icon={Clock}
            title="진행 중인 발급이 없어요"
            description="새로운 문서를 신청해 보세요"
            ctaLabel="발급 신청하기"
            onCta={() => router.push('/issue/select')}
          />
        ) : (
          mockApplications.map(app => {
            const progress = (app.stage / app.totalStages) * 100
            const isError = app.stages.some(s => s.status === 'error')
            return (
              <button
                key={app.id}
                onClick={() => router.push(`/history/${app.id}`)}
                className="card press w-full text-left mb-2"
              >
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <div className="text-[15px] font-bold text-ink">{app.documentType} (영문)</div>
                    <div className={`text-[12px] font-semibold mt-0.5 ${isError ? 'text-danger' : 'text-primary'}`}>
                      {app.stageName}
                    </div>
                  </div>
                  <ChevronRight size={16} className="text-muted mt-1" />
                </div>

                <ProgressFill value={progress} />
                <div className="flex justify-between items-center mt-2">
                  <span className="text-[12px] font-medium text-sub">
                    {app.stage === app.totalStages ? '완료됨' : isError ? '오류 발생' : '진행 중'}
                  </span>
                  <span className="font-mono text-[12px] font-medium text-muted">
                    {app.stage}/{app.totalStages} 단계
                  </span>
                </div>
                <div className="text-[10px] text-muted mt-1">신청일 {app.createdAt}</div>
              </button>
            )
          })
        )}
      </main>
    </div>
  )
}
