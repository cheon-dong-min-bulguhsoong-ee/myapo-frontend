'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { AppBar } from '@/components/ui/app-bar'
import { Button } from '@/components/ui/button'
import { PageHeader } from '@/components/ui/page-header'
import { PageFooter } from '@/components/ui/page-footer'
import { documentCategories } from '@/lib/mock-data'

export default function IssueSelectPage() {
  const router = useRouter()
  const [selected, setSelected] = useState<string[]>([])

  const toggle = (item: string) => {
    setSelected(prev => (prev.includes(item) ? prev.filter(x => x !== item) : [...prev, item]))
  }

  const selectedCount = selected.length

  return (
    <div className="flex flex-col h-full bg-canvas">
      <AppBar title="발급 서류 선택" />
      <PageHeader
        title="어떤 서류를 발급할까요?"
        subtitle="필요한 항목만 체크하면 돼요. 여러 종류를 함께 신청할 수 있어요."
      />

      <main className="flex-1 overflow-y-auto px-5 py-4 space-y-6">
        {documentCategories.map(cat => {
          const catSelectedCount = cat.items.filter(i => selected.includes(i)).length

          return (
            <section
              key={cat.id}
              className="bg-paper rounded-2xl overflow-hidden border border-hairline"
              style={{ boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}
            >
              <header className="px-5 py-4 border-b border-hairline flex justify-between items-center">
                <h2 className="text-[17px] font-bold text-ink tracking-[-0.01em] leading-snug">
                  {cat.label}
                </h2>
                {catSelectedCount > 0 && (
                  <span className="text-[13px] font-semibold text-primary">
                    {catSelectedCount}개 선택됨
                  </span>
                )}
              </header>
              <ul>
                {cat.items.map((item, idx) => {
                  const checked = selected.includes(item)
                  return (
                    <li key={item} style={idx > 0 ? { borderTop: '1px solid var(--color-hairline)' } : undefined}>
                      <label
                        className={`flex items-center gap-3.5 px-5 py-4 min-h-[56px] cursor-pointer transition-colors active:bg-canvas ${
                          checked ? 'bg-primary-soft' : ''
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={() => toggle(item)}
                          className="h-[22px] w-[22px] shrink-0 accent-primary"
                        />
                        <span
                          className={`flex-1 text-[15px] leading-normal ${
                            checked ? 'font-semibold text-primary' : 'font-medium text-ink'
                          }`}
                        >
                          {item}
                        </span>
                      </label>
                    </li>
                  )
                })}
              </ul>
            </section>
          )
        })}
      </main>

      <PageFooter>
        <Button
          fullWidth
          disabled={selectedCount === 0}
          onClick={() => router.push('/issue/verify')}
        >
          {selectedCount > 0 ? `${selectedCount}개 서류 발급 신청하기` : '서류를 선택해 주세요'}
        </Button>
      </PageFooter>
    </div>
  )
}
