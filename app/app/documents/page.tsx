'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
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

type IconTone = 'blue' | 'green' | 'yellow' | 'purple' | 'info' | 'red' | 'neutral'

const ICON_MAP: Record<string, { Icon: LucideIcon; tone: IconTone }> = {
  납세증명서: { Icon: ScrollText, tone: 'blue' },
  가족관계증명서: { Icon: Users, tone: 'green' },
  주민등록등본: { Icon: Home, tone: 'yellow' },
  졸업증명서: { Icon: GraduationCap, tone: 'purple' },
  재직증명서: { Icon: Briefcase, tone: 'info' },
  범죄경력회보서: { Icon: ShieldAlert, tone: 'red' },
}

function getIcon(type: string) {
  return ICON_MAP[type] ?? { Icon: FileText, tone: 'neutral' as IconTone }
}

function DocumentCard({ doc, onClick }: { doc: Document; onClick: () => void }) {
  const { Icon, tone } = getIcon(doc.type)
  const expired = doc.status === 'expired'
  const iconTone = expired ? 'neutral' : tone

  return (
    <button
      onClick={onClick}
      className={`ds-card w-full text-left p-4 active:bg-canvas transition-colors ${expired ? 'opacity-55' : ''}`}
    >
      <div className="flex items-start gap-3">
        <div className={`ds-icon-box ds-tone-${iconTone} shrink-0 w-12 h-12 flex items-center justify-center`}>
          <Icon size={22} strokeWidth={1.8} />
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
      <div className="ds-divider-bottom shrink-0">
        <div className="grid grid-cols-2 px-5">
          <button
            type="button"
            onClick={() => setTab('available')}
            className={`ds-tab ${tab === 'available' ? 'text-primary' : 'text-ink-secondary'}`}
          >
            유효한 문서 <span className={`ds-tab-count ${tab === 'available' ? 'text-primary' : 'text-ink-muted'}`}>{availableCount}</span>
            {tab === 'available' && <span className="ds-tab-indicator" />}
          </button>
          <button
            type="button"
            onClick={() => setTab('expired')}
            className={`ds-tab ${tab === 'expired' ? 'text-primary' : 'text-ink-secondary'}`}
          >
            만료된 문서 <span className={`ds-tab-count ${tab === 'expired' ? 'text-primary' : 'text-ink-muted'}`}>{expiredCount}</span>
            {tab === 'expired' && <span className="ds-tab-indicator" />}
          </button>
        </div>
      </div>
      <main className="flex-1 overflow-y-auto px-5 pb-6 space-y-3">
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
