'use client'
import { useRouter } from 'next/navigation'
import { CheckCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function IssueCompletePage() {
  const router = useRouter()
  return (
    <div className="flex flex-col min-h-dvh items-center justify-center px-5 text-center bg-primary" style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}>
      <CheckCircle size={72} className="text-white mb-4" />
      <h1 className="text-2xl font-bold text-white mb-3">모든 서명이 완료됐어요</h1>
      <p className="text-base text-white/80 mb-10">
        서류가 안전하게 발급되었습니다.<br />내 문서에서 확인하세요.
      </p>
      <Button fullWidth className="!bg-white !text-primary font-bold" onClick={() => router.push('/documents')}>
        내 문서 보기
      </Button>
    </div>
  )
}
