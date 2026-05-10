'use client'
import { useRouter } from 'next/navigation'
import { Send } from 'lucide-react'
import { AppBar } from '@/components/ui/app-bar'
import { Pill } from '@/components/ui/pill'
import { StepTimeline } from '@/components/ui/step-timeline'
import { ProgressFill } from '@/components/ui/progress-fill'
import { PageFooter } from '@/components/ui/page-footer'
import { Spinner } from '@/components/ui/spinner'

const deliveryStages = [
  { label: '제출 요청',     status: 'done' as const },
  { label: '서류 전송 중',  status: 'active' as const },
  { label: '기관 접수 확인', status: 'wait' as const },
  { label: '처리 완료',      status: 'wait' as const },
]

export default function DeliveryPage() {
  const router = useRouter()

  return (
    <div className="flex flex-col flex-1 min-h-full">
      <AppBar
        title="해외 제출 현황"
        badges={<Pill variant="testnet" size="sm">Testnet</Pill>}
      />

      <main className="app-content flex-1 overflow-y-auto">
        <div className="flex flex-col items-center pt-4 pb-3 gap-2">
          <div className="w-16 h-16 rounded-full bg-primary-soft flex items-center justify-center">
            <Spinner size="lg" tone="primary" />
          </div>
          <div className="text-[17px] font-bold text-ink text-center">현재 전송 중이에요</div>
          <div className="text-[12px] leading-relaxed text-sub text-center">기관 접수까지<br />영업일 기준 1~3일 소요됩니다</div>
        </div>

        <div className="card mb-3">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[15px] font-bold text-ink">전송 단계</span>
            <span className="text-[12px] font-bold text-primary">2/4 진행</span>
          </div>
          <div className="mt-2 mb-2">
            <StepTimeline stages={deliveryStages} />
          </div>
          <ProgressFill value={45} />
          <div className="text-[12px] text-muted mt-1 text-right">서류 패키지 전송 중</div>
        </div>

        <div className="card mb-3">
          <div className="flex items-center gap-2 mb-1">
            <Send size={14} className="text-primary" strokeWidth={2.2} />
            <span className="text-[15px] font-bold text-ink">제출 기관</span>
          </div>
          <div className="text-[15px] font-bold text-ink">US Embassy Seoul</div>
          <div className="text-[12px] text-sub mt-0.5">미국 영사관 · 비자 신청용</div>
          <div className="font-mono text-[10px] text-muted mt-1">US-EMB-SEO</div>
        </div>
      </main>

      <PageFooter>
        <button onClick={() => router.push('/home')} className="btn-secondary">
          홈으로
        </button>
      </PageFooter>
    </div>
  )
}
