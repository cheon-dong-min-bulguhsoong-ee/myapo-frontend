'use client'
import { useRouter, useParams } from 'next/navigation'
import { AppBar } from '@/components/ui/app-bar'
import { Button } from '@/components/ui/button'
import { Pill } from '@/components/ui/pill'
import { mockDocuments } from '@/lib/mock-data'
import { FileText } from 'lucide-react'

export default function DocumentDetailPage() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()
  const doc = mockDocuments.find(d => d.id === id)

  if (!doc) return <div className="p-5 text-ink-secondary">문서를 찾을 수 없어요</div>

  return (
    <div className="flex flex-col min-h-dvh" style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}>
      <AppBar title={doc.type} />
      <main className="flex-1 px-5 py-4 space-y-4">
        <div className="bg-paper rounded-2xl border border-hairline p-5 space-y-3" style={{ boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-primary-soft flex items-center justify-center">
              <FileText size={24} className="text-primary" />
            </div>
            <div>
              <h2 className="font-bold text-ink">{doc.type}</h2>
              {doc.isExpiringSoon && <Pill variant="warning">D-7 만료 예정</Pill>}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div>
              <p className="text-ink-muted text-xs">발급일</p>
              <p className="font-medium text-ink">{doc.issuedAt}</p>
            </div>
            <div>
              <p className="text-ink-muted text-xs">만료일</p>
              <p className="font-medium text-ink">{doc.expiresAt}</p>
            </div>
            <div className="col-span-2">
              <p className="text-ink-muted text-xs">자격증명 ID</p>
              <p className="font-mono text-xs text-ink">{doc.credentialId}</p>
            </div>
          </div>
        </div>
        <div className="bg-canvas rounded-xl border border-hairline h-48 flex items-center justify-center">
          <p className="text-sm text-ink-muted">PDF 미리보기</p>
        </div>
      </main>
      <div className="px-5 pb-6 space-y-2">
        <Button fullWidth onClick={() => router.push('/issue/select')}>재발급 신청</Button>
        <Button fullWidth variant="secondary" onClick={() => router.push('/submission-request')}>기관 제출</Button>
        <Button fullWidth variant="danger" onClick={() => router.push('/disputes/new')}>이의 신청</Button>
      </div>
    </div>
  )
}
