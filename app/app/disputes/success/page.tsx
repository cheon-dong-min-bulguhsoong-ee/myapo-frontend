'use client'
import { useRouter } from 'next/navigation'
import { CheckCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function DisputeSuccessPage() {
  const router = useRouter()
  return (
    <div className="flex flex-col min-h-dvh items-center justify-center px-5 text-center" style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}>
      <CheckCircle size={64} className="text-success mb-4" />
      <h1 className="text-xl font-bold text-ink mb-2">이의 신청이 접수됐어요</h1>
      <p className="text-sm text-ink-secondary mb-8">
        영업일 기준 7일 이내에 답변드릴게요.<br />진행 상황은 이의 신청 목록에서 확인할 수 있어요.
      </p>
      <Button fullWidth variant="secondary" onClick={() => router.push('/disputes')}>목록으로 돌아가기</Button>
    </div>
  )
}
