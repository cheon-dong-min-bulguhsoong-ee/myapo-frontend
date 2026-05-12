'use client'
import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { FileText, Download, Send, RefreshCw, AlertCircle } from 'lucide-react'
import { AppBar } from '@/components/ui/app-bar'
import { Pill } from '@/components/ui/pill'
import { PageFooter } from '@/components/ui/page-footer'
import { Spinner } from '@/components/ui/spinner'
import { useAuth } from '@/contexts/auth-context'
import { getDocumentMvp, type DocumentMvpDetailRes } from '@/lib/myapo-api'
import { mockDocuments } from '@/lib/mock-data'

interface DetailLoadState {
  documentCode: string
  detail: DocumentMvpDetailRes | null
  errorMessage: string | null
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

        <main className="app-content flex-1 overflow-y-auto">
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

          <div className="card flex flex-col items-center justify-center" style={{ minHeight: 180 }}>
            <Download size={28} className="text-muted mb-2" strokeWidth={1.6} />
            <div className="text-[15px] font-bold text-ink">PDF 미리보기</div>
            <div className="text-[12px] leading-relaxed text-muted mt-0.5">탭해서 다운로드 받기</div>
          </div>
        </main>

        <PageFooter>
          <button onClick={() => router.push('/submission-request')} className="btn-primary">
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

      <main className="app-content flex-1 overflow-y-auto">
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
      <span className={`text-[12px] font-bold text-ink text-right ${mono ? 'font-mono break-all' : ''}`}>{value}</span>
    </div>
  )
}
