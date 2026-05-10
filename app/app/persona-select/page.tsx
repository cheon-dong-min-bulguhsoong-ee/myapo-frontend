'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { User, Globe, Check } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { usePersona } from '@/contexts/persona-context'
import { AppBar } from '@/components/ui/app-bar'
import { PageFooter } from '@/components/ui/page-footer'

interface Persona {
  value: 'korean' | 'foreign'
  label: string
  sublabel: string
  icon: LucideIcon
}

const personas: Persona[] = [
  { value: 'korean',  label: '한국인',   sublabel: 'Korean',    icon: User },
  { value: 'foreign', label: '외국인',   sublabel: 'Foreigner', icon: Globe },
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
    <div className="flex flex-col flex-1 min-h-full bg-base">
      <AppBar wordmark showBack={false} />

      <main className="flex-1 px-5 pt-7 pb-5 flex flex-col">
        <div className="text-center mb-7">
          <h1 className="text-[22px] font-bold text-ink leading-snug tracking-[-0.02em]">
            어떤 분이신가요?
          </h1>
          <p className="text-[12px] leading-relaxed text-sub mt-2">
            서비스 언어를 자동으로 맞춰드릴게요
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {personas.map(({ value, label, sublabel, icon: Icon }) => {
            const isSelected = selected === value
            return (
              <button
                key={value}
                type="button"
                role="radio"
                aria-checked={isSelected}
                onClick={() => setSelected(value)}
                className={`selectable-card press relative flex flex-col items-center justify-center text-center ${isSelected ? 'selected' : ''}`}
                style={{ height: 156 }}
              >
                {isSelected && (
                  <span className="absolute top-3 right-3 w-6 h-6 rounded-full bg-primary flex items-center justify-center">
                    <Check size={14} className="text-white" strokeWidth={3} />
                  </span>
                )}
                <div className={`w-12 h-12 rounded-full flex items-center justify-center ${isSelected ? 'bg-white' : 'bg-primary-soft'}`}>
                  <Icon size={24} strokeWidth={2} className="text-primary" />
                </div>
                <p className={`text-[15px] font-bold mt-3 ${isSelected ? 'text-primary' : 'text-ink'}`}>
                  {label}
                </p>
                <p className="font-mono text-[12px] text-muted mt-0.5">
                  {sublabel}
                </p>
              </button>
            )
          })}
        </div>

        <p className="text-[12px] leading-relaxed text-muted mt-6 text-center">
          나중에 설정에서 바꿀 수 있어요
        </p>
      </main>

      <PageFooter>
        <button onClick={handleContinue} className="btn-primary">계속하기</button>
      </PageFooter>
    </div>
  )
}
