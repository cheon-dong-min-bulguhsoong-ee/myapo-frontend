'use client'
import { useRouter } from 'next/navigation'
import { AppBar } from '@/components/ui/app-bar'
import { StepDot } from '@/components/ui/step-dot'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { PageHeader } from '@/components/ui/page-header'
import { PageFooter } from '@/components/ui/page-footer'

const deliveryStages = [
  { label: '제출 요청', status: 'done' as const },
  { label: '서류 전송 중', status: 'active' as const },
  { label: '기관 접수 확인', status: 'wait' as const },
  { label: '처리 완료', status: 'wait' as const },
]

export default function DeliveryPage() {
  const router = useRouter()
  return (
    <div className="flex flex-col h-full bg-canvas">
      <AppBar title="해외 제출 현황" />
      <PageHeader title="현재 전송 중이에요" subtitle="기관 접수까지 영업일 기준 1~3일 소요됩니다" />

      <main className="flex-1 overflow-y-auto px-5 pb-6 space-y-4">
        <Card>
          <p className="text-xs text-ink-muted mb-1">제출 기관</p>
          <p className="font-bold text-ink">US Embassy Seoul</p>
          <p className="text-sm text-ink-secondary mt-0.5">서류 전송 중</p>
        </Card>

        <Card>
          <h3 className="font-bold text-sm text-ink mb-4">전송 단계</h3>
          {deliveryStages.map((s, i) => (
            <StepDot key={i} status={s.status} label={s.label} isLast={i === deliveryStages.length - 1} />
          ))}
        </Card>
      </main>

      <PageFooter>
        <Button fullWidth variant="secondary" onClick={() => router.push('/home')}>
          홈으로
        </Button>
      </PageFooter>
    </div>
  )
}
