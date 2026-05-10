'use client'
import { useParams } from 'next/navigation'
import { Clock, CheckCircle, AlertTriangle } from 'lucide-react'
import { AppBar } from '@/components/ui/app-bar'
import { Pill } from '@/components/ui/pill'
import { StepTimeline } from '@/components/ui/step-timeline'
import { ProgressFill } from '@/components/ui/progress-fill'
import { Spinner } from '@/components/ui/spinner'
import { mockApplications } from '@/lib/mock-data'

export default function HistoryDetailPage() {
  const { id } = useParams<{ id: string }>()
  const app = mockApplications.find(a => a.id === id)

  if (!app) {
    return (
      <div className="flex flex-col flex-1 min-h-full">
        <AppBar title="발급 진행 중" />
        <div className="app-content flex-1 text-[12px] leading-relaxed text-sub">신청 내역을 찾을 수 없어요</div>
      </div>
    )
  }

  const stepProgress = (app.stage / app.totalStages) * 100
  const isError = app.stages.some(s => s.status === 'error')
  const isDone  = app.stages.every(s => s.status === 'done')
  const activeStage = app.stages.find(s => s.status === 'active')

  return (
    <div className="flex flex-col flex-1 min-h-full">
      <AppBar
        title="발급 진행 중"
        badges={<Pill variant="testnet" size="sm">Testnet</Pill>}
      />

      <main className="app-content flex-1 overflow-y-auto">
        <div className="flex flex-col items-center pt-4 pb-3 gap-2">
          {isDone ? (
            <>
              <div className="w-16 h-16 rounded-full bg-success-soft flex items-center justify-center">
                <CheckCircle size={36} className="text-success" strokeWidth={2} />
              </div>
              <div className="text-[17px] font-bold text-ink text-center">서명을 모두 완료했어요</div>
              <div className="text-[12px] leading-relaxed text-sub text-center">{app.documentType}가<br />곧 도착해요</div>
            </>
          ) : isError ? (
            <>
              <div className="w-16 h-16 rounded-full bg-danger-soft flex items-center justify-center">
                <AlertTriangle size={32} className="text-danger" strokeWidth={2} />
              </div>
              <div className="text-[17px] font-bold text-ink text-center">잠시 멈췄어요</div>
              <div className="text-[12px] leading-relaxed text-sub text-center">기관 응답이 없어요. 다시 시도할 수 있어요.</div>
            </>
          ) : (
            <>
              <div className="w-16 h-16 rounded-full bg-primary-soft flex items-center justify-center">
                <Spinner size="lg" tone="primary" />
              </div>
              <div className="text-[17px] font-bold text-ink text-center">{activeStage?.label ?? '진행 중이에요'}</div>
              <div className="text-[12px] leading-relaxed text-sub text-center">단계 {app.stage}/{app.totalStages}을 처리 중이에요</div>
            </>
          )}
        </div>

        <div className="card mb-3">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[15px] font-bold text-ink">진행 단계</span>
            <span className={`text-[12px] font-bold ${isDone ? 'text-success' : isError ? 'text-danger' : 'text-primary'}`}>
              {isDone ? `${app.totalStages}/${app.totalStages} 완료` : `${app.stage}/${app.totalStages} ${isError ? '오류' : '진행'}`}
            </span>
          </div>
          <div className="mt-2 mb-2">
            <StepTimeline stages={app.stages} />
          </div>
          {!isDone && !isError && (
            <>
              <ProgressFill value={stepProgress} />
              <div className="text-[12px] text-muted mt-1 text-right">{activeStage?.label} 처리 중이에요</div>
            </>
          )}
          <div className="mt-2 text-[10px] text-muted">신청일 {app.createdAt}</div>
        </div>

        {!isDone && !isError && (
          <div className="text-[12px] text-muted text-center">
            <Clock size={14} className="inline-block mr-1 align-middle" strokeWidth={2} />
            다음 단계가 완료되면 알려드릴게요
          </div>
        )}
      </main>
    </div>
  )
}
