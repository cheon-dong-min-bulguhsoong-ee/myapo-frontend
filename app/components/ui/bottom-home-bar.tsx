'use client'
import { Home } from 'lucide-react'
import { useRouter, usePathname } from 'next/navigation'

const HIDE_ON = ['/', '/login', '/persona-select']

export function BottomHomeBar() {
  const router = useRouter()
  const pathname = usePathname()

  if (HIDE_ON.includes(pathname)) return null

  return (
    <button
      onClick={() => router.push('/home')}
      className="shrink-0 w-full flex flex-col items-center justify-center gap-0.5 active:bg-canvas transition-colors"
      style={{
        height: 'calc(56px + env(safe-area-inset-bottom))',
        paddingBottom: 'env(safe-area-inset-bottom)',
        borderTop: '1px solid var(--color-hairline)',
        backgroundColor: 'var(--color-paper)',
      }}
      aria-label="홈으로 이동"
    >
      <Home size={22} strokeWidth={2} className="text-ink-muted" />
      <span className="text-[11px] font-semibold text-ink-muted leading-none mt-0.5">홈</span>
    </button>
  )
}
