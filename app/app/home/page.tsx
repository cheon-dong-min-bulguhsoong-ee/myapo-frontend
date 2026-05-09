'use client'
import { useRouter } from 'next/navigation'
import { AppBar } from '@/components/ui/app-bar'
import { IconBox } from '@/components/ui/icon-box'
import { FilePlus, Wallet, ClipboardList, Scale } from 'lucide-react'
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
    { icon: FilePlus,       label: '증명서 발급', sublabel: '새 문서 발급',  count: 0,            href: '/issue/select', tone: 'blue'   },
    { icon: Wallet,         label: '내 증명서',   sublabel: '발급된 문서',   count: validDocs,    href: '/documents',    tone: 'green'  },
    { icon: ClipboardList,  label: '발급 내역',   sublabel: '진행 중',      count: inProgress,   href: '/history',      tone: 'yellow' },
    { icon: Scale,          label: '분쟁 내역',   sublabel: '신고 현황',     count: openDisputes, href: '/disputes',     tone: 'red'    },
  ]

  return (
    <div className="safe-page-bottom flex flex-col min-h-full bg-canvas">
      <AppBar wordmark showBack={false} />

      <main className="flex-1 px-5 pt-6 pb-8 flex flex-col">
        <header>
          <h1 className="text-[26px] font-bold leading-[1.2] tracking-[-0.035em] text-ink">
            안녕하세요
          </h1>
          <p className="ds-body text-ink-secondary mt-2 text-pretty">
            해외 제출용 공공문서를<br />간편하게 발급하세요
          </p>
        </header>

        <div className="grid grid-cols-2 gap-3 mt-8">
          {menuItems.map(({ icon, label, sublabel, count, href, tone }) => (
            <button
              key={href}
              type="button"
              onClick={() => router.push(href)}
              className="press relative h-40 rounded-[20px] bg-paper border border-hairline-soft p-5 flex flex-col items-center justify-center text-center active:bg-canvas transition-colors"
            >
              {count > 0 && (
                <span
                  className="absolute top-3 right-3 min-w-5 h-5 px-1.5 rounded-full bg-primary text-white text-[11px] font-bold flex items-center justify-center"
                  aria-label={`${count}건`}
                >
                  {count}
                </span>
              )}
              <IconBox icon={icon} tone={tone} size="md" />
              <p className="ds-headline mt-3">{label}</p>
              <p className="text-[12px] text-ink-muted mt-0.5 font-medium">{sublabel}</p>
            </button>
          ))}
        </div>

      </main>
    </div>
  )
}
