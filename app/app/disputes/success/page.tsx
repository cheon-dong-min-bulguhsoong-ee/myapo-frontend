'use client'
import { useRouter } from 'next/navigation'
import { CheckCircle } from 'lucide-react'
import { PageFooter } from '@/components/ui/page-footer'

export default function DisputeSuccessPage() {
  const router = useRouter()
  return (
    <div className="flex flex-col flex-1 min-h-full bg-base">
      <main className="flex-1 flex flex-col items-center justify-center px-5 text-center">
        <div className="w-16 h-16 rounded-full bg-success-soft flex items-center justify-center mb-3">
          <CheckCircle size={36} className="text-success" strokeWidth={2} />
        </div>
        <h1 className="text-[17px] font-bold text-ink mb-1">이의 신청이 접수됐어요</h1>
        <p className="text-[12px] leading-relaxed text-sub">
          영업일 기준 7일 이내에 답변드릴게요.<br />
          진행 상황은 이의 신청 목록에서 확인할 수 있어요.
        </p>
      </main>

      <PageFooter>
        <button onClick={() => router.push('/disputes')} className="btn-secondary">
          목록으로 돌아가기
        </button>
      </PageFooter>
    </div>
  )
}
