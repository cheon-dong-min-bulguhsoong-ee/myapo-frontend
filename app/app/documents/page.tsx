'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Tab } from '@toss/tds-mobile'
import { AppBar } from '@/components/ui/app-bar'
import { Pill } from '@/components/ui/pill'
import { EmptyState } from '@/components/ui/empty-state'
import { PageHeader } from '@/components/ui/page-header'
import { mockDocuments, type Document } from '@/lib/mock-data'
import {
  Folder,
  ChevronRight,
  ScrollText,
  Users,
  Home,
  GraduationCap,
  Briefcase,
  ShieldAlert,
  FileText,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

const ICON_MAP: Record<string, { Icon: LucideIcon; tint: string; bg: string }> = {
  납세증명서: { Icon: ScrollText, tint: '#3182F6', bg: '#EBF3FE' },
  가족관계증명서: { Icon: Users, tint: '#00C48C', bg: '#E6FAF5' },
  주민등록등본: { Icon: Home, tint: '#FFB020', bg: '#FFF8E6' },
  졸업증명서: { Icon: GraduationCap, tint: '#7C5CFC', bg: '#EFEAFE' },
  재직증명서: { Icon: Briefcase, tint: '#18BFFF', bg: '#E6F9FF' },
  범죄경력회보서: { Icon: ShieldAlert, tint: '#F04452', bg: '#FEE7E9' },
}

function getIcon(type: string) {
  return ICON_MAP[type] ?? { Icon: FileText, tint: '#8B95A1', bg: '#F2F4F6' }
}

function DocumentCard({ doc, onClick }: { doc: Document; onClick: () => void }) {
  const { Icon, tint, bg } = getIcon(doc.type)
  const expired = doc.status === 'expired'

  return (
    <button
      onClick={onClick}
      className="w-full text-left bg-paper rounded-2xl p-4 active:bg-canvas transition-colors"
      style={{
        boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
        border: '1px solid var(--color-hairline)',
        opacity: expired ? 0.55 : 1,
      }}
    >
      <div className="flex items-start gap-3">
        <div
          className="shrink-0 w-12 h-12 rounded-xl flex items-center justify-center"
          style={{ backgroundColor: expired ? '#F2F4F6' : bg }}
        >
          <Icon size={22} strokeWidth={1.8} style={{ color: expired ? '#8B95A1' : tint } as React.CSSProperties} />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="font-bold text-ink truncate">{doc.type}</span>
            {expired ? (
              <Pill variant="neutral">만료</Pill>
            ) : doc.isExpiringSoon ? (
              <Pill variant="warning">D-7</Pill>
            ) : (
              <Pill variant="success">유효</Pill>
            )}
          </div>
          <p className="text-xs text-ink-muted font-mono mb-2">{doc.credentialId}</p>
          <div className="flex items-center gap-3 text-xs text-ink-secondary">
            <span>발급 {doc.issuedAt}</span>
            <span className="text-ink-muted">·</span>
            <span>만료 {doc.expiresAt}</span>
          </div>
        </div>

        <ChevronRight size={18} className="text-ink-muted mt-2 shrink-0" />
      </div>
    </button>
  )
}

export default function DocumentsPage() {
  const [tab, setTab] = useState<'available' | 'expired'>('available')
  const router = useRouter()
  const availableCount = mockDocuments.filter(d => d.status === 'available').length
  const expiredCount = mockDocuments.filter(d => d.status === 'expired').length
  const filtered = mockDocuments.filter(d => d.status === tab)

  return (
    <div className="flex flex-col h-full bg-canvas">
      <AppBar title="내 문서" />
      <PageHeader title="내 증명서" subtitle="발급된 문서와 만료된 문서를 확인하세요" />
      <div className="shrink-0" style={{ borderBottom: '1px solid var(--color-hairline)' }}>
        <Tab size="large" onChange={(idx) => setTab(idx === 0 ? 'available' : 'expired')}>
          <Tab.Item selected={tab === 'available'}>
            유효한 문서 <span style={{ color: tab === 'available' ? '#3182F6' : '#8B95A1', marginLeft: 4 }}>{availableCount}</span>
          </Tab.Item>
          <Tab.Item selected={tab === 'expired'}>
            만료된 문서 <span style={{ color: tab === 'expired' ? '#3182F6' : '#8B95A1', marginLeft: 4 }}>{expiredCount}</span>
          </Tab.Item>
        </Tab>
      </div>
      <main className="flex-1 overflow-y-auto px-5 py-4 pb-6 space-y-3">
        {filtered.length === 0 ? (
          <EmptyState
            icon={Folder}
            title={tab === 'available' ? '발급된 문서가 없어요' : '만료된 문서가 없어요'}
            description="발급 신청을 통해 문서를 발급받으세요"
            ctaLabel="발급 신청하기"
            onCta={() => router.push('/issue/select')}
          />
        ) : (
          filtered.map(doc => (
            <DocumentCard
              key={doc.id}
              doc={doc}
              onClick={() => router.push(`/documents/${doc.id}`)}
            />
          ))
        )}
      </main>
    </div>
  )
}
