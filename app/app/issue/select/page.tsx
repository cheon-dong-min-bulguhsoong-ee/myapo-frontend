'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { AppBar } from '@/components/ui/app-bar'
import { Button } from '@/components/ui/button'
import { PageHeader } from '@/components/ui/page-header'
import { PageFooter } from '@/components/ui/page-footer'
import { DocCard } from '@/components/ui/doc-card'
import { mockIssuableDocuments } from '@/lib/mock-data'

export default function IssueSelectPage() {
  const router = useRouter()
  const [selectedId, setSelectedId] = useState<string | null>(null)

  const selectedDoc = mockIssuableDocuments.find(d => d.id === selectedId) ?? null

  return (
    <div className="flex flex-col h-full bg-canvas">
      <AppBar title="발급 서류 선택" />
      <PageHeader
        title="어떤 서류를 발급할까요?"
        subtitle="해외 기관 제출용 · 한국 정부 발급"
      />

      <main className="flex-1 overflow-y-auto px-5 pb-4">
        <div className="flex flex-col gap-2">
          {mockIssuableDocuments.map(doc => (
            <DocCard
              key={doc.id}
              issuerIcon={doc.issuerIcon}
              name={doc.name}
              englishName={doc.englishName}
              use={doc.use}
              issuerCode={doc.issuerCode}
              selected={selectedId === doc.id}
              onClick={() => setSelectedId(doc.id)}
            />
          ))}
        </div>

        <p className="text-[11px] text-ink-muted mt-4 text-center">
          발급해두면 유효기간 안에 무한 재사용해요
        </p>
      </main>

      <PageFooter>
        <Button
          fullWidth
          disabled={!selectedDoc}
          onClick={() => router.push('/issue/verify')}
        >
          {selectedDoc ? `${selectedDoc.name} 발급 신청할게요` : '서류를 선택해 주세요'}
        </Button>
        <p className="text-[11px] text-ink-muted text-center mt-1">
          PIPA §17 동의 포함 · 사용자 디바이스 한정 보관
        </p>
      </PageFooter>
    </div>
  )
}
