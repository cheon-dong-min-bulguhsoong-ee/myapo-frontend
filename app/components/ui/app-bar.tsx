'use client'
import { useRouter } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'

interface AppBarProps {
  title?: string
  showBack?: boolean
  onBack?: () => void
  action?: React.ReactNode
  wordmark?: boolean
}

export function AppBar({ title, showBack = true, onBack, action, wordmark }: AppBarProps) {
  const router = useRouter()
  const handleBack = onBack ?? (() => router.back())

  return (
    <header
      className="sticky top-0 z-10 bg-paper border-b border-hairline"
      style={{ paddingTop: 'env(safe-area-inset-top)' }}
    >
      <div className="flex items-center h-14 px-4 gap-2">
        {showBack && (
          <button
            onClick={handleBack}
            className="w-10 h-10 flex items-center justify-center -ml-1 rounded-full active:bg-canvas"
          >
            <ArrowLeft size={22} className="text-ink" />
          </button>
        )}
        {wordmark ? (
          <span className="text-xl font-bold text-primary tracking-tight">MyApo</span>
        ) : (
          <span className="text-base font-bold text-ink flex-1">{title}</span>
        )}
        {action && <div className="ml-auto">{action}</div>}
      </div>
    </header>
  )
}
