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
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())

  const toggle = (id: string) => {
    setSelectedIds(prev => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id); else next.add(id)
      return next
    })
  }

  const selectedCount = selectedIds.size
  const onlyDoc = selectedCount === 1
    ? mockIssuableDocuments.find(d => selectedIds.has(d.id)) ?? null
    : null

  const ctaLabel =
    selectedCount === 0 ? '서류를 선택해 주세요'
    : onlyDoc          ? `${onlyDoc.name} 발급 신청할게요`
    :                    `${selectedCount}개 서류 발급 신청할게요`

  return (
    <div className="flex flex-col h-full bg-canvas">
      <AppBar title="발급 서류 선택" />
      <PageHeader
        size="hero"
        title="어떤 서류를 발급할까요?"
        subtitle="여러 개를 함께 신청할 수 있어요"
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
              selected={selectedIds.has(doc.id)}
              onClick={() => toggle(doc.id)}
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
          disabled={selectedCount === 0}
          onClick={() => router.push('/issue/verify')}
        >
          {ctaLabel}
        </Button>
        <p className="text-[11px] text-ink-muted text-center mt-1">
          PIPA §17 동의 포함 · 사용자 디바이스 한정 보관
        </p>
      </PageFooter>
    </div>
  )
}
