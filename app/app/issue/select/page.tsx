'use client'
import { Suspense, useEffect, useMemo, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { AppBar } from '@/components/ui/app-bar'
import { Pill } from '@/components/ui/pill'
import { DocCard } from '@/components/ui/doc-card'
import { PageFooter } from '@/components/ui/page-footer'
import { useAuth } from '@/contexts/auth-context'
import {
  MYAPO_PENDING_DOCUMENT_TYPE_STORAGE_KEY,
  listDocumentTypes,
  type DocumentTypeListItemRes,
} from '@/lib/myapo-api'

interface IssuableDocumentView {
  id: string
  name: string
  englishName?: string
  use?: string
  issuerCode: string
  issuerIcon: string
}

interface DocumentCatalogState {
  accessToken: string | null
  documents: IssuableDocumentView[]
  errorMessage: string | null
}

const EMPTY_DOCUMENTS: IssuableDocumentView[] = []

function toIssuableDocument(item: DocumentTypeListItemRes): IssuableDocumentView {
  return {
    id: item.code,
    name: item.name,
    englishName: item.englishName ?? undefined,
    use: item.useCase ?? undefined,
    issuerCode: item.issuerCode,
    issuerIcon: item.issuerIconLabel,
  }
}

function IssueSelectView() {
  const router = useRouter()
  const params = useSearchParams()
  const { accessToken } = useAuth()
  const preselect = params.get('preselect')
  const [catalog, setCatalog] = useState<DocumentCatalogState>({
    accessToken: null,
    documents: [],
    errorMessage: null,
  })
  const [selectedIds, setSelectedIds] = useState<Set<string>>(() => (preselect ? new Set([preselect]) : new Set()))
  const missingTokenMessage = accessToken ? null : '로그인 후 발급 가능한 서류를 불러올 수 있어요'
  const documents = catalog.accessToken === accessToken ? catalog.documents : EMPTY_DOCUMENTS
  const errorMessage = missingTokenMessage ?? (catalog.accessToken === accessToken ? catalog.errorMessage : null)
  const showLoading = Boolean(accessToken) && catalog.accessToken !== accessToken

  useEffect(() => {
    if (!accessToken) return

    let ignore = false

    listDocumentTypes(accessToken, 'KOREAN')
      .then(data => {
        if (ignore) return
        setCatalog({
          accessToken,
          documents: data.items.map(toIssuableDocument),
          errorMessage: null,
        })
      })
      .catch(err => {
        console.error('Failed to load document types:', err)
        if (!ignore) {
          setCatalog({
            accessToken,
            documents: [],
            errorMessage: '발급 가능한 서류를 불러오지 못했어요. 잠시 후 다시 시도해 주세요',
          })
        }
      })

    return () => {
      ignore = true
    }
  }, [accessToken])

  const isReissue = useMemo(
    () => !!preselect && documents.some(d => d.id === preselect),
    [documents, preselect],
  )

  const toggle = (id: string) => {
    setSelectedIds(prev => {
      if (prev.has(id)) return new Set()
      return new Set([id])
    })
  }

  const selectedDocuments = documents.filter(d => selectedIds.has(d.id))
  const selectedCount = selectedDocuments.length
  const onlyDoc = selectedCount === 1 ? selectedDocuments[0] : null

  const ctaLabel =
    selectedCount === 0 ? '서류를 선택해요'
    : isReissue && onlyDoc ? `${onlyDoc.name} 재발급 신청할게요`
    :                    '발급 신청할게요'

  const disabled = selectedCount === 0 || showLoading || Boolean(errorMessage)

  const continueToVerify = () => {
    if (!onlyDoc) return
    if (typeof window !== 'undefined') {
      sessionStorage.setItem(MYAPO_PENDING_DOCUMENT_TYPE_STORAGE_KEY, onlyDoc.id)
    }
    router.push(`/issue/verify?documentTypeCode=${encodeURIComponent(onlyDoc.id)}`)
  }

  return (
    <div className="flex flex-col flex-1 min-h-full">
      <AppBar
        title={isReissue ? '재발급 신청' : '서류 발급 신청'}
        badges={
          <>
            <Pill variant="testnet" size="sm">Testnet</Pill>
            <Pill variant="precheck" size="sm">Pre-Check Only</Pill>
          </>
        }
      />

      <main className="app-content flex-1 overflow-y-auto">
        <div className="text-[15px] font-bold text-ink mb-1">
          {isReissue ? '재발급할 서류가 선택되어 있어요' : '어떤 한국 서류를 발급받을까요?'}
        </div>
        <div className="text-[12px] leading-relaxed text-sub mb-2">
          {isReissue
            ? '필요하면 다른 서류로 바꿀 수 있어요'
            : '발급기관: 한국 정부 · 해외 기관 제출용'}
        </div>

        {showLoading && (
          <div className="card p-4 text-[13px] leading-relaxed text-sub">발급 가능한 서류를 불러오고 있어요</div>
        )}

        {!showLoading && errorMessage && (
          <div className="card p-4 text-[13px] leading-relaxed text-sub">{errorMessage}</div>
        )}

        {!showLoading && !errorMessage && (
          <div className="doc-grid">
            {documents.map(doc => (
              <DocCard
                key={doc.id}
                issuerIcon={doc.issuerIcon}
                name={doc.name}
                englishName={selectedIds.has(doc.id) ? doc.englishName : undefined}
                use={doc.use}
                issuerCode={doc.issuerCode}
                selected={selectedIds.has(doc.id)}
                onClick={() => toggle(doc.id)}
              />
            ))}
          </div>
        )}

        <div className="text-[12px] leading-relaxed text-muted mt-3">발급해두면 유효기간 안에 무한 재사용해요</div>
      </main>

      <PageFooter>
        <button
          type="button"
          disabled={disabled}
          onClick={continueToVerify}
          className="btn-primary"
        >
          {ctaLabel}
        </button>
        <div className="text-[12px] leading-relaxed text-muted text-center">
          PIPA §17 동의 포함 · 사용자 디바이스 한정 보관
        </div>
      </PageFooter>
    </div>
  )
}

export default function IssueSelectPage() {
  return (
    <Suspense fallback={null}>
      <IssueSelectView />
    </Suspense>
  )
}
