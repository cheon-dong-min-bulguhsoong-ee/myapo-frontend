'use client'
import { useEffect, useMemo, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { Check, Clock, FileText, Download, Send, RefreshCw, AlertCircle, X } from 'lucide-react'
import { AppBar } from '@/components/ui/app-bar'
import { AppContent } from '@/components/ui/app-content'
import { Pill } from '@/components/ui/pill'
import { PageFooter } from '@/components/ui/page-footer'
import { Spinner } from '@/components/ui/spinner'
import { useAuth } from '@/contexts/auth-context'
import { getDocumentMvp, type DocumentMvpDetailRes, type DocumentMvpStepStatus, type DocumentMvpUiStepRes } from '@/lib/myapo-api'
import { mockDocuments } from '@/lib/mock-data'

interface DetailLoadState {
  documentCode: string
  detail: DocumentMvpDetailRes | null
  errorMessage: string | null
}

type StepTone = 'done' | 'active' | 'wait' | 'error'

interface DisplayStep {
  step: number
  label: string
  status: StepTone
  statusLabel: string
  startedAt: string | null
  completedAt: string | null
}

function formatDate(value: string | null) {
  if (!value) return '-'
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value
  return date.toLocaleDateString('ko-KR', { year: 'numeric', month: '2-digit', day: '2-digit' })
}

function getErrorMessage(error: unknown) {
  return error instanceof Error ? error.message : '문서 상세를 불러오지 못했어요. 잠시 후 다시 시도해 주세요'
}

function toStepTone(status: DocumentMvpStepStatus): StepTone {
  if (status === 'DONE') return 'done'
  if (status === 'PENDING') return 'active'
  if (status === 'FAILED') return 'error'
  return 'wait'
}

function toDisplayStep(step: DocumentMvpUiStepRes): DisplayStep {
  return {
    step: step.step,
    label: step.label,
    status: toStepTone(step.status),
    statusLabel: step.statusLabel ?? '대기',
    startedAt: step.startedAt,
    completedAt: step.completedAt,
  }
}

function formatDateTime(value: string | null) {
  if (!value) return '-'
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value
  return date.toLocaleString('ko-KR', {
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  })
}

function getStepBadgeVariant(status: StepTone): 'success' | 'info' | 'neutral' | 'danger' {
  if (status === 'done') return 'success'
  if (status === 'active') return 'info'
  if (status === 'error') return 'danger'
  return 'neutral'
}

function isLegacyMockId(id: string) {
  return id.startsWith('doc-')
}

export default function DocumentDetailPage() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()
  const { accessToken, isReady } = useAuth()
  const [detailState, setDetailState] = useState<DetailLoadState>({
    documentCode: '',
    detail: null,
    errorMessage: null,
  })
  const doc = mockDocuments.find(d => d.id === id)

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
    ? '로그인 후 문서 상세를 확인할 수 있어요'
    : null
  const errorMessage = authErrorMessage ?? apiErrorMessage
  const isLoading = !isLegacyMockId(id) && !detail && !errorMessage
  const displaySteps = useMemo(
    () => detail?.uiSteps.map(toDisplayStep) ?? [],
    [detail],
  )

  if (isLoading) {
    return (
      <div className="flex flex-col flex-1 min-h-full">
        <AppBar title="문서 상세" badges={<Pill variant="testnet" size="sm">Testnet</Pill>} />
        <AppContent scrollable={false} className="flex items-center justify-center gap-3 text-center">
          <div className="w-16 h-16 rounded-full bg-primary-soft flex items-center justify-center">
            <Spinner size="lg" tone="primary" />
          </div>
          <div className="text-[15px] font-bold text-ink">문서 상세를 불러오고 있어요</div>
        </AppContent>
      </div>
    )
  }

  if (errorMessage) {
    return (
      <div className="flex flex-col flex-1 min-h-full">
        <AppBar title="문서 상세" badges={<Pill variant="testnet" size="sm">Testnet</Pill>} />
        <AppContent scrollable={false} className="text-[12px] leading-relaxed text-sub">
          <div className="card text-danger">{errorMessage}</div>
        </AppContent>
      </div>
    )
  }

  if (detail) {
    return (
      <div className="flex flex-col flex-1 min-h-full">
        <AppBar
          title={detail.documentTypeName}
          badges={<Pill variant="testnet" size="sm">Testnet</Pill>}
        />

        <AppContent>
          <div className="card mb-3">
            <div className="flex items-center justify-between mb-2">
              <Pill variant={detail.isSuccess ? 'success' : 'warning'} size="sm">
                {detail.statusLabel}
              </Pill>
              <FileText size={16} className="text-muted" />
            </div>
            <div className="text-[15px] font-bold text-ink">{detail.documentTypeName}</div>
            <div className="text-[12px] text-sub">{detail.issuerCountryCode}-{detail.issuerIconLabel} · {detail.issuerName}</div>
          </div>

          <div className="card mb-3 flex flex-col gap-2.5">
            <Row label="신청일" value={formatDate(detail.requestedAt)} />
            <div className="border-t border-border" />
            <Row label="발급일" value={formatDate(detail.issuedAt)} />
            <div className="border-t border-border" />
            <Row label="문서 ID" value={detail.documentCode} mono />
          </div>

          <DocumentStepHistory
            documentTypeName={detail.documentTypeName}
            issuerName={detail.issuerName}
            issuerIconLabel={detail.issuerIconLabel}
            issuerCountryCode={detail.issuerCountryCode}
            isSuccess={detail.isSuccess}
            steps={displaySteps}
          />

          <div className="card flex flex-col items-center justify-center" style={{ minHeight: 180 }}>
            <Download size={28} className="text-muted mb-2" strokeWidth={1.6} />
            <div className="text-[15px] font-bold text-ink">PDF 미리보기</div>
            <div className="text-[12px] leading-relaxed text-muted mt-0.5">탭해서 다운로드 받기</div>
          </div>
        </AppContent>

        <PageFooter>
          <button onClick={() => router.push('/submission-request')} className="btn-primary">
            <Send size={16} strokeWidth={2.2} />
            기관 제출
          </button>
          <button
            onClick={() => router.push(`/renewal?preselect=${encodeURIComponent(detail.documentTypeCode)}&documentTypeName=${encodeURIComponent(detail.documentTypeName)}`)}
            className="btn-secondary"
          >
            <RefreshCw size={14} strokeWidth={2.2} />
            재발급 신청
          </button>
          <button onClick={() => router.push('/disputes/new')} className="btn-ghost text-danger">
            <AlertCircle size={14} strokeWidth={2.2} />
            이의 신청
          </button>
        </PageFooter>
      </div>
    )
  }

  if (!doc) {
    return (
      <div className="flex flex-col flex-1 min-h-full">
        <AppBar title="문서 상세" />
        <AppContent scrollable={false} className="text-[12px] leading-relaxed text-sub">문서를 찾을 수 없어요</AppContent>
      </div>
    )
  }

  const expired = doc.status === 'expired'

  return (
    <div className="flex flex-col flex-1 min-h-full">
      <AppBar
        title={`${doc.type} (영문)`}
        badges={<Pill variant="testnet" size="sm">Testnet</Pill>}
      />

      <AppContent>
        <div className="card mb-3">
          <div className="flex items-center justify-between mb-2">
            {expired ? (
              <Pill variant="revoked" size="sm">Revoked · 자동 폐기됨</Pill>
            ) : (
              <Pill variant="testnet" size="sm">XLS-70 · Active</Pill>
            )}
            <FileText size={16} className="text-muted" />
          </div>
          <div className="text-[15px] font-bold text-ink">{doc.type} (영문)</div>
          <div className="text-[12px] text-sub">한국 정부 발급</div>
          {doc.isExpiringSoon && !expired && (
            <div className="mt-2">
              <Pill variant="warning" size="sm">D-7 만료 예정</Pill>
            </div>
          )}
        </div>

        <div className="card mb-3 flex flex-col gap-2.5">
          <Row label="발급일" value={doc.issuedAt} />
          <div className="border-t border-border" />
          <Row label="만료일" value={doc.expiresAt} />
          <div className="border-t border-border" />
          <Row label="자격증명 ID" value={doc.credentialId} mono />
        </div>

        <div className="card flex flex-col items-center justify-center" style={{ minHeight: 180 }}>
          <Download size={28} className="text-muted mb-2" strokeWidth={1.6} />
          <div className="text-[15px] font-bold text-ink">PDF 미리보기</div>
          <div className="text-[12px] leading-relaxed text-muted mt-0.5">탭해서 다운로드 받기</div>
        </div>
      </AppContent>

      <PageFooter>
        <button onClick={() => router.push('/submission-request')} className="btn-primary">
          <Send size={16} strokeWidth={2.2} />
          기관 제출
        </button>
        <button onClick={() => router.push(`/renewal?docId=${doc.id}`)} className="btn-secondary">
          <RefreshCw size={14} strokeWidth={2.2} />
          재발급 신청
        </button>
        <button onClick={() => router.push('/disputes/new')} className="btn-ghost text-danger">
          <AlertCircle size={14} strokeWidth={2.2} />
          이의 신청
        </button>
      </PageFooter>
    </div>
  )
}

