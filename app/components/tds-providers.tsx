'use client'

import { ThemeProvider } from '@toss/tds-mobile'
import { ReactNode } from 'react'

export function TDSProviders({ children }: { children: ReactNode }) {
  return <ThemeProvider>{children}</ThemeProvider>
}
