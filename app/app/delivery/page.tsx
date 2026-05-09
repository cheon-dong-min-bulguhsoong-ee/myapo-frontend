'use client'
import { useRouter } from 'next/navigation'
import { AppBar } from '@/components/ui/app-bar'
import { StepDot } from '@/components/ui/step-dot'
import { Button } from '@/components/ui/button'

const deliveryStages = [
  { label: '제출 요청', status: 'done' as const },
  { label: '서류 전송 중', status: 'active' as const },
  { label: '기관 접수 확인', status: 'wait' as const },
  { label: '처리 완료', status: 'wait' as const },
]

export default function DeliveryPage() {
  const router = useRouter()
  return (
    <div className="flex flex-col min-h-full" style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}>
      <AppBar title="해외 제출 현황" />
      <main className="flex-1 px-5 py-6 space-y-6">
        <div className="bg-paper rounded-2xl border border-hairline p-5" style={{ boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
          <p className="text-xs text-ink-muted mb-1">제출 기관</p>
          <p className="font-bold text-ink">US Embassy Seoul</p>
          <p className="text-sm text-ink-secondary mt-0.5">서류 전송 중</p>
        </div>
        <div className="bg-paper rounded-2xl border border-hairline p-5" style={{ boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
          <h3 className="font-bold text-sm text-ink mb-4">전송 단계</h3>
          {deliveryStages.map((s, i) => (
            <StepDot key={i} status={s.status} label={s.label} isLast={i === deliveryStages.length - 1} />
          ))}
        </div>
      </main>
      <div className="px-5 pb-6">
        <Button fullWidth variant="secondary" onClick={() => router.push('/home')}>홈으로</Button>
      </div>
    </div>
  )
}
