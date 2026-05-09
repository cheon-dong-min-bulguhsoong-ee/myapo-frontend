'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { AppBar } from '@/components/ui/app-bar'
import { Button } from '@/components/ui/button'
import { PageHeader } from '@/components/ui/page-header'
import { PageFooter } from '@/components/ui/page-footer'
import { SelectableCard } from '@/components/ui/selectable-card'
import { mockInstitutions } from '@/lib/mock-data'

export default function SubmissionRequestPage() {
  const [selected, setSelected] = useState('')
  const router = useRouter()

  return (
    <div className="flex flex-col h-full bg-canvas">
      <AppBar title="제출 기관 선택" />
      <PageHeader title="어디로 제출할까요?" subtitle="문서를 받을 해외 기관을 선택해 주세요" />

      <main className="flex-1 overflow-y-auto px-5 pb-6 space-y-3">
        {mockInstitutions.map(inst => (
          <SelectableCard
            key={inst.id}
            selected={selected === inst.id}
            onClick={() => setSelected(inst.id)}
          >
            <p className={`ds-body font-bold ${selected === inst.id ? 'text-primary' : 'text-ink'}`}>
              {inst.name}
            </p>
            <p className="text-sm text-ink-secondary mt-0.5">{inst.country}</p>
            <p className="text-xs font-mono text-ink-muted mt-1">{inst.code}</p>
          </SelectableCard>
        ))}
      </main>

      <PageFooter>
        <Button fullWidth disabled={!selected} onClick={() => router.push('/delivery')}>
          제출하기
        </Button>
      </PageFooter>
    </div>
  )
}
