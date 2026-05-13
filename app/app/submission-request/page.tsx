'use client'
import { Suspense, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { FileSignature, Loader2 } from 'lucide-react'
import { AppBar } from '@/components/ui/app-bar'
import { AppContent } from '@/components/ui/app-content'
import { Pill } from '@/components/ui/pill'
import { PageFooter } from '@/components/ui/page-footer'
import { useAuth } from '@/contexts/auth-context'
import { mockInstitutions } from '@/lib/mock-data'
import {
  acceptTestnetCredential,
  advanceDocumentMvp,
  createCredentialIssueRequest,
  prepareAcceptTestnetCredential,
} from '@/lib/myapo-api'
import { signXrplTransactionBlob } from '@/lib/xrpl-signing'

const codeBg: Record<string, string> = {
  US: '#3182F6',
  AU: '#00C48C',
  CA: '#F04452',
}

function getErrorMessage(error: unknown, fallback: string) {
  return error instanceof Error ? error.message : fallback
}

function getRecoverableCredentialAcceptSignal(error: unknown) {
  const message = error instanceof Error ? error.message : ''
  const text = message.toLowerCase()
  if (text.includes('tecduplicate') || text.includes('duplicate')) return '이미 서명된 크리덴셜이에요. 다음 단계로 넘어갈게요'
  if (text.includes('tecno_entry') || text.includes('no_entry')) return '이전 서명 상태가 이미 바뀌었어요. 발급 단계를 새로 확인할게요'
  return null
}

function SubmissionRequestView() {
  const [selected, setSelected] = useState<string>('')
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [credentialId, setCredentialId] = useState<string | null>(null)
  const [signing, setSigning] = useState(false)
  const [signError, setSignError] = useState<string | null>(null)
  const [signMessage, setSignMessage] = useState<string | null>(null)
  const router = useRouter()
  const searchParams = useSearchParams()
  const { accessToken, wallet } = useAuth()

  const documentCode = searchParams.get('documentCode')
  const documentTypeCode = searchParams.get('documentTypeCode')

  const selectedInst = mockInstitutions.find(i => i.id === selected)
  const isSheetOpen = credentialId !== null

  async function handleSubmit() {
    if (!selectedInst) return

    if (!documentCode || !documentTypeCode || !accessToken) {
      router.push('/delivery')
      return
    }

    setSubmitting(true)
    setSubmitError(null)
    try {
      await advanceDocumentMvp(accessToken, documentCode)
      const created = await createCredentialIssueRequest(accessToken, {
        documentTypeId: documentTypeCode,
        documentCode,
        currentStage: 'INSTITUTION_DOC_SUBMIT',
      })
      if (!created.credentialId) {
        throw new Error('서명할 크리덴셜 ID를 받지 못했어요. 잠시 후 다시 시도해 주세요')
      }
      setCredentialId(created.credentialId)
    } catch (error) {
      console.error('Failed to submit document to institution:', error)
      setSubmitError(getErrorMessage(error, '제출 요청을 처리하지 못했어요. 잠시 후 다시 시도해 주세요'))
    } finally {
      setSubmitting(false)
    }
  }

  async function handleSign() {
    if (!credentialId || !accessToken) return
    if (!wallet.privateKey) {
      setSignError('지갑 키를 불러오지 못했어요. 다시 로그인한 뒤 사인해 주세요')
      return
    }
    setSigning(true)
    setSignError(null)
    setSignMessage('XRPL 서명 요청을 준비하고 있어요')
    try {
      const prepared = await prepareAcceptTestnetCredential(accessToken, credentialId)
      const signedTransactionBlob = await signXrplTransactionBlob(wallet.privateKey, prepared.transaction, prepared.network)

      setSignMessage('서명한 트랜잭션을 제출하고 있어요')
      try {
        await acceptTestnetCredential(accessToken, credentialId, signedTransactionBlob)
      } catch (error) {
        const recoverableSignal = getRecoverableCredentialAcceptSignal(error)
        if (!recoverableSignal) throw error
        setSignMessage(recoverableSignal)
      }

      router.push('/delivery')
    } catch (error) {
      console.error('Failed to sign institution submission credential:', error)
      setSignError(getErrorMessage(error, '서명을 완료하지 못했어요. 잠시 후 다시 시도해 주세요'))
      setSignMessage(null)
      setSigning(false)
    }
  }

  function handleDismissSheet() {
    if (signing) return
    setCredentialId(null)
    setSignError(null)
    setSignMessage(null)
  }

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

        {submitError && (
          <div className="mt-2 text-[12px] text-danger leading-relaxed">{submitError}</div>
        )}
      </AppContent>

      <PageFooter>
        <button
          type="button"
          disabled={!selected || submitting}
          onClick={handleSubmit}
          className="btn-primary"
        >
          {submitting
            ? '제출 요청 중이에요'
            : selectedInst
              ? `${selectedInst.name}에 보낼게요`
              : '제출 기관을 선택해요'}
        </button>
      </PageFooter>

      {isSheetOpen && (
        <div className="bottom-sheet-overlay">
          <div className="bottom-sheet">
            <div className="bottom-sheet-handle" />
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-full bg-primary-soft flex items-center justify-center text-primary">
                {signing
                  ? <Loader2 size={17} className="animate-spin" strokeWidth={2.4} />
                  : <FileSignature size={18} strokeWidth={2.4} />}
              </div>
              <div className="text-lg font-bold text-ink">서명이 필요해요</div>
            </div>
            <div className="mb-4 text-sm leading-relaxed text-sub">
              기관 발급 단계가 준비됐어요. 다음 단계로 보낼까요?
            </div>
            <div className="card surface-base mb-4">
              <div className="flex justify-between gap-5 py-3 border-b border-border">
                <span className="text-xs text-muted">제출 기관</span>
                <span className="text-right text-xs font-bold text-ink">{selectedInst?.name}</span>
              </div>
              <div className="flex justify-between gap-5 py-3">
                <span className="text-xs text-muted">단계</span>
                <span className="text-right text-xs font-bold text-ink">기관 제출</span>
              </div>
            </div>
            <div className={`mb-4 text-xs ${signError ? 'text-danger' : 'text-muted'}`}>
              {signError ?? signMessage ?? 'Testnet · Pre-Check Only · XRPL Credential'}
            </div>
            <button
              type="button"
              onClick={() => void handleSign()}
              disabled={signing || !accessToken}
              className="btn-primary mb-3"
            >
              {signing ? '서명 처리 중...' : '사인하기'}
            </button>
            <button
              type="button"
              onClick={handleDismissSheet}
              disabled={signing}
              className="btn-secondary"
            >
              나중에 할게요
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default function SubmissionRequestPage() {
  return (
    <Suspense fallback={null}>
      <SubmissionRequestView />
    </Suspense>
  )
}
