'use client'
import { useRouter } from 'next/navigation'
import { AppBar } from '@/components/ui/app-bar'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { PageHeader } from '@/components/ui/page-header'
import { PageFooter } from '@/components/ui/page-footer'
import { RefreshCw } from 'lucide-react'

const steps = [
  { title: '만료 알림 수신', desc: '문서 만료 30일 전 알림을 보내드려요' },
  { title: '재발급 신청', desc: '기존 정보로 간편하게 재신청할 수 있어요' },
  { title: '자동 갱신 완료', desc: '새 자격증명이 즉시 발급됩니다' },
]

export default function RenewalPage() {
  const router = useRouter()
  return (
    <div className="flex flex-col h-full bg-canvas">
      <AppBar title="재발급 안내" />
      <PageHeader title="문서 재발급 안내" subtitle="간단한 3단계로 재발급됩니다" />

      <main className="flex-1 overflow-y-auto px-5 pb-6 space-y-3">
        <Card>
          <div className="flex items-center gap-3">
            <div
              className="shrink-0 w-12 h-12 rounded-xl flex items-center justify-center"
              style={{ backgroundColor: '#FFF8E6' }}
            >
              <RefreshCw size={22} strokeWidth={2} style={{ color: '#FFB020' }} />
            </div>
            <div>
              <p className="font-bold text-ink">유효기간이 곧 만료돼요</p>
              <p className="text-sm text-ink-secondary mt-0.5">기존 정보로 재발급할 수 있어요</p>
            </div>
          </div>
        </Card>

        {steps.map((s, i) => (
          <Card key={i}>
            <div className="flex gap-3 items-start">
              <span
                className="shrink-0 w-7 h-7 rounded-full bg-primary-soft text-primary text-sm font-bold flex items-center justify-center"
              >
                {i + 1}
              </span>
              <div>
                <p className="font-semibold text-ink">{s.title}</p>
                <p className="text-sm text-ink-secondary mt-0.5">{s.desc}</p>
              </div>
            </div>
          </Card>
        ))}
      </main>

      <PageFooter>
        <Button fullWidth onClick={() => router.push('/issue/select')}>
          재발급 신청하기
        </Button>
        <Button fullWidth variant="secondary" onClick={() => router.push('/home')}>
          나중에 하기
        </Button>
      </PageFooter>
    </div>
  )
}
