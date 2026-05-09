import { ReactNode } from 'react'

export function PageFooter({ children }: { children: ReactNode }) {
  return (
    <footer
      className="shrink-0 px-5 pt-3 bg-paper space-y-2"
      style={{
        paddingBottom: 'calc(env(safe-area-inset-bottom) + 16px)',
        borderTop: '1px solid var(--color-hairline)',
      }}
    >
      {children}
    </footer>
  )
}
