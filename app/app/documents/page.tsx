'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Folder, ChevronRight, RotateCcw, History, CheckCircle } from 'lucide-react'
import { AppBar } from '@/components/ui/app-bar'
import { Pill } from '@/components/ui/pill'
import { SegmentedControl } from '@/components/ui/segmented-control'
import { EmptyState } from '@/components/ui/empty-state'
import { mockDocuments, type Document } from '@/lib/mock-data'

const issuerLabels: Record<string, string> = {
  납세증명서:    'KR-NTS · 한국 국세청',
  가족관계증명서: 'KR-법원 · 한국 법원',
  주민등록등본:   'KR-MOIS · 행정안전부',
  졸업증명서:    'KR-학교 · 학사정보원',
  재직증명서:    'KR-건보 · 건강보험공단',
  범죄경력회보서: 'KR-경찰청 · 경찰청',
}

function daysUntil(dateStr: string): number {
  const target = new Date(dateStr).getTime()
  const today = new Date().setHours(0, 0, 0, 0)
  return Math.round((target - today) / (1000 * 60 * 60 * 24))
}

function ArrivedCallout({ name }: { name: string }) {
  return (
    <div
      className="flex items-center gap-2 p-3 rounded-[8px]"
      style={{ background: '#E6FAF3', border: '1px solid #00C48C' }}
    >
      <CheckCircle size={16} className="text-success flex-shrink-0" />
      <div>
        <div className="text-[15px] font-bold text-ink leading-snug">{name}가 지갑에 도착했어요</div>
        <div className="text-[12px] leading-relaxed text-sub mt-0.5">총 3번의 서명을 완료해주셨어요</div>
      </div>
    </div>
  )
}

function DocumentRow({ doc, onClick }: { doc: Document; onClick: () => void }) {
  const expired = doc.status === 'expired'
  const issuerLabel = issuerLabels[doc.type] ?? '한국 정부'
  const days = daysUntil(doc.expiresAt)

  if (expired) {
    return (
      <button
        onClick={onClick}
        className="card press w-full text-left"
        style={{
          opacity: 0.7,
          background: 'repeating-linear-gradient(45deg, #F9FAFB 0 8px, #F0F1F3 8px 16px)',
        }}
      >
        <div className="flex items-center justify-between mb-1">
          <Pill variant="revoked" size="sm">Revoked · 자동 폐기됨</Pill>
        </div>
        <div className="text-[15px] font-bold text-ink line-through">{doc.type} (영문)</div>
        <div className="text-[12px] text-muted line-through">{issuerLabel}</div>
        <div className="text-[12px] text-muted mt-1">유효기간 {doc.expiresAt} 만료됨</div>
      </button>
    )
  }

  return (
    <button onClick={onClick} className="card press w-full text-left">
      <div className="flex items-center justify-between mb-2">
        <Pill variant="testnet" size="sm">XLS-70 · Active</Pill>
        <div className="flex items-center gap-1 text-muted">
          <span className="p-1"><RotateCcw size={14} strokeWidth={2} /></span>
          <span className="p-1"><History size={14} strokeWidth={2} /></span>
          <ChevronRight size={16} strokeWidth={2} />
        </div>
      </div>
      <div className="text-[15px] font-bold text-ink">{doc.type} (영문)</div>
      <div className="text-[12px] text-sub">{issuerLabel}</div>
      <div className="text-[12px] text-sub mt-1">
        유효기간 <span className="font-bold text-ink">{doc.expiresAt}</span>
        {days >= 0 && <> (+{days}일)</>}
      </div>
      <div className="font-mono text-[10px] text-muted mt-1">{doc.credentialId}</div>
    </button>
  )
}

export default function DocumentsPage() {
  const [tab, setTab] = useState<'available' | 'expired'>('available')
  const router = useRouter()
  const availableCount = mockDocuments.filter(d => d.status === 'available').length
  const expiredCount = mockDocuments.filter(d => d.status === 'expired').length
  const filtered = mockDocuments.filter(d => d.status === tab)
  const justArrived = tab === 'available' ? mockDocuments.find(d => d.status === 'available' && d.isExpiringSoon) : null

  return (
    <div className="flex flex-col flex-1 min-h-full">
      <AppBar
        title="내 문서"
        badges={<Pill variant="testnet" size="sm">Testnet</Pill>}
      />

      <main className="app-content flex flex-1 flex-col gap-3 overflow-y-auto">
        <SegmentedControl
          value={tab}
          onChange={v => setTab(v as 'available' | 'expired')}
          options={[
            { value: 'available', label: '사용 가능', count: availableCount },
            { value: 'expired',   label: '만료됨',    count: expiredCount },
          ]}
        />
        {filtered.length === 0 ? (
          <EmptyState
            icon={Folder}
            title={tab === 'available' ? '발급된 문서가 없어요' : '만료된 문서가 없어요'}
            description="발급 신청을 통해 문서를 발급받으세요"
            ctaLabel="발급 신청하기"
            onCta={() => router.push('/issue/select')}
          />
        ) : (
          <>
            {justArrived && tab === 'available' && (
              <ArrivedCallout name={`${justArrived.type} (영문)`} />
            )}
            {filtered.map(doc => (
              <DocumentRow
                key={doc.id}
                doc={doc}
                onClick={() => router.push(`/documents/${doc.id}`)}
              />
            ))}
          </>
        )}
      </main>
    </div>
  )
}
