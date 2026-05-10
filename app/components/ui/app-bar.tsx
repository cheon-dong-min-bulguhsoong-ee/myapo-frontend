'use client'
import { useRouter } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'
import type { ReactNode } from 'react'

interface AppBarProps {
  title?: string
  showBack?: boolean
  onBack?: () => void
  badges?: ReactNode
  wordmark?: boolean
}

export function AppBar({ title, showBack = true, onBack, badges, wordmark }: AppBarProps) {
  const router = useRouter()
  const handleBack = onBack ?? (() => router.back())

  return (
    <div className="app-bar">
      {showBack && (
        <button
          type="button"
          aria-label="뒤로"
          onClick={handleBack}
          className="app-bar-back"
        >
          <ArrowLeft size={20} strokeWidth={2.2} />
        </button>
      )}
      <span className="app-bar-title">
        {wordmark ? 'MyApo' : title}
      </span>
      {badges && <div className="app-bar-badges">{badges}</div>}
    </div>
  )
}
