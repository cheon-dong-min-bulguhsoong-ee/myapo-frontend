import type { Metadata, Viewport } from 'next'
import './globals.css'
import { PersonaProvider } from '@/contexts/persona-context'
import { AuthProvider } from '@/contexts/auth-context'
import { BottomHomeBar } from '@/components/ui/bottom-home-bar'

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
      <body className="app-body">
        <AuthProvider>
          <PersonaProvider>
            <div className="app-frame">
              <div className="app-scroll flex flex-col">{children}</div>
              <BottomHomeBar />
            </div>
          </PersonaProvider>
        </AuthProvider>
      </body>
    </html>
  )
}
