'use client'
import { useEffect, useMemo, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { Check, Clock, FileText, Download, Send, RefreshCw, AlertCircle, X, ChevronDown } from 'lucide-react'
import { AppBar } from '@/components/ui/app-bar'
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
  pdfUrl: string | null
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
    pdfUrl: step.pdfUrl ?? null,
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

function getPdfFilename(pdfUrl: string, fallback: string): string {
  try {
    const path = new URL(pdfUrl).pathname
    const last = path.split('/').pop() || ''
    return last ? decodeURIComponent(last) : fallback
  } catch {
    return fallback
  }
}

function buildPdfProxyUrl(url: string, filename: string) {
  const params = new URLSearchParams({ url, filename })
  return `/api/pdf-proxy?${params.toString()}`
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
        <main className="app-content flex-1 flex flex-col items-center justify-center gap-3 text-center">
          <div className="w-16 h-16 rounded-full bg-primary-soft flex items-center justify-center">
            <Spinner size="lg" tone="primary" />
          </div>
          <div className="text-[15px] font-bold text-ink">문서 상세를 불러오고 있어요</div>
        </main>
      </div>
    )
  }

  if (errorMessage) {
    return (
      <div className="flex flex-col flex-1 min-h-full">
        <AppBar title="문서 상세" badges={<Pill variant="testnet" size="sm">Testnet</Pill>} />
        <main className="app-content flex-1 text-[12px] leading-relaxed text-sub">
          <div className="card text-danger">{errorMessage}</div>
        </main>
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

        <main className="app-content flex-1 overflow-y-auto space-y-6 pb-6">
          <section className="card">
            <div className="flex items-center justify-between mb-3.5">
              <Pill variant={detail.isSuccess ? 'success' : 'warning'} size="sm">
                {detail.statusLabel}
              </Pill>
              <FileText size={20} className="text-muted" />
            </div>
            <div className="text-[18px] font-bold text-ink leading-snug">{detail.documentTypeName}</div>
            <div className="text-[12px] text-sub mt-2">{detail.issuerCountryCode}-{detail.issuerIconLabel} · {detail.issuerName}</div>
          </section>

          <section className="card flex flex-col gap-4">
            <Row label="신청일" value={formatDate(detail.requestedAt)} />
            <div className="border-t border-border" />
            <Row label="발급일" value={formatDate(detail.issuedAt)} />
            <div className="border-t border-border" />
            <Row label="문서 ID" value={detail.documentCode} mono />
          </section>

          <DocumentStepHistory
            documentTypeName={detail.documentTypeName}
            issuerName={detail.issuerName}
            issuerIconLabel={detail.issuerIconLabel}
            issuerCountryCode={detail.issuerCountryCode}
            isSuccess={detail.isSuccess}
            steps={displaySteps}
          />
        </main>

        <PageFooter>
          <button
            onClick={() => router.push('/submission-request')}
            disabled={!detail.isSuccess}
            className="btn-primary"
          >
            <Send size={16} strokeWidth={2.2} />
            기관 제출
          </button>
          <button onClick={() => router.push(`/issue/select?preselect=${encodeURIComponent(detail.documentTypeCode)}`)} className="btn-secondary">
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
        <div className="app-content flex-1 text-[12px] leading-relaxed text-sub">문서를 찾을 수 없어요</div>
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

      <main className="app-content flex-1 overflow-y-auto space-y-5 pb-5">
        <section className="card">
          <div className="flex items-center justify-between mb-3.5">
            {expired ? (
              <Pill variant="revoked" size="sm">Revoked · 자동 폐기됨</Pill>
            ) : (
              <Pill variant="testnet" size="sm">XLS-70 · Active</Pill>
            )}
            <FileText size={20} className="text-muted" />
          </div>
          <div className="text-[18px] font-bold text-ink leading-snug">{doc.type} (영문)</div>
          <div className="text-[12px] text-sub mt-2">한국 정부 발급</div>
          {doc.isExpiringSoon && !expired && (
            <div className="mt-3">
              <Pill variant="warning" size="sm">D-7 만료 예정</Pill>
            </div>
          )}
        </section>

        <section className="card flex flex-col gap-4">
          <Row label="발급일" value={doc.issuedAt} />
          <div className="border-t border-border" />
          <Row label="만료일" value={doc.expiresAt} />
          <div className="border-t border-border" />
          <Row label="자격증명 ID" value={doc.credentialId} mono />
        </section>
      </main>

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
      <span className={`text-[13px] font-bold text-ink text-right ${mono ? 'font-mono break-all' : ''}`}>{value}</span>
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
  const [openStep, setOpenStep] = useState<number | null>(null)

  if (!steps.length) return null

  return (
    <section className="flex flex-col gap-7">
      <div className="rounded-[12px] bg-primary-soft p-5">
        <div className="flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-[10px] bg-card border border-border flex items-center justify-center flex-shrink-0">
            <FileText size={19} className="text-primary" strokeWidth={2.1} />
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-[13.5px] font-bold text-ink truncate">{documentTypeName}</div>
            <div className="text-[11.5px] text-sub truncate mt-2">{issuerName} · {issuerCountryCode}-{issuerIconLabel}</div>
          </div>
          <Pill variant={isSuccess ? 'success' : 'warning'} size="sm">{isSuccess ? '정상' : '진행'}</Pill>
        </div>
      </div>

      <div>
        <div className="text-[14px] font-bold text-ink">발급 단계별 이력이에요</div>
        <div className="text-[11.5px] text-muted mt-3 leading-relaxed">
          {isSuccess ? '각 단계를 눌러 PDF를 다운로드할 수 있어요' : '진행 중인 단계가 있어요'}
        </div>
      </div>

      <div className="flex flex-col gap-4">
        {steps.map((step, index) => (
          <StepHistoryCard
            key={step.step}
            step={step}
            showConnector={index < steps.length - 1}
            canDownload={isSuccess}
            isOpen={openStep === step.step}
            onToggle={() => setOpenStep(openStep === step.step ? null : step.step)}
          />
        ))}
      </div>
    </section>
  )
}

function StepHistoryCard({
  step,
  showConnector,
  canDownload,
  isOpen,
  onToggle,
}: {
  step: DisplayStep
  showConnector: boolean
  canDownload: boolean
  isOpen: boolean
  onToggle: () => void
}) {
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
  const hasDownload = canDownload && !!step.pdfUrl
  const filename = step.pdfUrl ? getPdfFilename(step.pdfUrl, `${step.label}.pdf`) : ''

  return (
    <div
      className="card"
      style={{
        border: step.status === 'active' ? '1.5px solid #3182F6' : '1.5px solid #E5E8EB',
        padding: '22px 20px',
      }}
    >
      <button
        type="button"
        onClick={onToggle}
        disabled={!hasDownload}
        className={`w-full flex items-start gap-4 text-left ${hasDownload ? 'cursor-pointer' : 'cursor-default'}`}
      >
        <div className="flex flex-col items-center flex-shrink-0 mt-1" style={{ width: 32 }}>
          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${toneClass}`}>
            {step.status === 'done' ? <Check size={15} strokeWidth={3} /> : null}
            {step.status === 'active' ? <Clock size={14} strokeWidth={3} /> : null}
            {step.status === 'error' ? <X size={14} strokeWidth={3} /> : null}
          </div>
          {showConnector && <div className="w-0.5 h-3 bg-border mt-1.5" />}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-[11px] font-bold text-muted">단계 {step.step}</span>
            <Pill variant={badgeVariant} size="sm">{step.statusLabel}</Pill>
          </div>
          <div className="text-[14.5px] font-bold text-ink leading-snug">{step.label}</div>
          <div className="text-[11.5px] text-sub mt-4">{timeLabel}</div>
        </div>
        {hasDownload && (
          <ChevronDown
            size={18}
            className={`text-muted flex-shrink-0 mt-1 transition-transform ${isOpen ? 'rotate-180' : ''}`}
            strokeWidth={2.2}
          />
        )}
      </button>

      {hasDownload && isOpen && step.pdfUrl && (
        <div className="mt-8">
          <a
            href={buildPdfProxyUrl(step.pdfUrl, filename)}
            download={filename}
            className="flex items-center gap-5 py-5 pl-5 pr-7 rounded-[12px] bg-primary-soft hover:bg-primary-soft active:scale-[0.98] transition-transform"
          >
            <div className="w-11 h-11 rounded-[10px] bg-white flex items-center justify-center flex-shrink-0 shadow-sm">
              <Download size={18} className="text-primary" strokeWidth={2.2} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-[13.5px] font-bold text-ink">PDF 다운로드</div>
              <div className="text-[11px] text-muted truncate mt-2">{filename}</div>
            </div>
            <div className="text-[11px] font-bold text-primary flex-shrink-0">받기</div>
          </a>
        </div>
      )}
    </div>
  )
}
