import type { Metadata, Viewport } from 'next'
import './globals.css'
import { RouteShell } from '@/components/route-shell'

export const metadata: Metadata = {
  title: 'MyApo',
  description: '해외 제출용 공공문서 발급 서비스',
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <body>
        <RouteShell>{children}</RouteShell>
      </body>
    </html>
  )
}
