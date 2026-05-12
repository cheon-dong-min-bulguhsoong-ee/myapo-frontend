'use client'
import { useEffect, useMemo, useRef, useState, useSyncExternalStore } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Clock, CheckCircle, AlertTriangle, Bell, FileSignature, Loader2 } from 'lucide-react'
import { AppBar } from '@/components/ui/app-bar'
import { Pill } from '@/components/ui/pill'
import { StepTimeline } from '@/components/ui/step-timeline'
import { ProgressFill } from '@/components/ui/progress-fill'
import { Spinner } from '@/components/ui/spinner'
import { PageFooter } from '@/components/ui/page-footer'
import { useAuth } from '@/contexts/auth-context'
import {
  acceptTestnetCredential,
  advanceDocumentMvp,
  createCredentialIssueRequest,
  getDocumentMvp,
  listCredentials,
  mapDocumentStageToCredentialStage,
  prepareAcceptTestnetCredential,
  type DocumentMvpDetailRes,
  type DocumentMvpStepStatus,
} from '@/lib/myapo-api'
import { signXrplTransactionBlob } from '@/lib/xrpl-signing'
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

type SigningState = 'idle' | 'signing' | 'refreshing'

function subscribeToHydrationStore() {
  return () => {}
}

function getHydratedSnapshot() {
  return true
}

function getServerSnapshot() {
  return false
}

function HistoryLoadingShell() {
  return (
    <div className="flex flex-col flex-1 min-h-full">
      <AppBar title="발급 진행 중" badges={<Pill variant="testnet" size="sm">Testnet</Pill>} />
      <main className="app-content flex-1 overflow-y-auto">
        <div className="card flex items-center justify-center gap-2 p-4 text-[13px] leading-relaxed text-sub">
          <Spinner size="sm" tone="primary" />
          발급 현황을 불러오고 있어요
        </div>
      </main>
    </div>
  )
}

function getErrorMessage(error: unknown) {
  return error instanceof Error ? error.message : '발급 상세를 불러오지 못했어요. 잠시 후 다시 시도해 주세요'
}

