'use client'
import { useRouter } from 'next/navigation'
import { CheckCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { PageFooter } from '@/components/ui/page-footer'

export default function DisputeSuccessPage() {
  const router = useRouter()
  return (
    <div className="flex flex-col h-full bg-canvas">
      <main className="flex-1 flex flex-col items-center justify-center px-5 text-center">
        <CheckCircle size={64} className="text-success mb-4" />
        <h1 className="text-xl font-bold text-ink mb-2">이의 신청이 접수됐어요</h1>
        <p className="text-sm text-ink-secondary leading-relaxed">
          영업일 기준 7일 이내에 답변드릴게요.<br />
          진행 상황은 이의 신청 목록에서 확인할 수 있어요.
        </p>
      </main>

      <PageFooter>
        <Button fullWidth variant="secondary" onClick={() => router.push('/disputes')}>
          목록으로 돌아가기
        </Button>
      </PageFooter>
    </div>
  )
}
