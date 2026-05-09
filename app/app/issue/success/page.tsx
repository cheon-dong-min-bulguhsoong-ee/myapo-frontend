'use client'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { CheckCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function IssueSuccessPage() {
  const router = useRouter()

  useEffect(() => {
    const t = setTimeout(() => router.push('/history'), 5000)
    return () => clearTimeout(t)
  }, [router])

  return (
    <div className="flex flex-col h-dvh bg-canvas">
      <main className="flex-1 flex flex-col items-center justify-center px-5 text-center">
        <CheckCircle size={64} className="text-success mb-4" />
        <h1 className="text-xl font-bold text-ink mb-2">발급 신청이 완료됐어요</h1>
        <p className="text-sm text-ink-secondary">
          서류 발급에는 보통 1–3 영업일이 소요됩니다.<br />
          완료되면 알림을 보내드릴게요.
        </p>
      </main>

      <footer
        className="shrink-0 px-5 pt-3 bg-paper"
        style={{
          paddingBottom: 'calc(env(safe-area-inset-bottom) + 16px)',
          borderTop: '1px solid var(--color-hairline)',
        }}
      >
        <Button fullWidth onClick={() => router.push('/history')}>
          발급 현황 보기
        </Button>
      </footer>
    </div>
  )
}
