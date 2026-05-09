'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { AppBar } from '@/components/ui/app-bar'
import { Button } from '@/components/ui/button'
import { mockInstitutions } from '@/lib/mock-data'

export default function SubmissionRequestPage() {
  const [selected, setSelected] = useState('')
  const router = useRouter()

  return (
    <div className="flex flex-col min-h-dvh" style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}>
      <AppBar title="제출 기관 선택" />
      <main className="flex-1 px-5 py-4 space-y-3">
        <p className="text-sm text-ink-secondary">문서를 제출할 기관을 선택해 주세요</p>
        {mockInstitutions.map(inst => (
          <button
            key={inst.id}
            onClick={() => setSelected(inst.id)}
            className={`w-full p-4 rounded-xl border text-left transition-colors
              ${selected === inst.id ? 'border-primary bg-primary-soft' : 'border-hairline bg-paper'}`}
            style={{ boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}
          >
            <p className="font-bold text-ink">{inst.name}</p>
            <p className="text-sm text-ink-secondary">{inst.country}</p>
            <p className="text-xs font-mono text-ink-muted mt-1">{inst.code}</p>
          </button>
        ))}
      </main>
      <div className="px-5 pb-6">
        <Button fullWidth disabled={!selected} onClick={() => router.push('/delivery')}>제출하기</Button>
      </div>
    </div>
  )
}
