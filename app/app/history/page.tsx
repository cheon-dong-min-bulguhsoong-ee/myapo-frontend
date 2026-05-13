'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Clock, ChevronRight } from 'lucide-react'
import { AppBar } from '@/components/ui/app-bar'
import { AppContent } from '@/components/ui/app-content'
import { Pill } from '@/components/ui/pill'
import { ProgressFill } from '@/components/ui/progress-fill'
import { EmptyState } from '@/components/ui/empty-state'
import { Spinner } from '@/components/ui/spinner'
import { useAuth } from '@/contexts/auth-context'
import { listDocumentMvp, type DocumentMvpListItemRes } from '@/lib/myapo-api'

interface DocumentMvpListState {
  accessToken: string | null
  items: DocumentMvpListItemRes[]
  errorMessage: string | null
}

const EMPTY_ITEMS: DocumentMvpListItemRes[] = []

function formatDate(value: string) {
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value
  return date.toLocaleDateString('ko-KR', { year: 'numeric', month: '2-digit', day: '2-digit' })
}

function getErrorMessage(error: unknown) {
  return error instanceof Error ? error.message : '발급 내역을 불러오지 못했어요. 잠시 후 다시 시도해 주세요'
}

export default function HistoryPage() {
  const router = useRouter()
  const { accessToken, isReady } = useAuth()
  const [listState, setListState] = useState<DocumentMvpListState>({
    accessToken: null,
    items: [],
    errorMessage: null,
  })
  const missingTokenMessage = isReady && !accessToken ? '로그인 후 발급 내역을 확인할 수 있어요' : null
  const items = listState.accessToken === accessToken ? listState.items : EMPTY_ITEMS
  const inProgressItems = items.filter(item => !item.isSuccess)
  const errorMessage = missingTokenMessage ?? (listState.accessToken === accessToken ? listState.errorMessage : null)
  const showLoading = Boolean(accessToken) && listState.accessToken !== accessToken

  useEffect(() => {
    if (!accessToken) return

    let ignore = false

    listDocumentMvp(accessToken)
      .then(data => {
        if (ignore) return
        setListState({
          accessToken,
          items: data.items,
          errorMessage: null,
        })
      })
      .catch(error => {
        console.error('Failed to load document MVP list:', error)
        if (!ignore) {
          setListState({
            accessToken,
            items: [],
            errorMessage: getErrorMessage(error),
          })
        }
      })

    return () => {
      ignore = true
    }
  }, [accessToken])

  return (
    <div className="flex flex-col flex-1 min-h-full">
      <AppBar
        title="발급 내역"
        badges={<Pill variant="testnet" size="sm">Testnet</Pill>}
      />

      <AppContent>
        <div className="text-[15px] font-bold text-ink mb-1">진행 중인 발급이에요</div>
        <div className="text-[12px] leading-relaxed text-sub mb-2">신청하신 서류의 발급 상황을 확인하세요</div>

        {showLoading && (
          <div className="card flex items-center justify-center gap-2 p-4 text-[13px] leading-relaxed text-sub">
            <Spinner size="sm" tone="primary" />
            발급 내역을 불러오고 있어요
          </div>
        )}

        {!showLoading && errorMessage && (
          <div className="card p-4 text-[13px] leading-relaxed text-sub">{errorMessage}</div>
        )}

        {!showLoading && !errorMessage && inProgressItems.length === 0 ? (
          <EmptyState
            icon={Clock}
            title="진행 중인 발급이 없어요"
            description="새로운 문서를 신청해 보세요"
            ctaLabel="발급 신청하기"
            onCta={() => router.push('/issue/select')}
          />
        ) : null}

        {!showLoading && !errorMessage && inProgressItems.length > 0 && (
          inProgressItems.map(item => {
            const progress = (item.currentStep / item.totalSteps) * 100
            const isError = item.status === 'FAILED'
            return (
              <button
                key={item.documentCode}
                onClick={() => router.push(`/history/${encodeURIComponent(item.documentCode)}`)}
                className="card press w-full text-left mb-2"
              >
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <div className="text-[15px] font-bold text-ink">{item.documentTypeName}</div>
                    <div className={`text-[12px] font-semibold mt-0.5 ${isError ? 'text-danger' : 'text-primary'}`}>
                      {item.currentStepLabel}
                    </div>
                  </div>
                  <ChevronRight size={16} className="text-muted mt-1" />
                </div>

                <ProgressFill value={progress} />
                <div className="flex justify-between items-center mt-2">
                  <span className="text-[12px] font-medium text-sub">
                    {isError ? '오류 발생' : item.statusLabel}
                  </span>
                  <span className="font-mono text-[12px] font-medium text-muted">
                    {item.currentStep}/{item.totalSteps} 단계
                  </span>
                </div>
                <div className="text-[10px] text-muted mt-1">신청일 {formatDate(item.requestedAt)}</div>
              </button>
            )
          })
        )}
      </AppContent>
    </div>
  )
}
