'use client'
import { useRouter } from 'next/navigation'
import { AppBar } from '@/components/ui/app-bar'
import { FilePlus, Wallet, ClipboardList, Scale, ArrowRight, Sparkles } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { mockDocuments, mockApplications, mockDisputes } from '@/lib/mock-data'

interface MenuItem {
  icon: LucideIcon
  label: string
  sublabel: string
  count: number
  href: string
  tint: string
  bg: string
}

export default function HomePage() {
  const router = useRouter()

  const validDocs = mockDocuments.filter(d => d.status === 'available').length
  const inProgress = mockApplications.length
  const openDisputes = mockDisputes.filter(d => d.status !== 'closed').length

  const menuItems: MenuItem[] = [
    { icon: FilePlus, label: '증명서 발급', sublabel: '새 문서 발급', count: 0, href: '/issue/select', tint: '#3182F6', bg: '#EBF3FE' },
    { icon: Wallet, label: '내 증명서', sublabel: '발급된 문서', count: validDocs, href: '/documents', tint: '#00C48C', bg: '#E6FAF5' },
    { icon: ClipboardList, label: '발급 내역', sublabel: '진행 중', count: inProgress, href: '/history', tint: '#FFB020', bg: '#FFF8E6' },
    { icon: Scale, label: '분쟁 내역', sublabel: '신고 현황', count: openDisputes, href: '/disputes', tint: '#F04452', bg: '#FEE7E9' },
  ]

  return (
    <div className="flex flex-col min-h-full" style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}>
      <AppBar wordmark showBack={false} />

      <main className="flex-1 px-5 pt-4 pb-8 space-y-5">
        {/* Greeting */}
        <div>
          <h1 className="text-[22px] font-bold tracking-[-0.02em] text-ink leading-tight">안녕하세요</h1>
          <p className="text-sm text-ink-secondary mt-1">해외 제출용 공공문서를 간편하게 발급하세요</p>
        </div>

        {/* Promo / hero CTA */}
        <button
          onClick={() => router.push('/issue/select')}
          className="w-full text-left rounded-2xl p-5 flex items-center gap-4 active:opacity-90 transition-opacity"
          style={{
            background: 'linear-gradient(135deg, #3182F6 0%, #6FA8FF 100%)',
            boxShadow: '0 6px 20px rgba(49,130,246,0.25)',
          }}
        >
          <div
            className="shrink-0 w-12 h-12 rounded-xl flex items-center justify-center"
            style={{ backgroundColor: 'rgba(255,255,255,0.18)' }}
          >
            <Sparkles size={24} strokeWidth={2} style={{ color: '#fff' }} />
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-white font-bold text-[15px] leading-tight">해외 제출이 필요하신가요?</div>
            <div className="text-white/80 text-xs mt-1">증명서 발급부터 아포스티유까지 한번에</div>
          </div>
          <ArrowRight size={20} style={{ color: '#fff' }} />
        </button>

        {/* Menu list */}
        <div
          className="bg-paper rounded-2xl overflow-hidden"
          style={{
            boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
            border: '1px solid var(--color-hairline)',
          }}
        >
          {menuItems.map(({ icon: Icon, label, sublabel, count, href, tint, bg }, idx) => (
            <button
              key={href}
              onClick={() => router.push(href)}
              className="w-full flex items-center gap-4 px-4 py-4 active:bg-canvas text-left transition-colors"
              style={idx > 0 ? { borderTop: '1px solid var(--color-hairline)' } : undefined}
            >
              <div
                className="shrink-0 w-11 h-11 rounded-xl flex items-center justify-center"
                style={{ backgroundColor: bg }}
              >
                <Icon size={22} strokeWidth={2} style={{ color: tint }} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-[15px] font-bold text-ink leading-tight">{label}</div>
                <div className="text-xs text-ink-muted mt-0.5">{sublabel}</div>
              </div>
              {count > 0 && (
                <span
                  className="text-[11px] font-bold px-2 py-0.5 rounded-full"
                  style={{ backgroundColor: tint, color: '#fff' }}
                >
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