function Row({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <span className="text-[12px] text-muted flex-shrink-0">{label}</span>
      <span className={`text-[12px] font-bold text-ink text-right ${mono ? 'font-mono break-all' : ''}`}>{value}</span>
    </div>
  )
}

function DocumentStepHistory({
  documentTypeName,
  issuerName,
  issuerIconLabel,
  issuerCountryCode,
  isSuccess,
  steps,
}: {
  documentTypeName: string
  issuerName: string
  issuerIconLabel: string
  issuerCountryCode: string
  isSuccess: boolean
  steps: DisplayStep[]
}) {
  if (!steps.length) return null

  const completedCount = steps.filter(step => step.status === 'done').length
  const statusText = isSuccess ? '전체 이력 정상이에요' : `${completedCount}/${steps.length} 단계 완료`

  return (
    <section className="mt-4 mb-5">
      <div className="card mb-5 bg-primary-soft border border-primary-soft">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-[8px] bg-card border border-border flex items-center justify-center flex-shrink-0">
            <FileText size={17} className="text-primary" strokeWidth={2.1} />
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-[13px] font-bold text-ink truncate">{documentTypeName}</div>
            <div className="text-[11px] text-sub truncate">{issuerName} · {issuerCountryCode}-{issuerIconLabel}</div>
          </div>
          <Pill variant={isSuccess ? 'success' : 'warning'} size="sm">{isSuccess ? '정상' : '진행'}</Pill>
        </div>
      </div>

      <div className="mb-4">
        <div className="text-[13px] font-bold text-ink mb-2">발급 단계별 이력이에요</div>
        <div className="text-[11px] text-muted leading-relaxed">각 단계가 언제 시작되고 완료됐는지 확인할 수 있어요</div>
      </div>

      <div className="flex flex-col gap-3">
        {steps.map((step, index) => (
          <StepHistoryCard key={step.step} step={step} showConnector={index < steps.length - 1} />
        ))}
      </div>

      <div className="flex items-center gap-2 px-4 py-3 rounded-[8px] bg-success-soft border border-success mt-4">
        <Check size={16} className="text-success flex-shrink-0" strokeWidth={2.4} />
        <div className="text-[12px] font-bold text-ink">{statusText}</div>
      </div>
    </section>
  )
}