function getRecoverableCredentialAcceptSignal(error: unknown) {
  const message = error instanceof Error ? error.message : ''
  const text = message.toLowerCase()
  if (text.includes('tecduplicate') || text.includes('duplicate')) return '이미 서명된 크리덴셜이에요. 다음 단계로 넘어갈게요'
  if (text.includes('tecno_entry') || text.includes('no_entry')) return '이전 서명 상태가 이미 바뀌었어요. 발급 단계를 새로 확인할게요'
  return null
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
  const router = useRouter()
  const { accessToken, isReady, wallet } = useAuth()
  const hasHydrated = useSyncExternalStore(subscribeToHydrationStore, getHydratedSnapshot, getServerSnapshot)
  const [detailState, setDetailState] = useState<DetailLoadState>({
    documentCode: '',
    detail: null,
    errorMessage: null,
  })
  const [signingState, setSigningState] = useState<SigningState>('idle')
  const [signingMessage, setSigningMessage] = useState<string | null>(null)
  const [signingError, setSigningError] = useState<string | null>(null)
  const refreshTimerRef = useRef<number | null>(null)
  const app = mockApplications.find(a => a.id === id)

  function clearScheduledRefresh() {
    if (refreshTimerRef.current === null) return
    window.clearTimeout(refreshTimerRef.current)
    refreshTimerRef.current = null
  }

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

  useEffect(() => clearScheduledRefresh, [])

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

  async function refreshDetail() {
    if (!accessToken) return null
    const nextDetail = await getDocumentMvp(accessToken, id)
    setDetailState({ documentCode: id, detail: nextDetail, errorMessage: null })
    return nextDetail
  }

  function finishRefresh(nextDetail: DocumentMvpDetailRes | null) {
    setSigningState('idle')
    setSigningMessage(
      nextDetail?.uiSteps.some(step => step.status === 'PENDING') && !nextDetail.isSuccess && nextDetail.status !== 'VALID'
        ? '다음 단계 서명이 준비됐어요'
        : '서명이 완료됐어요',
    )
  }

  function scheduleDetailRefresh() {
    clearScheduledRefresh()
    setSigningState('refreshing')
    setSigningError(null)
    setSigningMessage('서명에 성공했어요. 다음 단계 알림을 기다리고 있어요')
    refreshTimerRef.current = window.setTimeout(() => {
      refreshTimerRef.current = null
      void refreshDetail()
        .then(finishRefresh)
        .catch(error => {
          console.error('Failed to refresh document MVP detail:', error)
          setSigningState('idle')
          setSigningError(getErrorMessage(error))
          setSigningMessage(null)
        })
    }, 3000)
  }

  async function signPendingStep() {
    if (!detail || !accessToken) return
    if (!wallet.privateKey) {
      setSigningError('지갑 키를 불러오지 못했어요. 다시 로그인한 뒤 사인해 주세요')
      return
    }

    setSigningState('signing')
    setSigningError(null)
    setSigningMessage('서명할 크리덴셜을 찾고 있어요')

    try {
      const credentials = await listCredentials(accessToken)
      const currentStage = mapDocumentStageToCredentialStage(detail.currentStage)
      const existingCredential = credentials.credentials.find(credential => (
        credential.documentCode === detail.documentCode && credential.currentStage === currentStage
      ))
      const credentialId = existingCredential?.credentialId
        ?? (await createCredentialIssueRequest(accessToken, {
          documentTypeId: detail.documentTypeCode,
          documentCode: detail.documentCode,
          currentStage,
        })).credentialId

      if (!credentialId) {
        throw new Error('서명할 크리덴셜 ID를 찾지 못했어요. 잠시 후 다시 시도해 주세요')
      }

      setSigningMessage('XRPL 서명 요청을 준비하고 있어요')
      const prepared = await prepareAcceptTestnetCredential(accessToken, credentialId)
      const signedTransactionBlob = await signXrplTransactionBlob(wallet.privateKey, prepared.transaction, prepared.network)

      setSigningMessage('서명한 트랜잭션을 제출하고 있어요')
      try {
        await acceptTestnetCredential(accessToken, credentialId, signedTransactionBlob)
      } catch (error) {
        const recoverableSignal = getRecoverableCredentialAcceptSignal(error)
        if (!recoverableSignal) throw error
        setSigningMessage(recoverableSignal)
      }

      setSigningMessage('다음 발급 단계로 이동하고 있어요')
      await advanceDocumentMvp(accessToken, detail.documentCode)
      scheduleDetailRefresh()
    } catch (error) {
      console.error('Failed to sign pending credential:', error)
      setSigningState('idle')
      setSigningError(getErrorMessage(error))
      setSigningMessage(null)
    }
  }

  if (!hasHydrated || (!isLegacyMockId(id) && isLoading)) {
    return <HistoryLoadingShell />
  }

  if (!isLegacyMockId(id) && errorMessage) {
    return (
      <div className="relative flex flex-col flex-1 min-h-full overflow-hidden">
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
    const pendingStep = detail.uiSteps.find(step => step.status === 'PENDING')
    const isWaitingNextStep = signingState === 'refreshing'
    const shouldShowSigningCta = Boolean(pendingStep && !isDone && !isError && !isWaitingNextStep)
    const isSigning = signingState === 'signing' || signingState === 'refreshing'

    return (
      <div className="relative flex flex-col flex-1 min-h-full overflow-hidden">
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

          {shouldShowSigningCta && (
            <div className="card mb-3" style={{ border: '1px solid #3182F6', background: '#E8F2FE' }}>
              <div className="flex items-start gap-2">
                <Bell size={16} className="text-primary mt-0.5 flex-shrink-0" strokeWidth={2.4} />
                <div className="flex-1 min-w-0">
                  <div className="text-[13px] font-bold text-ink">{pendingStep?.label} 단계 서명이 필요해요</div>
                  <div className="text-[11px] text-sub mt-0.5">다음 발급 단계로 보내려면 지갑 승인이 필요해요</div>
                  <div className="text-[10px] text-muted mt-1">Testnet · XRPL CredentialAccept</div>
                </div>
              </div>
            </div>
          )}

          {isWaitingNextStep && !isDone && !isError && (
            <div className="card mb-3" style={{ border: '1px solid #00A661', background: '#E6F8EE' }}>
              <div className="flex items-start gap-2">
                <CheckCircle size={16} className="text-success mt-0.5 flex-shrink-0" strokeWidth={2.4} />
                <div className="flex-1 min-w-0">
                  <div className="text-[13px] font-bold text-ink">서명에 성공했어요</div>
                  <div className="text-[11px] text-sub mt-0.5">3초 뒤 다음 서명 알림을 확인할게요</div>
                  <div className="text-[10px] text-muted mt-1">Testnet · 다음 단계 확인 중</div>
                </div>
              </div>
            </div>
          )}

          {!shouldShowSigningCta && !isDone && !isError && (
            <div className="text-[12px] text-muted text-center">
              <Clock size={14} className="inline-block mr-1 align-middle" strokeWidth={2} />
              다음 단계가 완료되면 알려드릴게요
            </div>
          )}
        </main>

        {isDone && (
          <PageFooter>
            <button
              type="button"
              onClick={() => router.push(`/documents/${encodeURIComponent(detail.documentCode)}`)}
              className="btn-primary"
            >
              발급 문서 보기
            </button>
          </PageFooter>
        )}

        {shouldShowSigningCta && (
          <div className="bottom-sheet-overlay">
            <div className="bottom-sheet">
              <div className="bottom-sheet-handle" />
              <div className="flex items-center gap-2 mb-1">
                <div className="w-8 h-8 rounded-full bg-primary-soft flex items-center justify-center text-primary">
                  {isSigning ? <Loader2 size={17} className="animate-spin" strokeWidth={2.4} /> : <FileSignature size={18} strokeWidth={2.4} />}
                </div>
                <div className="text-[17px] font-bold text-ink">서명이 필요해요</div>
              </div>
              <div className="text-[13px] text-sub mb-3">
                {pendingStep?.label} 단계가 준비됐어요. 다음 단계로 보낼까요?
              </div>
              <div className="card mb-3" style={{ background: '#F9FAFB' }}>
                <div className="flex justify-between gap-3 py-1 border-b border-border">
                  <span className="text-[12px] text-muted">서류명</span>
                  <span className="text-[12px] font-bold text-ink text-right">{detail.documentTypeName}</span>
                </div>
                <div className="flex justify-between gap-3 py-1 border-b border-border">
                  <span className="text-[12px] text-muted">발급기관</span>
                  <span className="text-[12px] font-bold text-ink text-right">{detail.issuerCountryCode}-{detail.issuerIconLabel}</span>
                </div>
                <div className="flex justify-between gap-3 py-1">
                  <span className="text-[12px] text-muted">단계</span>
                  <span className="text-[12px] font-bold text-ink text-right">{pendingStep?.step}/{detail.uiSteps.length} · {pendingStep?.label}</span>
                </div>
              </div>
              <div className={`text-[11px] mb-3 ${signingError ? 'text-danger' : 'text-muted'}`}>
                {signingError ?? signingMessage ?? 'Testnet · Pre-Check Only · XRPL Credential'}
              </div>
              <button
                type="button"
                onClick={() => void signPendingStep()}
                disabled={isSigning || !accessToken}
                className="btn-primary mb-2"
                style={{ height: 52, fontSize: 16 }}
              >
                {isSigning ? '서명 처리 중...' : '사인하기'}
              </button>
              <button
                type="button"
                disabled={isSigning}
                className="btn-secondary"
                style={{ height: 40, fontSize: 14 }}
              >
                나중에 할게요
              </button>
            </div>
          </div>
        )}
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
