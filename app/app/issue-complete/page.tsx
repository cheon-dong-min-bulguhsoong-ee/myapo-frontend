'use client'
import { useRouter } from 'next/navigation'
import { CheckCircle } from 'lucide-react'

export default function IssueCompletePage() {
  const router = useRouter()
  return (
    <div className="flex flex-col flex-1 min-h-full bg-primary">
      <main className="flex-1 flex flex-col items-center justify-center px-5 text-center">
        <div className="w-20 h-20 rounded-full bg-white/15 flex items-center justify-center mb-4">
          <CheckCircle size={48} className="text-white" strokeWidth={2} />
        </div>
        <h1 className="mb-2 text-xl font-bold text-white">모든 서명이 완료됐어요</h1>
        <p className="text-sm leading-relaxed text-white/85">
          서류가 안전하게 발급되었습니다.<br />
          내 문서에서 확인하세요.
        </p>
      </main>

      <footer
        className="flex-shrink-0 px-5 pt-3"
        style={{
          paddingBottom: 'calc(env(safe-area-inset-bottom, 0px) + 12px)',
        }}
      >
        <button onClick={() => router.push('/documents')} className="btn-inverted">
          내 문서 보기
        </button>
      </footer>
    </div>
  )
}
