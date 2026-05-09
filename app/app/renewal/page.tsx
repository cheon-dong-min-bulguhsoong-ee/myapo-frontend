'use client'
import { useRouter } from 'next/navigation'
import { AppBar } from '@/components/ui/app-bar'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { RefreshCw } from 'lucide-react'

const steps = [
  { title: '만료 알림 수신', desc: '문서 만료 30일 전 알림을 보내드려요' },
  { title: '재발급 신청', desc: '기존 정보로 간편하게 재신청할 수 있어요' },
  { title: '자동 갱신 완료', desc: '새 자격증명이 즉시 발급됩니다' },
]

export default function RenewalPage() {
  const router = useRouter()
  return (
    <div className="flex flex-col min-h-full" style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}>
      <AppBar title="재발급 안내" />
      <main className="flex-1 px-5 py-6 space-y-4">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-12 h-12 rounded-xl bg-warning/10 flex items-center justify-center">
            <RefreshCw size={24} className="text-warning" />
          </div>
          <div>
            <h2 className="font-bold text-ink">문서 재발급 안내</h2>
            <p className="text-sm text-ink-secondary">간단한 3단계로 재발급됩니다</p>
          </div>
        </div>
        {steps.map((s, i) => (
          <Card key={i}>
            <div className="flex gap-3 items-start">
              <span className="w-7 h-7 rounded-full bg-primary-soft text-primary text-sm font-bold flex items-center justify-center flex-shrink-0">{i + 1}</span>
              <div>
                <p className="font-semibold text-ink">{s.title}</p>
                <p className="text-sm text-ink-secondary mt-0.5">{s.desc}</p>
              </div>
            </div>
          </Card>
        ))}
      </main>
      <div className="px-5 pb-6 space-y-2">
        <Button fullWidth onClick={() => router.push('/issue/select')}>재발급 신청하기</Button>
        <Button fullWidth variant="secondary" onClick={() => router.push('/home')}>나중에 하기</Button>
      </div>
    </div>
  )
}
