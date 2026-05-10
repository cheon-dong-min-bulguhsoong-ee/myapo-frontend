'use client'
import { Home, Folder, Settings } from 'lucide-react'
import { useRouter, usePathname } from 'next/navigation'

const HIDE_ON = ['/', '/login', '/persona-select', '/issue/success', '/disputes/success', '/issue-complete']

interface NavItem {
  label: string
  Icon: typeof Home
  href: string
  match: (p: string) => boolean
}

const items: NavItem[] = [
  { label: '홈',     Icon: Home,     href: '/home',         match: (p) => p === '/home' },
  { label: '내 문서', Icon: Folder,   href: '/documents',    match: (p) => p.startsWith('/documents') },
  { label: '설정',    Icon: Settings, href: '/persona-select', match: (p) => p.startsWith('/persona-select') },
]

export function BottomHomeBar() {
  const router = useRouter()
  const pathname = usePathname()

  if (HIDE_ON.some(h => pathname === h)) return null

  return (
    <nav className="mobile-nav" role="tablist" aria-label="주요 페이지">
      {items.map(({ label, Icon, href, match }) => {
        const active = match(pathname)
        return (
          <button
            key={href}
            type="button"
            role="tab"
            aria-label={label}
            aria-selected={active}
            onClick={() => router.push(href)}
            className="press flex flex-col items-center justify-center gap-0.5 flex-1 h-full transition-colors"
          >
            <Icon
              size={20}
              strokeWidth={active ? 2.2 : 1.8}
              className={active ? 'text-primary' : 'text-muted'}
            />
            <span className={`text-[10px] font-bold ${active ? 'text-primary' : 'text-muted'}`}>{label}</span>
          </button>
        )
      })}
    </nav>
  )
}
