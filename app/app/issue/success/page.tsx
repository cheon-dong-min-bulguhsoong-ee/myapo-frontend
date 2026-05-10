'use client'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { CheckCircle } from 'lucide-react'
import { PageFooter } from '@/components/ui/page-footer'

export default function IssueSuccessPage() {
  const router = useRouter()

  useEffect(() => {
    const t = setTimeout(() => router.push('/history'), 5000)
    return () => clearTimeout(t)
  }, [router])

  return (
    <div className="flex flex-col flex-1 min-h-full bg-base">
      <main className="flex-1 flex flex-col items-center justify-center px-5 text-center">
        <div className="w-16 h-16 rounded-full bg-success-soft flex items-center justify-center mb-3">
          <CheckCircle size={36} className="text-success" strokeWidth={2} />
        </div>
        <h1 className="text-[17px] font-bold text-ink mb-1">발급 신청이 완료됐어요</h1>
        <p className="text-[12px] leading-relaxed text-sub">
          서류 발급에는 보통 1–3 영업일이 소요됩니다.<br />
          완료되면 알림을 보내드릴게요.
        </p>
      </main>

      <PageFooter>
        <button onClick={() => router.push('/history')} className="btn-primary">
          발급 현황 보기
        </button>
      </PageFooter>
    </div>
  )
}
