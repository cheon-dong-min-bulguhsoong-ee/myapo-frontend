import { ReactNode } from 'react'

export function PageFooter({ children }: { children: ReactNode }) {
  return (
    <footer className="page-footer shrink-0 px-5 pt-3 bg-paper space-y-2">
      {children}
    </footer>
  )
}
