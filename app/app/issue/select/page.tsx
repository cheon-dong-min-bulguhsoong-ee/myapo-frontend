'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { AppBar } from '@/components/ui/app-bar'
import { Button } from '@/components/ui/button'
import { documentCategories } from '@/lib/mock-data'
import { ChevronDown } from 'lucide-react'

export default function IssueSelectPage() {
  const router = useRouter()
  const [expanded, setExpanded] = useState<string | null>(null)
  const [selected, setSelected] = useState<string[]>([])

  const toggle = (item: string) => {
    setSelected(prev => prev.includes(item) ? prev.filter(x => x !== item) : [...prev, item])
  }

  return (
    <div className="flex flex-col min-h-dvh" style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}>
      <AppBar title="발급 서류 선택" />
      <main className="flex-1 px-5 py-3 space-y-2 overflow-y-auto pb-24">
        {documentCategories.map(cat => (
          <div key={cat.id} className="bg-paper rounded-xl border border-hairline overflow-hidden" style={{ boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
            <button
              onClick={() => setExpanded(expanded === cat.id ? null : cat.id)}
              className="w-full flex justify-between items-center px-4 py-3.5"
            >
              <span className="font-bold text-ink">{cat.label}</span>
              <ChevronDown size={18} className={`text-ink-muted transition-transform ${expanded === cat.id ? 'rotate-180' : ''}`} />
            </button>
            {expanded === cat.id && (
              <div className="border-t border-hairline">
                {cat.items.map(item => (
                  <button
                    key={item}
                    onClick={() => toggle(item)}
                    className={`w-full flex justify-between items-center px-4 py-3 text-sm border-b border-hairline last:border-0
                      ${selected.includes(item) ? 'bg-primary-soft text-primary font-semibold' : 'text-ink'}`}
                  >
                    {item}
                    {selected.includes(item) && <span className="text-primary font-bold">✓</span>}
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}
      </main>
      <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] px-5 pb-6 pt-3 bg-canvas border-t border-hairline" style={{ paddingBottom: 'calc(env(safe-area-inset-bottom) + 24px)' }}>
        <Button fullWidth disabled={selected.length === 0} onClick={() => router.push('/issue/verify')}>
          {selected.length > 0 ? `${selected.length}개 서류 신청하기` : '서류를 선택해 주세요'}
        </Button>
      </div>
    </div>
  )
}
