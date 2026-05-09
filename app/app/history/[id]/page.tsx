'use client'
import { useParams } from 'next/navigation'
import { AppBar } from '@/components/ui/app-bar'
import { Card } from '@/components/ui/card'
import { StepDot } from '@/components/ui/step-dot'
import { mockApplications } from '@/lib/mock-data'

export default function HistoryDetailPage() {
  const { id } = useParams<{ id: string }>()
  const app = mockApplications.find(a => a.id === id)

  if (!app) return <div className="p-5 text-ink-secondary">신청 내역을 찾을 수 없어요</div>

  return (
    <div className="flex flex-col h-full bg-canvas">
      <AppBar title={app.documentType} />

      <main className="flex-1 overflow-y-auto px-5 py-6 space-y-4">
        <Card>
          <p className="text-xs text-ink-muted mb-1">현재 단계</p>
          <p className="font-bold text-ink text-base">{app.stageName}</p>
          <p className="text-xs text-ink-secondary mt-1">신청일 {app.createdAt}</p>
        </Card>

        <Card>
          <h3 className="font-bold text-sm text-ink mb-4">진행 현황</h3>
          {app.stages.map((stage, i) => (
            <StepDot key={i} status={stage.status} label={stage.label} isLast={i === app.stages.length - 1} />
          ))}
        </Card>
      </main>
    </div>
  )
}
