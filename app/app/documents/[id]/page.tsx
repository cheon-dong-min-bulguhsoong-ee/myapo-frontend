'use client'
import { useRouter, useParams } from 'next/navigation'
import { FileText, Download, Send, RefreshCw, AlertCircle } from 'lucide-react'
import { AppBar } from '@/components/ui/app-bar'
import { Pill } from '@/components/ui/pill'
import { PageFooter } from '@/components/ui/page-footer'
import { mockDocuments } from '@/lib/mock-data'

export default function DocumentDetailPage() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()
  const doc = mockDocuments.find(d => d.id === id)

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
    <div className="flex items-center justify-between">
      <span className="text-[12px] text-muted">{label}</span>
      <span className={`text-[12px] font-bold text-ink ${mono ? 'font-mono' : ''}`}>{value}</span>
    </div>
  )
}
