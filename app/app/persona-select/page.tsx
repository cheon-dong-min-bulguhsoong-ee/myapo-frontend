'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { usePersona } from '@/contexts/persona-context'
import { Button } from '@/components/ui/button'
import { AppBar } from '@/components/ui/app-bar'

export default function PersonaSelectPage() {
  const [selected, setSelected] = useState<'korean' | 'foreign'>('korean')
  const { setPersona } = usePersona()
  const router = useRouter()

  const handleContinue = () => {
    setPersona(selected)
    router.push('/home')
  }

  return (
    <div className="flex flex-col min-h-full" style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}>
      <AppBar title="언어 선택" showBack={false} />
      <div className="flex-1 flex flex-col justify-center px-5 gap-6">
        <div>
          <h2 className="text-xl font-bold text-ink mb-1">어떤 분이신가요?</h2>
          <p className="text-sm text-ink-secondary">서비스 언어가 설정됩니다</p>
        </div>
        <div className="space-y-3">
          {([
            { value: 'korean', label: '한국인', sublabel: 'Korean' },
            { value: 'foreign', label: '외국인', sublabel: 'Foreigner' },
          ] as const).map(({ value, label, sublabel }) => (
            <button
              key={value}
              onClick={() => setSelected(value)}
              className={`w-full p-4 rounded-xl border-2 text-left transition-colors
                ${selected === value ? 'border-primary bg-primary-soft' : 'border-hairline bg-paper'}`}
            >
              <p className="font-bold text-ink">{label}</p>
              <p className="text-sm text-ink-secondary">{sublabel}</p>
            </button>
          ))}
        </div>
      </div>
      <div className="px-5 pb-6">
        <Button fullWidth onClick={handleContinue}>계속하기</Button>
      </div>
    </div>
  )
}
