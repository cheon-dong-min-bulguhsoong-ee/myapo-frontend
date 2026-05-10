'use client'
import { useRouter } from 'next/navigation'
import { AlertCircle, ChevronRight } from 'lucide-react'
import { AppBar } from '@/components/ui/app-bar'
import { Pill } from '@/components/ui/pill'
import { EmptyState } from '@/components/ui/empty-state'
import { PageFooter } from '@/components/ui/page-footer'
import { mockDisputes } from '@/lib/mock-data'
import { disputeStatusMap } from '@/lib/dispute-status'

export default function DisputesPage() {
  const router = useRouter()

  return (
    <div className="flex flex-col flex-1 min-h-full">
      <AppBar
        title="이의 신청"
        badges={<Pill variant="testnet" size="sm">Testnet</Pill>}
      />

      <main className="app-content flex-1 overflow-y-auto">
        <div className="text-[15px] font-bold text-ink mb-1">이의 신청 내역</div>
        <div className="text-[12px] leading-relaxed text-sub mb-2">신고하신 건의 처리 상태를 확인하세요</div>

        {mockDisputes.length === 0 ? (
          <EmptyState icon={AlertCircle} title="이의 신청 내역이 없어요" description="문제가 있을 때 언제든 신고할 수 있어요" />
        ) : (
          mockDisputes.map(d => (
            <button
              key={d.id}
              onClick={() => router.push(`/disputes/${d.id}`)}
              className="card press w-full text-left mb-2"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1.5">
                    <Pill variant={disputeStatusMap[d.status].variant} size="sm">
                      {disputeStatusMap[d.status].label}
                    </Pill>
                    <span className="text-[12px] text-muted">{d.stage} 단계</span>
                  </div>
                  <div className="text-[15px] font-bold text-ink">{d.documentType} (영문)</div>
                  <div className="text-[12px] text-sub mt-0.5">사유: {d.reason}</div>
                  <div className="text-[10px] text-muted mt-1">신청일 {d.createdAt}</div>
                </div>
                <ChevronRight size={16} className="text-muted ml-2 mt-1" />
              </div>
            </button>
          ))
        )}
      </main>

      <PageFooter>
        <button onClick={() => router.push('/disputes/new')} className="btn-danger">
          이의 신청하기
        </button>
      </PageFooter>
    </div>
  )
}
