'use client'

import { usePathname } from 'next/navigation'
import type { ReactNode } from 'react'
import { AuthProvider } from '@/contexts/auth-context'
import { PersonaProvider } from '@/contexts/persona-context'
import { BottomHomeBar } from '@/components/ui/bottom-home-bar'
import { ProductNav } from '@/components/product-nav'

const PRODUCT_ROUTES = new Set(['/'])
const PRODUCT_NAV_ROUTES = new Set(['/home'])

export function RouteShell({ children }: { children: ReactNode }) {
  const pathname = usePathname()

  if (PRODUCT_ROUTES.has(pathname)) {
    return children
  }

  const showProductNav = PRODUCT_NAV_ROUTES.has(pathname)

  return (
    <div className={showProductNav ? 'app-body app-body-with-product-nav' : 'app-body'}>
      {showProductNav && <ProductNav active="app" />}
      <AuthProvider>
        <PersonaProvider>
          <div className="app-frame">
            <div className="app-scroll flex flex-col">{children}</div>
            <BottomHomeBar />
          </div>
        </PersonaProvider>
      </AuthProvider>
    </div>
  )
}
