'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Checkbox } from '@toss/tds-mobile'
import { AppBar } from '@/components/ui/app-bar'
import { Button } from '@/components/ui/button'
import { documentCategories } from '@/lib/mock-data'

export default function IssueSelectPage() {
  const router = useRouter()
  const [selected, setSelected] = useState<string[]>([])

  const toggle = (item: string) => {
    setSelected(prev => (prev.includes(item) ? prev.filter(x => x !== item) : [...prev, item]))
  }

  const selectedCount = selected.length

  return (
    <div className="flex flex-col h-dvh bg-canvas">
      {/* 1) App bar */}
      <AppBar title="발급 서류 선택" />

      {/* 2) Header zone — title + subtitle */}
      <header className="shrink-0 px-5 pt-6 pb-4 bg-canvas">
        <h1 className="text-[22px] font-bold tracking-[-0.02em] text-ink leading-[1.3]">
          어떤 서류를 발급할까요?
        </h1>
        <p className="text-[15px] font-medium text-ink-secondary mt-2 leading-[1.4]">
          필요한 항목만 체크하면 돼요. 여러 종류를 함께 신청할 수 있어요.
        </p>
      </header>

      {/* 3) Selection zone — scrollable category list */}
      <main className="flex-1 overflow-y-auto px-5 py-4 space-y-6">
        {documentCategories.map(cat => {
          const catSelectedCount = cat.items.filter(i => selected.includes(i)).length

          return (
            <section
              key={cat.id}
              className="bg-paper rounded-[12px] overflow-hidden border border-hairline"
              style={{
                boxShadow: '0 1px 2px rgba(0,0,0,0.04), 0 1px 3px rgba(0,0,0,0.06)',
              }}
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
              <ul className="divide-y divide-hairline-soft">
                {cat.items.map(item => {
                  const checked = selected.includes(item)
                  return (
                    <li key={item}>
                      <label
                        className={`flex items-center gap-3.5 px-5 py-4 min-h-[56px] cursor-pointer transition-colors active:bg-canvas ${
                          checked ? 'bg-primary-soft' : ''
                        }`}
                      >
                        <Checkbox.Line checked={checked} onCheckedChange={() => toggle(item)} size={22} />
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

      {/* 4) Footer zone — sticky CTA */}
      <footer
        className="shrink-0 px-5 pt-3 bg-paper"
        style={{
          paddingBottom: 'calc(env(safe-area-inset-bottom) + 16px)',
          borderTop: '1px solid var(--color-hairline)',
        }}
      >
        <Button
          fullWidth
          disabled={selectedCount === 0}
          onClick={() => router.push('/issue/verify')}
        >
          {selectedCount > 0 ? `${selectedCount}개 서류 발급 신청하기` : '서류를 선택해 주세요'}
        </Button>
      </footer>
    </div>
  )
}
