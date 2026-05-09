'use client'
import { useParams } from 'next/navigation'
import { AppBar } from '@/components/ui/app-bar'
import { StepDot } from '@/components/ui/step-dot'
import { mockApplications } from '@/lib/mock-data'

export default function HistoryDetailPage() {
  const { id } = useParams<{ id: string }>()
  const app = mockApplications.find(a => a.id === id)

  if (!app) return <div className="p-5 text-ink-secondary">신청 내역을 찾을 수 없어요</div>

  return (
    <div className="flex flex-col min-h-dvh" style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}>
      <AppBar title={app.documentType} />
      <main className="px-5 py-6 space-y-6">
        <div className="bg-paper rounded-2xl border border-hairline p-4" style={{ boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
          <p className="text-xs text-ink-muted mb-1">현재 단계</p>
          <p className="font-bold text-ink text-base">{app.stageName}</p>
          <p className="text-xs text-ink-secondary mt-1">신청일 {app.createdAt}</p>
        </div>
        <div className="bg-paper rounded-2xl border border-hairline p-5" style={{ boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
          <h3 className="font-bold text-sm text-ink mb-4">진행 현황</h3>
          <div className="space-y-0">
            {app.stages.map((stage, i) => (
              <StepDot key={i} status={stage.status} label={stage.label} isLast={i === app.stages.length - 1} />
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}
