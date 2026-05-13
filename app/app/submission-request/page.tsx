'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { AppBar } from '@/components/ui/app-bar'
import { AppContent } from '@/components/ui/app-content'
import { Pill } from '@/components/ui/pill'
import { PageFooter } from '@/components/ui/page-footer'
import { mockInstitutions } from '@/lib/mock-data'

const codeBg: Record<string, string> = {
  US: '#3182F6',
  AU: '#00C48C',
  CA: '#F04452',
}

export default function SubmissionRequestPage() {
  const [selected, setSelected] = useState<string>('')
  const router = useRouter()

  const selectedInst = mockInstitutions.find(i => i.id === selected)

  return (
    <div className="flex flex-col flex-1 min-h-full">
      <AppBar
        title="제출 요청"
        badges={<Pill variant="testnet" size="sm">Testnet</Pill>}
      />

      <AppContent>
        <div className="text-[15px] font-bold text-ink mb-1">받은 제출 요청이에요</div>
        <div className="text-[12px] leading-relaxed text-sub mb-2">기관이 먼저 요청한 경우에만 보내드릴 수 있어요</div>

        {mockInstitutions.map((inst) => {
          const isSelected = selected === inst.id
          return (
            <button
              key={inst.id}
              type="button"
              onClick={() => setSelected(inst.id)}
              className={`card press w-full text-left mb-2 ${isSelected ? 'ring-2 ring-primary' : ''}`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <span
                  className="px-2 py-0.5 rounded-full text-[12px] font-bold"
                  style={{ background: '#F9FAFB', color: '#4E5968', border: '1px solid #E5E8EB' }}
                >
                  요청 받음
                </span>
                <span className="text-[12px] text-muted">5월 {2 + mockInstitutions.indexOf(inst)}일</span>
              </div>
              <div className="flex items-center gap-2 mb-1">
                <div
                  className="w-8 h-8 rounded-[6px] flex items-center justify-center text-white font-bold text-[8px]"
                  style={{ background: codeBg[inst.country] ?? '#3182F6' }}
                >
                  {inst.code.split('-').slice(0, 2).join('-')}
                </div>
                <div className="text-[15px] font-bold text-ink">{inst.name}</div>
              </div>
              <div className="text-[12px] text-sub mb-1">비자 신청 시 필수예요</div>
              <div className="text-[12px] font-bold" style={{ color: '#FFB020' }}>
                5월 {9 + mockInstitutions.indexOf(inst)}일까지 제출
              </div>
            </button>
          )
        })}
      </AppContent>

      <PageFooter>
        <button
          type="button"
          disabled={!selected}
          onClick={() => router.push('/delivery')}
          className="btn-primary"
        >
          {selectedInst ? `${selectedInst.name}에 보낼게요` : '제출 기관을 선택해요'}
        </button>
      </PageFooter>
    </div>
  )
}
