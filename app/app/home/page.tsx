'use client'
import { useRouter } from 'next/navigation'
import { AppBar } from '@/components/ui/app-bar'
import { IconBox } from '@/components/ui/icon-box'
import { FilePlus, Wallet, ClipboardList, Scale, ArrowRight, Sparkles } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { mockDocuments, mockApplications, mockDisputes } from '@/lib/mock-data'

interface MenuItem {
  icon: LucideIcon
  label: string
  sublabel: string
  count: number
  href: string
  tone: 'blue' | 'green' | 'yellow' | 'red'
}

export default function HomePage() {
  const router = useRouter()

  const validDocs = mockDocuments.filter(d => d.status === 'available').length
  const inProgress = mockApplications.length
  const openDisputes = mockDisputes.filter(d => d.status !== 'closed').length

  const menuItems: MenuItem[] = [
    { icon: FilePlus, label: '증명서 발급', sublabel: '새 문서 발급', count: 0, href: '/issue/select', tone: 'blue' },
    { icon: Wallet, label: '내 증명서', sublabel: '발급된 문서', count: validDocs, href: '/documents', tone: 'green' },
    { icon: ClipboardList, label: '발급 내역', sublabel: '진행 중', count: inProgress, href: '/history', tone: 'yellow' },
    { icon: Scale, label: '분쟁 내역', sublabel: '신고 현황', count: openDisputes, href: '/disputes', tone: 'red' },
  ]

  return (
    <div className="safe-page-bottom flex flex-col min-h-full">
      <AppBar wordmark showBack={false} />

      <main className="flex-1 px-5 pt-4 pb-8 space-y-5">
        <div>
          <h1 className="ds-title">안녕하세요</h1>
          <p className="text-sm text-ink-secondary mt-1">해외 제출용 공공문서를 간편하게 발급하세요</p>
        </div>

        <button
          onClick={() => router.push('/issue/select')}
          className="ds-hero-cta w-full text-left p-5 flex items-center gap-4 active:opacity-90 transition-opacity"
        >
          <div className="ds-hero-icon shrink-0 w-12 h-12 rounded-xl flex items-center justify-center">
            <Sparkles size={24} strokeWidth={2} className="text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="ds-body text-white font-bold">해외 제출이 필요하신가요?</div>
            <div className="text-white/80 text-xs mt-1">증명서 발급부터 아포스티유까지 한번에</div>
          </div>
          <ArrowRight size={20} className="text-white" />
        </button>

        <div className="ds-card overflow-hidden">
          {menuItems.map(({ icon, label, sublabel, count, href, tone }, idx) => (
            <button
              key={href}
              onClick={() => router.push(href)}
              className={`w-full flex items-center gap-4 px-4 py-4 active:bg-canvas text-left transition-colors ${idx > 0 ? 'ds-divider-top' : ''}`}
            >
              <IconBox icon={icon} tone={tone} size="md" />
              <div className="flex-1 min-w-0">
                <div className="ds-body font-bold text-ink">{label}</div>
                <div className="text-xs text-ink-muted mt-0.5">{sublabel}</div>
              </div>
              {count > 0 && (
                <span className={`chip sm ds-tone-${tone}`}>
                  {count}
                </span>
              )}
              <ArrowRight size={18} className="text-ink-muted shrink-0" />
            </button>
          ))}
        </div>
      </main>
    </div>
  )
}
