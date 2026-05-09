import type { Metadata, Viewport } from 'next'
import './globals.css'
import { PersonaProvider } from '@/contexts/persona-context'
import { AuthProvider } from '@/contexts/auth-context'
import { TDSProviders } from '@/components/tds-providers'

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
      <body style={{ display: 'flex', justifyContent: 'center', minHeight: '100dvh', background: '#E5E8EB' }}>
        <TDSProviders>
          <AuthProvider>
            <PersonaProvider>
              <div style={{ width: '100%', maxWidth: 430, minHeight: '100dvh', background: 'var(--color-canvas)' }}>
                {children}
              </div>
            </PersonaProvider>
          </AuthProvider>
        </TDSProviders>
      </body>
    </html>
  )
}
