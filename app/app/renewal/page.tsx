'use client'
import { useRouter } from 'next/navigation'
import { AppBar } from '@/components/ui/app-bar'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { PageHeader } from '@/components/ui/page-header'
import { PageFooter } from '@/components/ui/page-footer'
import { Callout } from '@/components/ui/callout'
import { IconBox } from '@/components/ui/icon-box'
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
        <Callout
          tone="warning"
          icon={RefreshCw}
          title="유효기간이 곧 만료돼요"
          description="기존 정보로 재발급할 수 있어요"
        />

        {steps.map((s, i) => (
          <Card key={i}>
            <div className="flex gap-3 items-start">
              <IconBox tone="blue" size="sm">
                <span className="text-sm font-bold">{i + 1}</span>
              </IconBox>
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
