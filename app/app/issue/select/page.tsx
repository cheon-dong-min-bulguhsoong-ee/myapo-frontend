'use client'
import { Suspense, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { AppBar } from '@/components/ui/app-bar'
import { Pill } from '@/components/ui/pill'
import { DocCard } from '@/components/ui/doc-card'
import { PageFooter } from '@/components/ui/page-footer'
import { mockIssuableDocuments } from '@/lib/mock-data'

function IssueSelectView() {
  const router = useRouter()
  const params = useSearchParams()
  const preselect = params.get('preselect')
  const isReissue = !!preselect && mockIssuableDocuments.some(d => d.id === preselect)
  const [selectedIds, setSelectedIds] = useState<Set<string>>(
    () => (isReissue ? new Set([preselect!]) : new Set()),
  )

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
    selectedCount === 0 ? '서류를 선택해요'
    : isReissue && onlyDoc ? `${onlyDoc.name} 재발급 신청할게요`
    : onlyDoc          ? '발급 신청할게요'
    :                    `${selectedCount}개 서류 발급 신청할게요`

  const disabled = selectedCount === 0

  return (
    <div className="flex flex-col flex-1 min-h-full">
      <AppBar
        title={isReissue ? '재발급 신청' : '서류 발급 신청'}
        badges={
          <>
            <Pill variant="testnet" size="sm">Testnet</Pill>
            <Pill variant="precheck" size="sm">Pre-Check Only</Pill>
          </>
        }
      />

      <main className="app-content flex-1 overflow-y-auto">
        <div className="text-[15px] font-bold text-ink mb-1">
          {isReissue ? '재발급할 서류가 선택되어 있어요' : '어떤 한국 서류를 발급받을까요?'}
        </div>
        <div className="text-[12px] leading-relaxed text-sub mb-2">
          {isReissue
            ? '필요하면 다른 서류도 함께 선택할 수 있어요'
            : '발급기관: 한국 정부 · 해외 기관 제출용'}
        </div>

        <div className="doc-grid">
          {mockIssuableDocuments.map(doc => (
            <DocCard
              key={doc.id}
              issuerIcon={doc.issuerIcon}
              name={doc.name}
              englishName={selectedIds.has(doc.id) ? doc.englishName : undefined}
              use={doc.use}
              issuerCode={doc.issuerCode}
              selected={selectedIds.has(doc.id)}
              onClick={() => toggle(doc.id)}
            />
          ))}
        </div>

        <div className="text-[12px] leading-relaxed text-muted mt-3">발급해두면 유효기간 안에 무한 재사용해요</div>
      </main>

      <PageFooter>
        <button
          type="button"
          disabled={disabled}
          onClick={() => router.push('/issue/verify')}
          className="btn-primary"
        >
          {ctaLabel}
        </button>
        <div className="text-[12px] leading-relaxed text-muted text-center">
          PIPA §17 동의 포함 · 사용자 디바이스 한정 보관
        </div>
      </PageFooter>
    </div>
  )
}

export default function IssueSelectPage() {
  return (
    <Suspense fallback={null}>
      <IssueSelectView />
    </Suspense>
  )
}
