'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { AppBar } from '@/components/ui/app-bar'
import { Button } from '@/components/ui/button'
import { PageHeader } from '@/components/ui/page-header'
import { PageFooter } from '@/components/ui/page-footer'
import { SelectableCard } from '@/components/ui/selectable-card'
import { TextArea } from '@/components/ui/text-area'

const stages = ['발급 신청', '번역·공증', '아포스티유', '발급 완료']
const reasons = ['번역 오류', '서류 분실', '처리 지연', '기관 반려', '기타']

export default function DisputeNewPage() {
  const router = useRouter()
  const [stage, setStage] = useState('')
  const [reason, setReason] = useState('')
  const [detail, setDetail] = useState('')

  const canSubmit = stage && reason && detail.length >= 10

  return (
    <div className="flex flex-col h-full bg-canvas">
      <AppBar title="이의 신청" />
      <PageHeader title="어떤 문제가 있었나요?" subtitle="자세히 알려주시면 빠르게 처리해 드릴게요" />

      <main className="flex-1 overflow-y-auto px-5 pb-6 space-y-6">
        <section className="space-y-2">
          <p className="text-[14px] font-semibold text-ink px-1">문제 발생 단계</p>
          <div className="grid grid-cols-2 gap-2">
            {stages.map(s => (
              <SelectableCard key={s} selected={stage === s} onClick={() => setStage(s)} className="!p-3">
                <p className={`text-sm font-semibold text-center ${stage === s ? 'text-primary' : 'text-ink'}`}>
                  {s}
                </p>
              </SelectableCard>
            ))}
          </div>
        </section>

        <section className="space-y-2">
          <p className="text-[14px] font-semibold text-ink px-1">이의 사유</p>
          <div className="space-y-2">
            {reasons.map(r => (
              <SelectableCard key={r} selected={reason === r} onClick={() => setReason(r)} className="!p-3">
                <p className={`text-sm font-semibold ${reason === r ? 'text-primary' : 'text-ink'}`}>
                  {r}
                </p>
              </SelectableCard>
            ))}
          </div>
        </section>

        <TextArea
          label="상세 내용"
          value={detail}
          onChange={e => setDetail(e.target.value)}
          placeholder="불편하셨던 내용을 자세히 설명해 주세요 (10자 이상)"
          showCount
        />
      </main>

      <PageFooter>
        <Button fullWidth variant="danger" disabled={!canSubmit} onClick={() => router.push('/disputes/success')}>
          이의 신청하기
        </Button>
      </PageFooter>
    </div>
  )
}
