'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { AppBar } from '@/components/ui/app-bar'
import { SegmentedControl } from '@/components/ui/segmented-control'
import { Card } from '@/components/ui/card'
import { Pill } from '@/components/ui/pill'
import { EmptyState } from '@/components/ui/empty-state'
import { mockDocuments } from '@/lib/mock-data'
import { Folder, ChevronRight } from 'lucide-react'

export default function DocumentsPage() {
  const [tab, setTab] = useState('available')
  const router = useRouter()
  const filtered = mockDocuments.filter(d => d.status === (tab === 'available' ? 'available' : 'expired'))

  return (
    <div className="flex flex-col min-h-dvh" style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}>
      <AppBar title="내 문서" />
      <div className="px-5 pt-3 pb-2">
        <SegmentedControl
          value={tab}
          onChange={setTab}
          options={[{ value: 'available', label: '유효한 문서' }, { value: 'expired', label: '만료된 문서' }]}
        />
      </div>
      <main className="flex-1 px-5 py-3 space-y-3">
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
            <Card key={doc.id} clickable onClick={() => router.push(`/documents/${doc.id}`)}>
              <div className="flex justify-between items-start">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-ink">{doc.type}</span>
                    {doc.isExpiringSoon && <Pill variant="warning">D-7</Pill>}
                  </div>
                  <p className="text-xs text-ink-muted font-mono">{doc.credentialId}</p>
                  <p className="text-sm text-ink-secondary">만료 {doc.expiresAt}</p>
                </div>
                <ChevronRight size={18} className="text-ink-muted mt-1" />
              </div>
            </Card>
          ))
        )}
      </main>
    </div>
  )
}
