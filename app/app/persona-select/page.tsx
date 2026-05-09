'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { usePersona } from '@/contexts/persona-context'
import { AppBar } from '@/components/ui/app-bar'
import { Button } from '@/components/ui/button'
import { PageFooter } from '@/components/ui/page-footer'
import { IconBox } from '@/components/ui/icon-box'
import { User, Globe, Check } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

interface Persona {
  value: 'korean' | 'foreign'
  label: string
  sublabel: string
  icon: LucideIcon
}

const personas: Persona[] = [
  { value: 'korean',  label: '한국인', sublabel: 'Korean',    icon: User },
  { value: 'foreign', label: '외국인', sublabel: 'Foreigner', icon: Globe },
]

export default function PersonaSelectPage() {
  const [selected, setSelected] = useState<Persona['value']>('korean')
  const { setPersona } = usePersona()
  const router = useRouter()

  const handleContinue = () => {
    setPersona(selected)
    router.push('/home')
  }

  return (
    <div className="flex flex-col h-full bg-canvas">
      <AppBar wordmark showBack={false} />

      <main className="flex-1 px-5 flex flex-col justify-center">
        <div className="text-center">
          <h1 className="text-[32px] font-bold leading-[1.18] tracking-[-0.04em] text-ink text-balance">
            어떤 분이신가요?
          </h1>
          <p className="ds-body text-ink-secondary mt-3 text-pretty">
            서비스 언어를 자동으로 맞춰드릴게요
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3 mt-10">
          {personas.map(({ value, label, sublabel, icon: Icon }) => {
            const isSelected = selected === value
            return (
              <button
                key={value}
                type="button"
                role="radio"
                aria-checked={isSelected}
                onClick={() => setSelected(value)}
                className={`press relative h-40 rounded-[20px] p-5 flex flex-col items-center justify-center text-center transition-all duration-150 ease-out
                  ${isSelected
                    ? 'bg-primary-soft border-2 border-primary shadow-[0_4px_14px_rgba(49,130,246,0.14)]'
                    : 'bg-paper border-2 border-hairline-soft hover:border-hairline'}`}
              >
                {isSelected && (
                  <span className="absolute top-3 right-3 w-6 h-6 rounded-full bg-primary flex items-center justify-center">
                    <Check size={14} className="text-white" strokeWidth={3} />
                  </span>
                )}
                <IconBox icon={Icon} tone="blue" size="lg" />
                <p className={`ds-headline mt-4 ${isSelected ? 'text-primary' : 'text-ink'}`}>
                  {label}
                </p>
                <p className="font-mono text-[12px] text-ink-muted mt-0.5">
                  {sublabel}
                </p>
              </button>
            )
          })}
        </div>

        <p className="ds-caption text-ink-muted mt-6 text-center">
          나중에 설정에서 바꿀 수 있어요
        </p>
      </main>

      <PageFooter>
        <Button fullWidth onClick={handleContinue}>계속하기</Button>
      </PageFooter>
    </div>
  )
}
