'use client'
import { useEffect, useMemo, useRef, useState, useSyncExternalStore } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Clock, CheckCircle, AlertTriangle, Bell, FileSignature, Loader2 } from 'lucide-react'
import { AppBar } from '@/components/ui/app-bar'
import { AppContent } from '@/components/ui/app-content'
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
type ToastTone = 'info' | 'success' | 'danger'

interface SigningToast {
  tone: ToastTone
  title: string
  message: string
}

const toastToneClass: Record<ToastTone, { surface: string; badge: string; progress: string }> = {
  info:    { surface: 'app-toast--info', badge: 'app-toast__badge--info', progress: 'app-toast__progress--info' },
  success: { surface: 'app-toast--success', badge: 'app-toast__badge--success', progress: 'app-toast__progress--success' },
  danger:  { surface: 'app-toast--danger', badge: 'app-toast__badge--danger', progress: 'app-toast__progress--danger' },
}

function ToastIcon({ tone }: { tone: ToastTone }) {
  if (tone === 'success') return <CheckCircle size={17} strokeWidth={2.5} />
  if (tone === 'danger') return <AlertTriangle size={17} strokeWidth={2.5} />
  return <Bell size={17} strokeWidth={2.5} />
}

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
      <AppContent>
        <div className="card flex items-center justify-center gap-2 p-4 text-sm leading-relaxed text-sub">
          <Spinner size="sm" tone="primary" />
          발급 현황을 불러오고 있어요
        </div>
      </AppContent>
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
  const [toast, setToast] = useState<SigningToast | null>(null)
  const refreshTimerRef = useRef<number | null>(null)
  const toastTimerRef = useRef<number | null>(null)
  const app = mockApplications.find(a => a.id === id)

  function clearScheduledRefresh() {
    if (refreshTimerRef.current === null) return
    window.clearTimeout(refreshTimerRef.current)
    refreshTimerRef.current = null
  }

  function clearToastTimer() {
    if (toastTimerRef.current === null) return
    window.clearTimeout(toastTimerRef.current)
    toastTimerRef.current = null
  }

  function showToast(nextToast: SigningToast) {
    clearToastTimer()
    setToast(nextToast)
    toastTimerRef.current = window.setTimeout(() => {
      toastTimerRef.current = null
      setToast(null)
    }, 3800)
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

  useEffect(() => () => {
    clearScheduledRefresh()
    clearToastTimer()
  }, [])

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
    const nextMessage = nextDetail?.uiSteps.some(step => step.status === 'PENDING') && !nextDetail.isSuccess && nextDetail.status !== 'VALID'
      ? '다음 단계 서명이 준비됐어요'
      : '서명이 완료됐어요'

    setSigningState('idle')
    setSigningMessage(nextMessage)
    showToast({ tone: 'success', title: nextMessage, message: '진행 내역을 새로 확인했어요' })
  }

  function scheduleDetailRefresh() {
    clearScheduledRefresh()
    setSigningState('refreshing')
    setSigningError(null)
    setSigningMessage('서명에 성공했어요. 다음 단계 알림을 기다리고 있어요')
    showToast({
      tone: 'success',
      title: '서명에 성공했어요',
      message: '다음 단계 알림을 기다리고 있어요',
    })
    refreshTimerRef.current = window.setTimeout(() => {
      refreshTimerRef.current = null
      void refreshDetail()
        .then(finishRefresh)
        .catch(error => {
          console.error('Failed to refresh document MVP detail:', error)
          const errorMessage = getErrorMessage(error)
          setSigningState('idle')
          setSigningError(errorMessage)
          setSigningMessage(null)
          showToast({ tone: 'danger', title: '발급 상태를 새로고침하지 못했어요', message: errorMessage })
        })
    }, 3000)
  }

  async function signPendingStep() {
    if (!detail || !accessToken) return
    if (!wallet.privateKey) {
      const errorMessage = '지갑 키를 불러오지 못했어요. 다시 로그인한 뒤 사인해 주세요'
      setSigningError(errorMessage)
      showToast({ tone: 'danger', title: '서명할 수 없어요', message: errorMessage })
      return
    }

    setSigningState('signing')
    setSigningError(null)
    setSigningMessage('서명할 크리덴셜을 찾고 있어요')
    showToast({
      tone: 'info',
      title: '서명 처리 중',
      message: '진행 내역 화면에서 처리 상태를 확인할게요',
    })

    try {
      const latestDetail = await getDocumentMvp(accessToken, detail.documentCode)
      setDetailState({ documentCode: latestDetail.documentCode, detail: latestDetail, errorMessage: null })
      const credentials = await listCredentials(accessToken)
      const credentialStage = mapDocumentStageToCredentialStage(latestDetail.currentStage)
      const existingCredential = credentials.credentials.find(credential => (
        credential.documentCode === latestDetail.documentCode && credential.currentStage === credentialStage
      ))
      const credentialId = existingCredential?.credentialId
        ?? (await createCredentialIssueRequest(accessToken, {
          documentTypeId: latestDetail.documentTypeCode,
          documentCode: latestDetail.documentCode,
          currentStage: latestDetail.currentStage,
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
        showToast({ tone: 'success', title: '서명 응답이 도착했어요', message: '다음 발급 단계로 이동할게요' })
      } catch (error) {
        const recoverableSignal = getRecoverableCredentialAcceptSignal(error)
        if (!recoverableSignal) throw error
        setSigningMessage(recoverableSignal)
        showToast({ tone: 'info', title: '서명 상태를 확인했어요', message: recoverableSignal })
      }

      setSigningMessage('다음 발급 단계로 이동하고 있어요')
      await advanceDocumentMvp(accessToken, detail.documentCode)
      scheduleDetailRefresh()
    } catch (error) {
      console.error('Failed to sign pending credential:', error)
      const errorMessage = getErrorMessage(error)
      setSigningState('idle')
      setSigningError(errorMessage)
      setSigningMessage(null)
      showToast({ tone: 'danger', title: '서명에 실패했어요', message: errorMessage })
    }
  }

  if (!hasHydrated || (!isLegacyMockId(id) && isLoading)) {
    return <HistoryLoadingShell />
  }

  if (!isLegacyMockId(id) && errorMessage) {
    return (
      <div className="relative flex flex-col flex-1 min-h-full overflow-hidden">
        <AppBar title="발급 진행 중" badges={<Pill variant="testnet" size="sm">Testnet</Pill>} />
        <AppContent scrollable={false} className="text-sm leading-relaxed text-sub">
          <div className="card text-danger">{errorMessage}</div>
        </AppContent>
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
    const shouldShowSigningSheet = shouldShowSigningCta && signingState === 'idle'
    const isSigning = signingState === 'signing' || signingState === 'refreshing'

    return (
      <div className="relative flex flex-col flex-1 min-h-full overflow-hidden">
        <AppBar
          title="발급 진행 중"
          badges={<Pill variant="testnet" size="sm">Testnet</Pill>}
        />

        <AppContent>
          <div className="flex flex-col items-center pt-4 pb-3 gap-2">
            {isDone ? (
              <>
                <div className="w-16 h-16 rounded-full bg-success-soft flex items-center justify-center">
                  <CheckCircle size={36} className="text-success" strokeWidth={2} />
                </div>
                <div className="text-center text-lg font-bold text-ink">발급이 완료됐어요</div>
                <div className="text-center text-sm leading-relaxed text-sub">{detail.documentTypeName}가<br />지갑에 도착했어요</div>
              </>
            ) : isError ? (
              <>
                <div className="w-16 h-16 rounded-full bg-danger-soft flex items-center justify-center">
                  <AlertTriangle size={32} className="text-danger" strokeWidth={2} />
                </div>
                <div className="text-center text-lg font-bold text-ink">잠시 멈췄어요</div>
                <div className="text-center text-sm leading-relaxed text-sub">{detail.statusLabel}</div>
              </>
            ) : (
              <>
                <div className="w-16 h-16 rounded-full bg-primary-soft flex items-center justify-center">
                  <Spinner size="lg" tone="primary" />
                </div>
                <div className="text-center text-lg font-bold text-ink">{activeStage?.label ?? detail.currentStageLabel}</div>
                <div className="text-center text-sm leading-relaxed text-sub">{detail.statusLabel}</div>
              </>
            )}
          </div>

          <div className="card mb-3">
            <div className="flex items-start justify-between gap-3 mb-2">
              <div>
                <div className="text-base font-bold text-ink">{detail.documentTypeName}</div>
                <div className="mt-1 text-xs font-medium text-sub">{detail.issuerName} · {detail.issuerCountryCode}-{detail.issuerIconLabel}</div>
              </div>
              <span className={`text-xs font-bold ${isDone ? 'text-success' : isError ? 'text-danger' : 'text-primary'}`}>
                {detail.statusLabel}
              </span>
            </div>
            <div className="mt-2 mb-2">
              <StepTimeline stages={apiStages} />
            </div>
            {!isDone && !isError && (
              <>
                <ProgressFill value={progress} />
                <div className="mt-1 text-right text-xs text-muted">{detail.currentStageLabel} 처리 중이에요</div>
              </>
            )}
            <div className="mt-2 text-xs text-muted">신청일 {formatDate(detail.requestedAt)}</div>
            <div className="mt-1 break-all font-mono text-xs text-muted">문서 ID {detail.documentCode}</div>
          </div>

          {shouldShowSigningCta && (
            <div className="card status-primary mb-3">
              <div className="flex items-start gap-2">
                <Bell size={16} className="text-primary mt-0.5 flex-shrink-0" strokeWidth={2.4} />
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-bold text-ink">{pendingStep?.label} 단계 서명이 필요해요</div>
                  <div className="mt-1 text-xs text-sub">다음 발급 단계로 보내려면 지갑 승인이 필요해요</div>
                  <div className="mt-1 text-xs text-muted">Testnet · XRPL CredentialAccept</div>
                </div>
              </div>
            </div>
          )}

          {isWaitingNextStep && !isDone && !isError && (
            <div className="card status-success mb-3">
              <div className="flex items-start gap-2">
                <CheckCircle size={16} className="text-success mt-0.5 flex-shrink-0" strokeWidth={2.4} />
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-bold text-ink">서명에 성공했어요</div>
                  <div className="mt-1 text-xs text-sub">3초 뒤 다음 서명 알림을 확인할게요</div>
                  <div className="mt-1 text-xs text-muted">Testnet · 다음 단계 확인 중</div>
                </div>
              </div>
            </div>
          )}

          {!shouldShowSigningCta && !isDone && !isError && (
            <div className="text-center text-xs text-muted">
              <Clock size={14} className="inline-block mr-1 align-middle" strokeWidth={2} />
              다음 단계가 완료되면 알려드릴게요
            </div>
          )}
        </AppContent>

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

        {toast && (
          <div
            key={`${toast.tone}-${toast.title}-${toast.message}`}
            role={toast.tone === 'danger' ? 'alert' : 'status'}
            aria-live={toast.tone === 'danger' ? 'assertive' : 'polite'}
            className={`app-toast absolute left-5 right-5 top-[calc(env(safe-area-inset-top,0px)+16px)] z-20 ${toastToneClass[toast.tone].surface}`}
          >
            <div className="app-toast__shine" />
            <div className="app-toast__body flex items-start gap-3">
              <span className={`app-toast__badge ${toastToneClass[toast.tone].badge}`}>
                <ToastIcon tone={toast.tone} />
              </span>
              <div className="min-w-0">
                <div className="app-toast__title">{toast.title}</div>
                <div className="app-toast__message">{toast.message}</div>
              </div>
            </div>
            <div className="app-toast__timer" aria-hidden="true">
              <div className={`app-toast__progress ${toastToneClass[toast.tone].progress}`} />
            </div>
          </div>
        )}

        {shouldShowSigningSheet && (
          <div className="bottom-sheet-overlay">
            <div className="bottom-sheet">
              <div className="bottom-sheet-handle" />
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 rounded-full bg-primary-soft flex items-center justify-center text-primary">
                  {isSigning ? <Loader2 size={17} className="animate-spin" strokeWidth={2.4} /> : <FileSignature size={18} strokeWidth={2.4} />}
                </div>
                <div className="text-lg font-bold text-ink">서명이 필요해요</div>
              </div>
              <div className="mb-4 text-sm leading-relaxed text-sub">
                {pendingStep?.label} 단계가 준비됐어요. 다음 단계로 보낼까요?
              </div>
              <div className="card surface-base mb-4">
                <div className="flex justify-between gap-5 py-3 border-b border-border">
                  <span className="text-xs text-muted">서류명</span>
                  <span className="text-right text-xs font-bold text-ink">{detail.documentTypeName}</span>
                </div>
                <div className="flex justify-between gap-5 py-3 border-b border-border">
                  <span className="text-xs text-muted">발급기관</span>
                  <span className="text-right text-xs font-bold text-ink">{detail.issuerCountryCode}-{detail.issuerIconLabel}</span>
                </div>
                <div className="flex justify-between gap-5 py-3">
                  <span className="text-xs text-muted">단계</span>
                  <span className="text-right text-xs font-bold text-ink">{pendingStep?.step}/{detail.uiSteps.length} · {pendingStep?.label}</span>
                </div>
              </div>
              <div className={`mb-4 text-xs ${signingError ? 'text-danger' : 'text-muted'}`}>
                {signingError ?? signingMessage ?? 'Testnet · Pre-Check Only · XRPL Credential'}
              </div>
              <button
                type="button"
                onClick={() => void signPendingStep()}
                disabled={isSigning || !accessToken}
                className="btn-primary mb-3"
              >
                {isSigning ? '서명 처리 중...' : '사인하기'}
              </button>
              <button
                type="button"
                disabled={isSigning}
                className="btn-secondary"
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
        <AppContent scrollable={false} className="text-sm leading-relaxed text-sub">신청 내역을 찾을 수 없어요</AppContent>
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

      <AppContent>
        <div className="flex flex-col items-center pt-4 pb-3 gap-2">
          {isDone ? (
            <>
              <div className="w-16 h-16 rounded-full bg-success-soft flex items-center justify-center">
                <CheckCircle size={36} className="text-success" strokeWidth={2} />
              </div>
              <div className="text-center text-lg font-bold text-ink">서명을 모두 완료했어요</div>
              <div className="text-center text-sm leading-relaxed text-sub">{app.documentType}가<br />곧 도착해요</div>
            </>
          ) : isError ? (
            <>
              <div className="w-16 h-16 rounded-full bg-danger-soft flex items-center justify-center">
                <AlertTriangle size={32} className="text-danger" strokeWidth={2} />
              </div>
              <div className="text-center text-lg font-bold text-ink">잠시 멈췄어요</div>
              <div className="text-center text-sm leading-relaxed text-sub">기관 응답이 없어요. 다시 시도할 수 있어요.</div>
            </>
          ) : (
            <>
              <div className="w-16 h-16 rounded-full bg-primary-soft flex items-center justify-center">
                <Spinner size="lg" tone="primary" />
              </div>
              <div className="text-center text-lg font-bold text-ink">{activeStage?.label ?? '진행 중이에요'}</div>
              <div className="text-center text-sm leading-relaxed text-sub">단계 {app.stage}/{app.totalStages}을 처리 중이에요</div>
            </>
          )}
        </div>

        <div className="card mb-3">
          <div className="flex items-center justify-between mb-1">
            <span className="text-base font-bold text-ink">진행 단계</span>
            <span className={`text-xs font-bold ${isDone ? 'text-success' : isError ? 'text-danger' : 'text-primary'}`}>
              {isDone ? `${app.totalStages}/${app.totalStages} 완료` : `${app.stage}/${app.totalStages} ${isError ? '오류' : '진행'}`}
            </span>
          </div>
          <div className="mt-2 mb-2">
            <StepTimeline stages={app.stages} />
          </div>
          {!isDone && !isError && (
            <>
              <ProgressFill value={stepProgress} />
              <div className="mt-1 text-right text-xs text-muted">{activeStage?.label} 처리 중이에요</div>
            </>
          )}
          <div className="mt-2 text-xs text-muted">신청일 {app.createdAt}</div>
        </div>

        {!isDone && !isError && (
          <div className="text-center text-xs text-muted">
            <Clock size={14} className="inline-block mr-1 align-middle" strokeWidth={2} />
            다음 단계가 완료되면 알려드릴게요
          </div>
        )}
      </AppContent>
    </div>
  )
}
