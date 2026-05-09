'use client'
import { useRouter } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'
import type { ReactNode } from 'react'

interface AppBarProps {
  title?: string
  showBack?: boolean
  onBack?: () => void
  action?: ReactNode
  wordmark?: boolean
}

export function AppBar({ title, showBack = true, onBack, action, wordmark }: AppBarProps) {
  const router = useRouter()
  const handleBack = onBack ?? (() => router.back())

  return (
    <header className="app-bar sticky top-0 z-10 bg-paper/90 backdrop-blur-md border-b border-hairline-soft">
      <div className="flex items-center h-14 px-3 gap-1">
        {showBack && (
          <button
            onClick={handleBack}
            aria-label="뒤로"
            className="press w-10 h-10 flex items-center justify-center rounded-full active:bg-canvas transition-colors"
          >
            <ArrowLeft size={22} className="text-ink" />
          </button>
        )}
        {wordmark ? (
          <span className="ds-headline text-primary px-2">MyApo</span>
        ) : (
          <span className="ds-headline flex-1 px-1 truncate">
            {title}
          </span>
        )}
        {action && <div className="ml-auto">{action}</div>}
      </div>
    </header>
  )
}
