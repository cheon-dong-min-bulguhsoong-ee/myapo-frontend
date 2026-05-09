'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { AppBar } from '@/components/ui/app-bar'
import { Button } from '@/components/ui/button'

const stages = ['발급 신청', '번역·공증', '아포스티유', '발급 완료']
const reasons = ['번역 오류', '서류 분실', '처리 지연', '기관 반려', '기타']

export default function DisputeNewPage() {
  const router = useRouter()
  const [stage, setStage] = useState('')
  const [reason, setReason] = useState('')
  const [detail, setDetail] = useState('')

  const canSubmit = stage && reason && detail.length >= 10

  return (
    <div className="flex flex-col min-h-dvh" style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}>
      <AppBar title="이의 신청" />
      <main className="flex-1 px-5 py-4 space-y-6 overflow-y-auto">
        <div>
          <p className="text-sm font-semibold text-ink mb-2">문제 발생 단계</p>
          <div className="grid grid-cols-2 gap-2">
            {stages.map(s => (
              <button key={s} onClick={() => setStage(s)}
                className={`p-3 rounded-xl border text-sm font-medium transition-colors
                  ${stage === s ? 'border-primary bg-primary-soft text-primary' : 'border-hairline bg-paper text-ink'}`}>
                {s}
              </button>
            ))}
          </div>
        </div>
        <div>
          <p className="text-sm font-semibold text-ink mb-2">이의 사유</p>
          <div className="space-y-2">
            {reasons.map(r => (
              <button key={r} onClick={() => setReason(r)}
                className={`w-full p-3 rounded-xl border text-sm text-left font-medium transition-colors
                  ${reason === r ? 'border-primary bg-primary-soft text-primary' : 'border-hairline bg-paper text-ink'}`}>
                {r}
              </button>
            ))}
          </div>
        </div>
        <div>
          <p className="text-sm font-semibold text-ink mb-2">상세 내용</p>
          <textarea
            value={detail}
            onChange={e => setDetail(e.target.value)}
            placeholder="불편하셨던 내용을 자세히 설명해 주세요 (10자 이상)"
            className="w-full h-32 p-3 rounded-xl border border-hairline bg-paper text-sm text-ink resize-none focus:outline-none focus:border-primary"
          />
          <p className="text-xs text-ink-muted mt-1">{detail.length}자</p>
        </div>
      </main>
      <div className="px-5 pb-6">
        <Button fullWidth variant="danger" disabled={!canSubmit} onClick={() => router.push('/disputes/success')}>
          이의 신청하기
        </Button>
      </div>
    </div>
  )
}
