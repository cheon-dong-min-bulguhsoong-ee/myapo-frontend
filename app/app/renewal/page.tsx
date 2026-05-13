'use client'
import { useRouter, useSearchParams } from 'next/navigation'
import { Suspense } from 'react'
import { RefreshCw, Bell, FileSignature, Wallet, ShieldCheck } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { AppBar } from '@/components/ui/app-bar'
import { AppContent } from '@/components/ui/app-content'
import { Pill } from '@/components/ui/pill'
import { Callout } from '@/components/ui/callout'
import { PageFooter } from '@/components/ui/page-footer'
import {
  mockDocuments,
  mockIssuableDocuments,
  documentTypeToIssuableId,
} from '@/lib/mock-data'

interface Step {
  Icon: LucideIcon
  title: string
  desc: string
}

const steps: Step[] = [
  { Icon: Bell,           title: '만료 알림 수신',   desc: '문서 만료 30일 전 알림을 보내드려요' },
  { Icon: FileSignature,  title: '재발급 신청',       desc: '기존 정보로 간편하게 재신청할 수 있어요' },
  { Icon: Wallet,         title: '자동 갱신 완료',    desc: '새 자격증명이 즉시 발급됩니다' },
]

function RenewalView() {
  const router = useRouter()
  const params = useSearchParams()
  const docId = params.get('docId')
  const preselect = params.get('preselect')
  const documentTypeName = params.get('documentTypeName')

  const doc = docId ? mockDocuments.find(d => d.id === docId) ?? null : null
  const issuableId = doc ? documentTypeToIssuableId[doc.type] : preselect
  const issuable = issuableId
    ? mockIssuableDocuments.find(d => d.id === issuableId) ?? null
    : null

  if (docId && !doc && !preselect) {
    return (
      <div className="flex flex-col flex-1 min-h-full">
        <AppBar title="재발급 안내" badges={<Pill variant="testnet" size="sm">Testnet</Pill>} />
        <AppContent>
          <div className="flex flex-col items-center py-12 gap-3">
            <div className="w-14 h-14 rounded-full bg-success-soft flex items-center justify-center">
              <ShieldCheck size={28} strokeWidth={2.2} className="text-success" />
            </div>
            <div className="text-[15px] font-bold text-ink text-center">재발급할 문서가 없어요</div>
            <div className="text-[12px] leading-relaxed text-muted text-center">모든 문서가 유효해요</div>
          </div>
        </AppContent>
        <PageFooter>
          <button onClick={() => router.push('/home')} className="btn-secondary">홈으로</button>
        </PageFooter>
      </div>
    )
  }

  const targetName = issuable?.name ?? documentTypeName ?? doc?.type
  const ctaTarget = issuableId
    ? `/issue/verify?documentTypeCode=${encodeURIComponent(issuableId)}`
    : '/issue/select'

  return (
    <div className="flex flex-col flex-1 min-h-full">
      <AppBar
        title="재발급 안내"
        badges={<Pill variant="testnet" size="sm">Testnet</Pill>}
      />

      <AppContent>
        <div className="text-[15px] font-bold text-ink mb-1">
          {targetName ? `${targetName}를 다시 발급할게요` : '문서 재발급 안내'}
        </div>
        <div className="text-[12px] leading-relaxed text-sub mb-3">간단한 3단계로 재발급됩니다</div>

        {doc && (
          <div className="card mb-3">
            <div className="flex items-center justify-between mb-1">
              <span className="text-[12px] text-muted">대상 문서</span>
              <Pill variant={doc.status === 'expired' ? 'revoked' : 'warning'} size="sm">
                {doc.status === 'expired' ? '만료됨' : 'D-7 만료 예정'}
              </Pill>
            </div>
            <div className="text-[15px] font-bold text-ink">
              {issuable?.name ?? `${doc.type} (영문)`}
            </div>
            <div className="text-[12px] leading-relaxed text-muted mt-1">
              발급일 {doc.issuedAt} · 만료일 {doc.expiresAt}
            </div>
            <div className="font-mono text-[10px] text-muted mt-0.5">{doc.credentialId}</div>
          </div>
        )}

        <div className="mb-3">
          <Callout
            tone="warning"
            icon={RefreshCw}
            title={doc?.status === 'expired' ? '유효기간이 만료됐어요' : '유효기간이 곧 만료돼요'}
            description="기존 정보로 재발급할 수 있어요"
          />
        </div>

        <div className="flex flex-col gap-2">
          {steps.map((s, i) => (
            <div key={i} className="card">
              <div className="flex gap-3 items-start">
                <div className="w-9 h-9 rounded-full bg-primary-soft flex items-center justify-center flex-shrink-0">
                  <s.Icon size={18} strokeWidth={2.2} className="text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="font-mono text-[10px] font-bold text-primary">STEP {i + 1}</span>
                  </div>
                  <p className="text-[15px] font-bold text-ink leading-snug">{s.title}</p>
                  <p className="text-[12px] text-sub mt-0.5 leading-relaxed">{s.desc}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </AppContent>

      <PageFooter>
        <button onClick={() => router.push(ctaTarget)} className="btn-primary">
          {targetName ? `${targetName} 다시 발급할게요` : '다시 발급할게요'}
        </button>
        <button onClick={() => router.push('/home')} className="btn-secondary">
          나중에 하기
        </button>
      </PageFooter>
    </div>
  )
}

export default function RenewalPage() {
  return (
    <Suspense fallback={null}>
      <RenewalView />
    </Suspense>
  )
}
