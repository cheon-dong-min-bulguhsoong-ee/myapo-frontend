import type { ComponentPropsWithoutRef, ReactNode } from 'react'

interface AppContentProps extends ComponentPropsWithoutRef<'main'> {
  children: ReactNode
  scrollable?: boolean
}

export function AppContent({ children, scrollable = true, className = '', ...props }: AppContentProps) {
  const contentClassName = `app-content flex-1 ${scrollable !== false ? 'overflow-y-auto' : ''} ${className}`.trim()

  return (
    <main {...props} className={contentClassName}>
      {children}
    </main>
  )
}
