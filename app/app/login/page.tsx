'use client'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/auth-context'
import { Button } from '@/components/ui/button'
import { useState } from 'react'
import { LogIn } from 'lucide-react'

export default function LoginPage() {
  const router = useRouter()
  const { login } = useAuth()
  const [open, setOpen] = useState<'terms' | 'privacy' | null>(null)

  const handleLogin = () => {
    login()
    router.push('/persona-select')
  }

  return (
    <div className="safe-page flex flex-col min-h-full px-5">
      <div className="flex-1 flex flex-col items-center justify-center gap-3">
        <h1 className="ds-title text-primary">MyApo</h1>
        <p className="text-sm text-ink-secondary text-center">
          해외 제출용 공공문서를<br />간편하게 발급하고 관리하세요
        </p>
      </div>
      <div className="pb-8 space-y-3">
        <Button fullWidth onClick={handleLogin}>
          <LogIn size={18} />
          Google로 계속하기
        </Button>
        <div className="flex justify-center gap-4 text-xs text-ink-muted">
          <button onClick={() => setOpen('terms')} className="underline-offset-2 hover:underline">이용약관</button>
          <button onClick={() => setOpen('privacy')} className="underline-offset-2 hover:underline">개인정보처리방침</button>
        </div>
      </div>

      {open && (
        <div className="ds-scrim fixed inset-0 z-50 flex flex-col justify-end" onClick={() => setOpen(null)}>
          <div className="ds-sheet p-6 max-h-96 overflow-y-auto" onClick={e => e.stopPropagation()}>
            <h2 className="text-base font-bold mb-4">{open === 'terms' ? '이용약관' : '개인정보처리방침'}</h2>
            <p className="text-sm text-ink-secondary leading-relaxed">
              {open === 'terms'
                ? '본 서비스 이용약관은 MyApo가 제공하는 서비스 이용에 관한 조건 및 절차, 이용자와 당사의 권리·의무 및 책임사항을 규정합니다.'
                : '개인정보 처리방침에 따라 수집한 개인정보는 서비스 제공 목적으로만 사용되며, 개인정보보호법 제17조에 따라 처리됩니다.'}
            </p>
            <div className="mt-4">
              <Button fullWidth variant="secondary" onClick={() => setOpen(null)}>닫기</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
