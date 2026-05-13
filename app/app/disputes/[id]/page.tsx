'use client'
import { useParams } from 'next/navigation'
import { MessageSquare } from 'lucide-react'
import { AppBar } from '@/components/ui/app-bar'
import { AppContent } from '@/components/ui/app-content'
import { Pill } from '@/components/ui/pill'
import { mockDisputes } from '@/lib/mock-data'
import { disputeStatusMap } from '@/lib/dispute-status'

export default function DisputeDetailPage() {
  const { id } = useParams<{ id: string }>()
  const d = mockDisputes.find(x => x.id === id)

  if (!d) {
    return (
      <div className="flex flex-col flex-1 min-h-full">
        <AppBar title="이의 신청 상세" />
        <AppContent scrollable={false} className="text-[12px] leading-relaxed text-sub">이의 신청을 찾을 수 없어요</AppContent>
      </div>
    )
  }

  return (
    <div className="flex flex-col flex-1 min-h-full">
      <AppBar
        title="이의 신청 상세"
        badges={<Pill variant="testnet" size="sm">Testnet</Pill>}
      />

      <AppContent>
        <div className="card mb-3">
          <div className="flex items-center justify-between mb-2">
            <Pill variant={disputeStatusMap[d.status].variant} size="sm">
              {disputeStatusMap[d.status].label}
            </Pill>
            <span className="text-[12px] text-muted">신청일 {d.createdAt}</span>
          </div>
          <div className="text-[15px] font-bold text-ink">{d.documentType} (영문)</div>
          <div className="text-[12px] text-sub mt-1">발생 단계: <span className="font-bold text-ink">{d.stage}</span></div>
          <div className="text-[12px] text-sub">사유: <span className="font-bold text-ink">{d.reason}</span></div>
        </div>

        {d.operatorResponse && (
          <div className="card">
            <div className="flex items-center gap-2 mb-2">
              <MessageSquare size={14} className="text-primary" />
              <span className="text-[12px] font-bold text-sub">담당자 답변</span>
            </div>
            <p className="text-[15px] leading-relaxed text-ink">{d.operatorResponse}</p>
          </div>
        )}
      </AppContent>
    </div>
  )
}
