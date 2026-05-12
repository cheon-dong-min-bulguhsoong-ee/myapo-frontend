'use client'
import { useRouter, useSearchParams } from 'next/navigation'
import { Suspense, useEffect, useMemo, useState } from 'react'
import { LogIn, Loader2, ShieldCheck } from 'lucide-react'
import { useAuth } from '@/contexts/auth-context'
import { Button } from '@/components/ui/button'

function LoginView() {
  const router = useRouter()
  const params = useSearchParams()
  const { login, isLoggedIn, isReady, accessToken } = useAuth()
  const [open, setOpen] = useState<'terms' | 'privacy' | null>(null)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const nextPath = useMemo(() => {
    const next = params.get('next')
    return next && next.startsWith('/') && !next.startsWith('//') ? next : '/persona-select'
  }, [params])
  const expiredMessage = params.get('reason') === 'expired'
    ? '세션이 만료됐어요. 다시 로그인해 주세요.'
    : null

  useEffect(() => {
    if (isReady && isLoggedIn && accessToken) router.replace(nextPath)
  }, [accessToken, isReady, isLoggedIn, nextPath, router])

  const handleLogin = async () => {
    if (busy || !isReady) return
    setBusy(true)
    setError(null)
    const ok = await login()
    setBusy(false)
    if (ok) {
      router.push(nextPath)
    } else {
      setError('로그인이 취소되었거나 실패했어요. 다시 시도해 주세요.')
    }
  }

  return (
    <div className="flex flex-col flex-1 min-h-full bg-base">
      <div className="flex-1 flex flex-col items-center justify-center px-5 gap-3">
        <div className="w-16 h-16 rounded-full bg-primary-soft flex items-center justify-center mb-2">
          <ShieldCheck size={32} className="text-primary" strokeWidth={2} />
        </div>
        <h1 className="text-[28px] font-bold text-primary">MyApo</h1>
        <p className="text-[12px] leading-relaxed text-sub text-center">
          해외 제출용 공공문서를<br />간편하게 발급하고 관리하세요
        </p>
      </div>

      <div className="px-5 pb-8 pt-3">
        {(error || expiredMessage) && (
          <div className="mb-3 text-[12px] leading-relaxed text-danger text-center">{error ?? expiredMessage}</div>
        )}
        <button
          onClick={handleLogin}
          disabled={busy || !isReady}
          className="btn-primary mb-3 disabled:opacity-60"
        >
          {busy ? (
            <>
              <Loader2 size={18} strokeWidth={2.2} className="animate-spin" />
              로그인 중...
            </>
          ) : (
            <>
              <LogIn size={18} strokeWidth={2.2} />
              Google로 계속하기
            </>
          )}
        </button>
        <div className="flex justify-center gap-4 text-[12px] text-muted">
          <button onClick={() => setOpen('terms')} className="underline-offset-2 hover:underline">이용약관</button>
          <span aria-hidden>·</span>
          <button onClick={() => setOpen('privacy')} className="underline-offset-2 hover:underline">개인정보처리방침</button>
        </div>
      </div>

      {open && (
        <div
          className="bottom-sheet-overlay fixed"
          onClick={() => setOpen(null)}
        >
          <div className="bottom-sheet" onClick={e => e.stopPropagation()}>
            <div className="bottom-sheet-handle" />
            <h2 className="text-[17px] font-bold text-ink mb-3">
              {open === 'terms' ? '이용약관' : '개인정보처리방침'}
            </h2>
            <p className="text-[12px] leading-relaxed text-sub max-h-72 overflow-y-auto mb-4">
              {open === 'terms'
                ? '본 서비스 이용약관은 MyApo가 제공하는 서비스 이용에 관한 조건 및 절차, 이용자와 당사의 권리·의무 및 책임사항을 규정합니다.'
                : '개인정보 처리방침에 따라 수집한 개인정보는 서비스 제공 목적으로만 사용되며, 개인정보보호법 제17조에 따라 처리됩니다.'}
            </p>
            <Button variant="secondary" onClick={() => setOpen(null)}>닫기</Button>
          </div>
        </div>
      )}
    </div>
  )
}

export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginView />
    </Suspense>
  )
}
