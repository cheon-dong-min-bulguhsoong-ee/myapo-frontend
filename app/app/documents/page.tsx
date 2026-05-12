'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Folder, ChevronRight, CheckCircle } from 'lucide-react'
import { AppBar } from '@/components/ui/app-bar'
import { Pill } from '@/components/ui/pill'
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

function formatDate(value: string | null) {
  if (!value) return '-'
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value
  return date.toLocaleDateString('ko-KR', { year: 'numeric', month: '2-digit', day: '2-digit' })
}

function getErrorMessage(error: unknown) {
  return error instanceof Error ? error.message : '내 증명서를 불러오지 못했어요. 잠시 후 다시 시도해 주세요'
}

function ArrivedCallout({ name }: { name: string }) {
  return (
    <div
      className="flex items-center gap-2 p-3 rounded-[8px]"
      style={{ background: '#E6FAF3', border: '1px solid #00C48C' }}
    >
      <CheckCircle size={16} className="text-success flex-shrink-0" />
      <div>
        <div className="text-[15px] font-bold text-ink leading-snug">{name}가 지갑에 도착했어요</div>
        <div className="text-[12px] leading-relaxed text-sub mt-0.5">발급 완료된 증명서만 모아 보여드려요</div>
      </div>
    </div>
  )
}

function DocumentRow({ doc, onClick }: { doc: DocumentMvpListItemRes; onClick: () => void }) {
  return (
    <button onClick={onClick} className="card press w-full text-left">
      <div className="flex items-center justify-between mb-2">
        <Pill variant="success" size="sm">발급 완료</Pill>
        <div className="flex items-center gap-1 text-muted">
          <ChevronRight size={16} strokeWidth={2} />
        </div>
      </div>
      <div className="text-[15px] font-bold text-ink">{doc.documentTypeName}</div>
      <div className="text-[12px] text-sub">{doc.issuerCountryCode}-{doc.issuerIconLabel} · {doc.issuerName}</div>
      <div className="text-[12px] text-sub mt-1">
        발급일 <span className="font-bold text-ink">{formatDate(doc.issuedAt)}</span>
      </div>
      <div className="font-mono text-[10px] text-muted mt-1 break-all">{doc.documentCode}</div>
    </button>
  )
}

export default function DocumentsPage() {
  const router = useRouter()
  const { accessToken, isReady } = useAuth()
  const [listState, setListState] = useState<DocumentMvpListState>({
    accessToken: null,
    items: [],
    errorMessage: null,
  })
  const missingTokenMessage = isReady && !accessToken ? '로그인 후 내 증명서를 확인할 수 있어요' : null
  const items = listState.accessToken === accessToken ? listState.items : EMPTY_ITEMS
  const issuedItems = items.filter(item => item.isSuccess)
  const errorMessage = missingTokenMessage ?? (listState.accessToken === accessToken ? listState.errorMessage : null)
  const showLoading = Boolean(accessToken) && listState.accessToken !== accessToken
  const justArrived = issuedItems[0] ?? null

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
        title="내 문서"
        badges={<Pill variant="testnet" size="sm">Testnet</Pill>}
      />

      <main className="app-content flex flex-1 flex-col gap-3 overflow-y-auto">
        <div>
          <div className="text-[15px] font-bold text-ink mb-1">발급 완료된 증명서예요</div>
          <div className="text-[12px] leading-relaxed text-sub">완료된 문서만 내 증명서에 표시됩니다</div>
        </div>

        {showLoading && (
          <div className="card flex items-center justify-center gap-2 p-4 text-[13px] leading-relaxed text-sub">
            <Spinner size="sm" tone="primary" />
            내 증명서를 불러오고 있어요
          </div>
        )}

        {!showLoading && errorMessage && (
          <div className="card p-4 text-[13px] leading-relaxed text-sub">{errorMessage}</div>
        )}

        {!showLoading && !errorMessage && issuedItems.length === 0 ? (
          <EmptyState
            icon={Folder}
            title="발급 완료된 증명서가 없어요"
            description="진행 중인 발급은 발급 내역에서 확인할 수 있어요"
            ctaLabel="발급 신청하기"
            onCta={() => router.push('/issue/select')}
          />
        ) : null}

        {!showLoading && !errorMessage && issuedItems.length > 0 && (
          <>
            {justArrived && <ArrivedCallout name={justArrived.documentTypeName} />}
            {issuedItems.map(doc => (
              <DocumentRow
                key={doc.documentCode}
                doc={doc}
                onClick={() => router.push(`/documents/${encodeURIComponent(doc.documentCode)}`)}
              />
            ))}
          </>
        )}
      </main>
    </div>
  )
}