function StepHistoryCard({ step, showConnector }: { step: DisplayStep; showConnector: boolean }) {
  const toneClassByStatus: Record<StepTone, string> = {
    done: 'bg-success text-white',
    active: 'bg-primary text-white',
    wait: 'bg-bg-base text-muted border border-border',
    error: 'bg-danger text-white',
  }
  const toneClass = toneClassByStatus[step.status]
  const badgeVariant = getStepBadgeVariant(step.status)
  const timeLabel = step.completedAt
    ? `완료 ${formatDateTime(step.completedAt)}`
    : step.startedAt
      ? `시작 ${formatDateTime(step.startedAt)}`
      : '아직 대기 중이에요'

  return (
    <div className="card" style={{ border: step.status === 'active' ? '1.5px solid #3182F6' : '1.5px solid #E5E8EB' }}>
      <div className="flex items-center gap-3">
        <div className="flex flex-col items-center flex-shrink-0" style={{ width: 28 }}>
          <div className={`w-7 h-7 rounded-full flex items-center justify-center ${toneClass}`}>
            {step.status === 'done' ? <Check size={14} strokeWidth={3} /> : null}
            {step.status === 'active' ? <Clock size={13} strokeWidth={3} /> : null}
            {step.status === 'error' ? <X size={13} strokeWidth={3} /> : null}
          </div>
          {showConnector && <div className="w-0.5 h-3 bg-border my-0.5" />}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 mb-0.5">
            <span className="text-[11px] font-bold text-muted">단계 {step.step}</span>
            <Pill variant={badgeVariant} size="sm">{step.statusLabel}</Pill>
          </div>
          <div className="text-[13px] font-bold text-ink">{step.label}</div>
          <div className="text-[11px] text-sub mt-0.5">{timeLabel}</div>
        </div>
      </div>
    </div>
  )
}
