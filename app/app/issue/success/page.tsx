'use client'
import { Suspense, useCallback, useEffect, useMemo, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { CheckCircle } from 'lucide-react'
import { PageFooter } from '@/components/ui/page-footer'
import { useAuth } from '@/contexts/auth-context'
import { MYAPO_LATEST_DOCUMENT_CODE_STORAGE_KEY, getDocumentMvp } from '@/lib/myapo-api'

function getStoredDocumentCode() {
  if (typeof window === 'undefined') return null
  return sessionStorage.getItem(MYAPO_LATEST_DOCUMENT_CODE_STORAGE_KEY)
}

function getErrorMessage(error: unknown) {
  return error instanceof Error ? error.message : '발급 현황을 불러오지 못했어요. 잠시 후 다시 시도해 주세요'
}

function IssueSuccessView() {
  const router = useRouter()
  const params = useSearchParams()
  const { accessToken, isReady } = useAuth()
  const [isNavigating, setIsNavigating] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const documentCode = useMemo(
    () => params.get('documentCode') ?? getStoredDocumentCode(),
    [params],
  )

  const showIssueStatus = useCallback(async () => {
    if (!documentCode) {
      router.push('/history')
      return
    }
    if (!accessToken) {
      if (isReady) setErrorMessage('로그인 후 발급 현황을 확인할 수 있어요')
      return
    }

    setIsNavigating(true)
    setErrorMessage(null)

    try {
      await getDocumentMvp(accessToken, documentCode)
      router.push(`/history/${encodeURIComponent(documentCode)}`)
    } catch (error) {
      console.error('Failed to load document MVP detail:', error)
      setErrorMessage(getErrorMessage(error))
    } finally {
      setIsNavigating(false)
    }
  }, [accessToken, documentCode, isReady, router])

  useEffect(() => {
    const t = setTimeout(() => {
      void showIssueStatus()
    }, 5000)
    return () => clearTimeout(t)
  }, [showIssueStatus])

  return (
    <div className="flex flex-col flex-1 min-h-full bg-base">
      <main className="flex-1 flex flex-col items-center justify-center px-5 text-center">
        <div className="w-16 h-16 rounded-full bg-success-soft flex items-center justify-center mb-3">
          <CheckCircle size={36} className="text-success" strokeWidth={2} />
        </div>
        <h1 className="text-[17px] font-bold text-ink mb-1">발급 신청이 완료됐어요</h1>
        <p className="text-[12px] leading-relaxed text-sub">
          서류 발급에는 보통 1–3 영업일이 소요됩니다.<br />
          완료되면 알림을 보내드릴게요.
        </p>
        {errorMessage && (
          <div className="card mt-4 text-[12px] leading-relaxed text-danger">
            {errorMessage}
          </div>
        )}
      </main>

      <PageFooter>
        <button onClick={() => void showIssueStatus()} disabled={isNavigating || !isReady} className="btn-primary">
          {isNavigating ? '발급 현황 불러오는 중...' : '발급 현황 보기'}
        </button>
      </PageFooter>
    </div>
  )
}

export default function IssueSuccessPage() {
  return (
    <Suspense fallback={null}>
      <IssueSuccessView />
    </Suspense>
  )
}
