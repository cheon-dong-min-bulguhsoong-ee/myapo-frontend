'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { usePersona } from '@/contexts/persona-context'
import { Button } from '@/components/ui/button'
import { AppBar } from '@/components/ui/app-bar'
import { PageHeader } from '@/components/ui/page-header'
import { PageFooter } from '@/components/ui/page-footer'
import { SelectableCard } from '@/components/ui/selectable-card'

export default function PersonaSelectPage() {
  const [selected, setSelected] = useState<'korean' | 'foreign'>('korean')
  const { setPersona } = usePersona()
  const router = useRouter()

  const handleContinue = () => {
    setPersona(selected)
    router.push('/home')
  }

  return (
    <div className="flex flex-col h-full bg-canvas">
      <AppBar title="언어 선택" showBack={false} />
      <PageHeader size="hero" title="어떤 분이신가요?" subtitle="서비스 언어가 자동으로 설정됩니다" />

      <main className="flex-1 overflow-y-auto px-5 pb-6 space-y-3">
        {([
          { value: 'korean', label: '한국인', sublabel: 'Korean' },
          { value: 'foreign', label: '외국인', sublabel: 'Foreigner' },
        ] as const).map(({ value, label, sublabel }) => (
          <SelectableCard
            key={value}
            selected={selected === value}
            onClick={() => setSelected(value)}
          >
              <p className={`ds-body font-bold ${selected === value ? 'text-primary' : 'text-ink'}`}>
              {label}
            </p>
            <p className="text-sm text-ink-secondary mt-0.5">{sublabel}</p>
          </SelectableCard>
        ))}
      </main>

      <PageFooter>
        <Button fullWidth onClick={handleContinue}>계속하기</Button>
      </PageFooter>
    </div>
  )
}
