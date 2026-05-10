'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Check } from 'lucide-react'
import { AppBar } from '@/components/ui/app-bar'
import { Pill } from '@/components/ui/pill'
import { TextArea } from '@/components/ui/text-area'
import { PageFooter } from '@/components/ui/page-footer'

const stages = ['발급 신청', '번역·공증', '아포스티유', '발급 완료']
const reasons = ['번역 오류', '서류 분실', '처리 지연', '기관 반려', '기타']

export default function DisputeNewPage() {
  const router = useRouter()
  const [stage, setStage] = useState('')
  const [reason, setReason] = useState('')
  const [detail, setDetail] = useState('')

  const canSubmit = stage && reason && detail.length >= 10

  return (
    <div className="flex flex-col flex-1 min-h-full">
      <AppBar
        title="이의 신청"
        badges={<Pill variant="testnet" size="sm">Testnet</Pill>}
      />

      <main className="app-content flex-1 overflow-y-auto">
        <div className="text-[15px] font-bold text-ink mb-1">어떤 문제가 있었나요?</div>
        <div className="text-[12px] leading-relaxed text-sub mb-3">자세히 알려주시면 빠르게 처리해 드릴게요</div>

        <section className="mb-4">
          <p className="text-[12px] font-bold text-sub mb-2 px-1">문제 발생 단계</p>
          <div className="grid grid-cols-2 gap-2">
            {stages.map(s => {
              const sel = stage === s
              return (
                <button
                  key={s}
                  type="button"
                  onClick={() => setStage(s)}
                  className={`selectable-card press text-center ${sel ? 'selected' : ''}`}
                  style={{ padding: '10px 8px' }}
                >
                  <span className={`text-[15px] font-bold ${sel ? 'text-primary' : 'text-ink'}`}>
                    {s}
                  </span>
                </button>
              )
            })}
          </div>
        </section>

        <section className="mb-4">
          <p className="text-[12px] font-bold text-sub mb-2 px-1">이의 사유</p>
          <div className="flex flex-col gap-2">
            {reasons.map(r => {
              const sel = reason === r
              return (
                <button
                  key={r}
                  type="button"
                  onClick={() => setReason(r)}
                  className={`selectable-card press flex items-center justify-between ${sel ? 'selected' : ''}`}
                  style={{ padding: '12px 14px' }}
                >
                  <span className={`text-[15px] font-bold ${sel ? 'text-primary' : 'text-ink'}`}>{r}</span>
                  {sel && (
                    <div className="w-5 h-5 rounded-full bg-primary flex items-center justify-center">
                      <Check size={12} className="text-white" strokeWidth={3} />
                    </div>
                  )}
                </button>
              )
            })}
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
        <button
          type="button"
          disabled={!canSubmit}
          onClick={() => router.push('/disputes/success')}
          className="btn-danger"
        >
          이의 신청하기
        </button>
      </PageFooter>
    </div>
  )
}
