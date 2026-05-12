'use client'
import { useEffect, useMemo, useState } from 'react'
import { useParams } from 'next/navigation'
import { Clock, CheckCircle, AlertTriangle } from 'lucide-react'
import { AppBar } from '@/components/ui/app-bar'
import { Pill } from '@/components/ui/pill'
import { StepTimeline } from '@/components/ui/step-timeline'
import { ProgressFill } from '@/components/ui/progress-fill'
import { Spinner } from '@/components/ui/spinner'
import { useAuth } from '@/contexts/auth-context'
import { getDocumentMvp, type DocumentMvpDetailRes, type DocumentMvpStepStatus } from '@/lib/myapo-api'
import { mockApplications } from '@/lib/mock-data'

type TimelineStatus = 'done' | 'active' | 'wait' | 'error'

interface TimelineStage {
  label: string
  status: TimelineStatus
}

interface DetailLoadState {
  documentCode: string
  detail: DocumentMvpDetailRes | null
  errorMessage: string | null
}

function getErrorMessage(error: unknown) {
  return error instanceof Error ? error.message : '발급 상세를 불러오지 못했어요. 잠시 후 다시 시도해 주세요'
}

function toTimelineStatus(status: DocumentMvpStepStatus): TimelineStatus {
  if (status === 'DONE') return 'done'
  if (status === 'PENDING') return 'active'
  if (status === 'FAILED') return 'error'
  return 'wait'
}

function formatDate(value: string | null) {
  if (!value) return '-'
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value
  return date.toLocaleDateString('ko-KR', { year: 'numeric', month: '2-digit', day: '2-digit' })
}

function isLegacyMockId(id: string) {
  return id.startsWith('app-')
}

export default function HistoryDetailPage() {
  const { id } = useParams<{ id: string }>()
  const { accessToken, isReady } = useAuth()
  const [detailState, setDetailState] = useState<DetailLoadState>({
    documentCode: '',
    detail: null,
    errorMessage: null,
  })
  const app = mockApplications.find(a => a.id === id)

  useEffect(() => {
    if (isLegacyMockId(id)) return
    if (!accessToken) return

    let ignore = false

    getDocumentMvp(accessToken, id)
      .then(data => {
        if (ignore) return
        setDetailState({ documentCode: id, detail: data, errorMessage: null })
      })
      .catch(error => {
        console.error('Failed to load document MVP detail:', error)
        if (!ignore) {
          setDetailState({ documentCode: id, detail: null, errorMessage: getErrorMessage(error) })
        }
      })

    return () => {
      ignore = true
    }
  }, [accessToken, id])

  const detail = detailState.documentCode === id ? detailState.detail : null
  const apiErrorMessage = detailState.documentCode === id ? detailState.errorMessage : null
  const authErrorMessage = !isLegacyMockId(id) && isReady && !accessToken
    ? '로그인 후 발급 상세를 확인할 수 있어요'
    : null
  const errorMessage = authErrorMessage ?? apiErrorMessage
  const isLoading = !isLegacyMockId(id) && !detail && !errorMessage

  const apiStages = useMemo<TimelineStage[]>(
    () => detail?.uiSteps.map(step => ({ label: step.label, status: toTimelineStatus(step.status) })) ?? [],
    [detail],
  )

  if (!isLegacyMockId(id) && isLoading) {
    return (
      <div className="flex flex-col flex-1 min-h-full">
        <AppBar title="발급 진행 중" badges={<Pill variant="testnet" size="sm">Testnet</Pill>} />
        <main className="app-content flex-1 flex flex-col items-center justify-center gap-3 text-center">
          <div className="w-16 h-16 rounded-full bg-primary-soft flex items-center justify-center">
            <Spinner size="lg" tone="primary" />
          </div>
          <div className="text-[15px] font-bold text-ink">발급 현황을 불러오고 있어요</div>
        </main>
      </div>
    )
  }

  if (!isLegacyMockId(id) && errorMessage) {
    return (
      <div className="flex flex-col flex-1 min-h-full">
        <AppBar title="발급 진행 중" badges={<Pill variant="testnet" size="sm">Testnet</Pill>} />
        <main className="app-content flex-1 text-[12px] leading-relaxed text-sub">
          <div className="card text-danger">{errorMessage}</div>
        </main>
      </div>
    )
  }

  if (detail) {
    const doneSteps = apiStages.filter(stage => stage.status === 'done').length
    const activeStage = apiStages.find(stage => stage.status === 'active')
    const isError = apiStages.some(stage => stage.status === 'error') || detail.status === 'FAILED'
    const isDone = detail.isSuccess || detail.status === 'VALID'
    const progress = apiStages.length ? (doneSteps / apiStages.length) * 100 : 0

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
                <div className="text-[17px] font-bold text-ink text-center">발급이 완료됐어요</div>
                <div className="text-[12px] leading-relaxed text-sub text-center">{detail.documentTypeName}가<br />지갑에 도착했어요</div>
              </>
            ) : isError ? (
              <>
                <div className="w-16 h-16 rounded-full bg-danger-soft flex items-center justify-center">
                  <AlertTriangle size={32} className="text-danger" strokeWidth={2} />
                </div>
                <div className="text-[17px] font-bold text-ink text-center">잠시 멈췄어요</div>
                <div className="text-[12px] leading-relaxed text-sub text-center">{detail.statusLabel}</div>
              </>
            ) : (
              <>
                <div className="w-16 h-16 rounded-full bg-primary-soft flex items-center justify-center">
                  <Spinner size="lg" tone="primary" />
                </div>
                <div className="text-[17px] font-bold text-ink text-center">{activeStage?.label ?? detail.currentStageLabel}</div>
                <div className="text-[12px] leading-relaxed text-sub text-center">{detail.statusLabel}</div>
              </>
            )}
          </div>

          <div className="card mb-3">
            <div className="flex items-start justify-between gap-3 mb-2">
              <div>
                <div className="text-[15px] font-bold text-ink">{detail.documentTypeName}</div>
                <div className="text-[12px] font-medium text-sub mt-0.5">{detail.issuerName} · {detail.issuerCountryCode}-{detail.issuerIconLabel}</div>
              </div>
              <span className={`text-[12px] font-bold ${isDone ? 'text-success' : isError ? 'text-danger' : 'text-primary'}`}>
                {detail.statusLabel}
              </span>
            </div>
            <div className="mt-2 mb-2">
              <StepTimeline stages={apiStages} />
            </div>
            {!isDone && !isError && (
              <>
                <ProgressFill value={progress} />
                <div className="text-[12px] text-muted mt-1 text-right">{detail.currentStageLabel} 처리 중이에요</div>
              </>
            )}
            <div className="mt-2 text-[10px] text-muted">신청일 {formatDate(detail.requestedAt)}</div>
            <div className="mt-1 text-[10px] text-muted font-mono break-all">문서 ID {detail.documentCode}</div>
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
