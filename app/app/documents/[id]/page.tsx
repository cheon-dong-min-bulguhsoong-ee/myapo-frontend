'use client'
import { useRouter, useParams } from 'next/navigation'
import { AppBar } from '@/components/ui/app-bar'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Pill } from '@/components/ui/pill'
import { PageFooter } from '@/components/ui/page-footer'
import { mockDocuments } from '@/lib/mock-data'
import { FileText } from 'lucide-react'

export default function DocumentDetailPage() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()
  const doc = mockDocuments.find(d => d.id === id)

  if (!doc) return <div className="p-5 text-ink-secondary">문서를 찾을 수 없어요</div>

  return (
    <div className="flex flex-col h-full bg-canvas">
      <AppBar title={doc.type} />

      <main className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
        <Card>
          <div className="flex items-center gap-3">
            <div className="ds-icon-box ds-tone-blue shrink-0 w-12 h-12 flex items-center justify-center">
              <FileText size={22} strokeWidth={2} />
            </div>
            <div className="flex-1 min-w-0">
              <h2 className="font-bold text-ink">{doc.type}</h2>
              {doc.isExpiringSoon && (
                <div className="mt-1">
                  <Pill variant="warning">D-7 만료 예정</Pill>
                </div>
              )}
            </div>
          </div>

          <div className="ds-divider-top grid grid-cols-2 gap-3 text-sm mt-4 pt-4">
            <div>
              <p className="text-ink-muted text-xs">발급일</p>
              <p className="font-medium text-ink mt-0.5">{doc.issuedAt}</p>
            </div>
            <div>
              <p className="text-ink-muted text-xs">만료일</p>
              <p className="font-medium text-ink mt-0.5">{doc.expiresAt}</p>
            </div>
            <div className="col-span-2">
              <p className="text-ink-muted text-xs">자격증명 ID</p>
              <p className="font-mono text-xs text-ink mt-0.5">{doc.credentialId}</p>
            </div>
          </div>
        </Card>

        <div className="ds-card h-48 flex items-center justify-center">
          <p className="text-sm text-ink-muted">PDF 미리보기</p>
        </div>
      </main>

      <PageFooter>
        <Button fullWidth onClick={() => router.push('/issue/select')}>재발급 신청</Button>
        <Button fullWidth variant="secondary" onClick={() => router.push('/submission-request')}>
          기관 제출
        </Button>
        <Button fullWidth variant="danger" onClick={() => router.push('/disputes/new')}>
          이의 신청
        </Button>
      </PageFooter>
    </div>
  )
}
