'use client'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/auth-context'
import { Button } from '@/components/ui/button'
import { useState } from 'react'

export default function LoginPage() {
  const router = useRouter()
  const { login } = useAuth()
  const [open, setOpen] = useState<'terms' | 'privacy' | null>(null)

  const handleLogin = () => {
    login()
    router.push('/persona-select')
  }

  return (
    <div className="flex flex-col min-h-dvh px-5" style={{ paddingTop: 'env(safe-area-inset-top)', paddingBottom: 'env(safe-area-inset-bottom)' }}>
      <div className="flex-1 flex flex-col items-center justify-center gap-3">
        <h1 className="text-4xl font-bold text-primary tracking-tight">MyApo</h1>
        <p className="text-sm text-ink-secondary text-center">
          해외 제출용 공공문서를<br />간편하게 발급하고 관리하세요
        </p>
      </div>
      <div className="pb-8 space-y-3">
        <Button fullWidth onClick={handleLogin}>
          <svg style={{ marginRight: 8 }} width="18" height="18" viewBox="0 0 48 48">
            <path fill="#FFC107" d="M43.6 20H24v8h11.3C33.6 33 29.3 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3 0 5.7 1.1 7.8 2.9l5.7-5.7C34.1 6.6 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.7-.4-4z"/>
            <path fill="#FF3D00" d="m6.3 14.7 6.6 4.8C14.5 15.5 18.9 12 24 12c3 0 5.7 1.1 7.8 2.9l5.7-5.7C34.1 6.6 29.3 4 24 4 16.3 4 9.7 8.4 6.3 14.7z"/>
            <path fill="#4CAF50" d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2C29.3 35.3 26.8 36 24 36c-5.3 0-9.6-3-11.3-7.3l-6.6 5.1C9.6 39.5 16.3 44 24 44z"/>
            <path fill="#1976D2" d="M43.6 20H24v8h11.3c-.8 2.3-2.4 4.2-4.4 5.6l6.2 5.2C40.7 35.7 44 30.3 44 24c0-1.3-.1-2.7-.4-4z"/>
          </svg>
          Google로 계속하기
        </Button>
        <div className="flex justify-center gap-4 text-xs text-ink-muted">
          <button onClick={() => setOpen('terms')} className="underline-offset-2 hover:underline">이용약관</button>
          <button onClick={() => setOpen('privacy')} className="underline-offset-2 hover:underline">개인정보처리방침</button>
        </div>
      </div>

      {open && (
        <div className="fixed inset-0 z-50 flex flex-col justify-end bg-black/40" onClick={() => setOpen(null)}>
          <div className="bg-paper rounded-t-2xl p-6 max-h-96 overflow-y-auto" onClick={e => e.stopPropagation()}>
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
