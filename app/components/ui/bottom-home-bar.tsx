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
      aria-label="홈으로 이동"
      className="bottom-home-bar press shrink-0 w-full flex flex-col items-center justify-center gap-0.5 transition-colors active:bg-canvas"
    >
      <Home size={22} strokeWidth={2.2} className="text-ink-secondary" />
      <span className="ds-small-strong text-ink-secondary mt-0.5">
        홈
      </span>
    </button>
  )
}
