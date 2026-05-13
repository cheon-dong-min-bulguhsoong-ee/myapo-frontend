'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { CheckCircle, Send } from 'lucide-react'
import { AppBar } from '@/components/ui/app-bar'
import { AppContent } from '@/components/ui/app-content'
import { Pill } from '@/components/ui/pill'
import { StepTimeline } from '@/components/ui/step-timeline'
import { ProgressFill } from '@/components/ui/progress-fill'
import { PageFooter } from '@/components/ui/page-footer'
import { Spinner } from '@/components/ui/spinner'

const DELIVERY_DURATION_MS = 10000
const PROGRESS_TICK_MS = 100

export default function DeliveryPage() {
  const router = useRouter()
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const startedAt = Date.now()
    const intervalId = setInterval(() => {
      const elapsed = Date.now() - startedAt
      const nextProgress = Math.min(100, (elapsed / DELIVERY_DURATION_MS) * 100)

      setProgress(nextProgress)

      if (nextProgress >= 100) {
        clearInterval(intervalId)
      }
    }, PROGRESS_TICK_MS)

    return () => clearInterval(intervalId)
  }, [])

  const completed = progress >= 100
  const deliveryStages = completed
    ? [
        { label: '제출 요청',     status: 'done' as const },
        { label: '서류 전송 중',  status: 'done' as const },
        { label: '기관 접수 확인', status: 'done' as const },
        { label: '처리 완료',      status: 'done' as const },
      ]
    : [
        { label: '제출 요청',     status: 'done' as const },
        { label: '서류 전송 중',  status: 'active' as const },
        { label: '기관 접수 확인', status: 'wait' as const },
        { label: '처리 완료',      status: 'wait' as const },
      ]

  return (
    <div className="flex flex-col flex-1 min-h-full">
      <AppBar
        title="해외 제출 현황"
        badges={<Pill variant="testnet" size="sm">Testnet</Pill>}
      />

      <AppContent>
        <div className="flex flex-col items-center pt-4 pb-3 gap-2">
          <div className={`w-16 h-16 rounded-full flex items-center justify-center ${completed ? 'bg-success-soft' : 'bg-primary-soft'}`}>
            {completed ? (
              <CheckCircle size={36} className="text-success" strokeWidth={2} />
            ) : (
              <Spinner size="lg" tone="primary" />
            )}
          </div>
          <div className="text-[17px] font-bold text-ink text-center">
            {completed ? '전송완료되었어요.' : '현재 전송 중이에요'}
          </div>
          <div className="text-[12px] leading-relaxed text-sub text-center">
            {completed ? (
              '기관 접수 확인까지 완료됐어요'
            ) : (
              <>
                서류 패키지를 안전하게 보내고 있어요<br />잠시만 기다려 주세요
              </>
            )}
          </div>
        </div>

        <div className="card mb-3">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[15px] font-bold text-ink">전송 단계</span>
            <span className={`text-[12px] font-bold ${completed ? 'text-success' : 'text-primary'}`}>
              {completed ? '4/4 완료' : '2/4 진행'}
            </span>
          </div>
          <div className="mt-2 mb-2">
            <StepTimeline stages={deliveryStages} />
          </div>
          <ProgressFill value={progress} />
          <div className={`text-[12px] mt-1 text-right ${completed ? 'text-success font-bold' : 'text-muted'}`}>
            {completed ? '기관 접수 확인 완료' : '서류 패키지 전송 중'}
          </div>
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
      </AppContent>

      <PageFooter>
        <button onClick={() => router.push('/home')} className="btn-secondary">
          홈으로
        </button>
      </PageFooter>
    </div>
  )
}
