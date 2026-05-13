'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { FilePlus, Wallet, ClipboardList, Scale } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { AppBar } from '@/components/ui/app-bar'
import { AppContent } from '@/components/ui/app-content'
import { Pill } from '@/components/ui/pill'
import { useAuth } from '@/contexts/auth-context'
import { listDisputes, listDocumentMvp } from '@/lib/myapo-api'

interface MenuItem {
  icon: LucideIcon
  label: string
  sublabel: string
  count: number | null
  href: string
  tone: 'blue' | 'green' | 'yellow' | 'red'
}

const toneBg: Record<MenuItem['tone'], string> = {
  blue:   'bg-primary-soft text-primary',
  green:  'bg-success-soft text-success',
  yellow: 'bg-warning-soft text-warning',
  red:    'bg-danger-soft text-danger',
}

interface HomeCountsState {
  accessToken: string | null
  validDocs: number | null
  inProgress: number | null
  openDisputes: number | null
}

const EMPTY_COUNTS: HomeCountsState = {
  accessToken: null,
  validDocs: null,
  inProgress: null,
  openDisputes: null,
}

function isOpenDispute(status: string) {
  return status !== 'RESOLVED' && status !== 'REJECTED'
}

export default function HomePage() {
  const router = useRouter()
  const { accessToken } = useAuth()
  const [countsState, setCountsState] = useState<HomeCountsState>(EMPTY_COUNTS)

  useEffect(() => {
    if (!accessToken) return

    let ignore = false

    Promise.allSettled([
      listDocumentMvp(accessToken),
      listDisputes(accessToken),
    ])
      .then(([documentsResult, disputesResult]) => {
        if (ignore) return

        if (documentsResult.status === 'rejected') {
          console.error('Failed to load home document badge counts:', documentsResult.reason)
        }
        if (disputesResult.status === 'rejected') {
          console.error('Failed to load home dispute badge count:', disputesResult.reason)
        }

        const documentItems = documentsResult.status === 'fulfilled' ? documentsResult.value.items : null
        const disputes = disputesResult.status === 'fulfilled' ? disputesResult.value.disputes : null

        setCountsState({
          accessToken,
          validDocs: documentItems ? documentItems.filter(item => item.isSuccess).length : null,
          inProgress: documentItems ? documentItems.filter(item => !item.isSuccess).length : null,
          openDisputes: disputes ? disputes.filter(dispute => isOpenDispute(dispute.status)).length : null,
        })
      })

    return () => {
      ignore = true
    }
  }, [accessToken])

  const counts = countsState.accessToken === accessToken ? countsState : EMPTY_COUNTS

  const menuItems: MenuItem[] = [
    { icon: FilePlus,      label: '증명서 발급', sublabel: '새 문서 발급',  count: null,                href: '/issue/select', tone: 'blue'   },
    { icon: Wallet,        label: '내 증명서',   sublabel: '발급된 문서',   count: counts.validDocs,     href: '/documents',    tone: 'green'  },
    { icon: ClipboardList, label: '발급 내역',   sublabel: '진행 중',        count: counts.inProgress,    href: '/history',      tone: 'yellow' },
    { icon: Scale,         label: '분쟁 내역',   sublabel: '신고 현황',      count: counts.openDisputes,  href: '/disputes',     tone: 'red'    },
  ]

  return (
    <div className="flex flex-col flex-1 min-h-full">
      <AppBar
        wordmark
        showBack={false}
        badges={
          <>
            <Pill variant="testnet" size="sm">Testnet</Pill>
            <Pill variant="precheck" size="sm">Pre-Check Only</Pill>
          </>
        }
      />

      <AppContent>
        <div className="text-[15px] font-bold text-ink mb-1">무엇을 도와드릴까요?</div>
        <div className="text-[12px] leading-relaxed text-sub mb-3">자주 쓰는 메뉴를 모아두었어요</div>

        <div className="grid grid-cols-2 gap-2">
          {menuItems.map(({ icon: Icon, label, sublabel, count, href, tone }) => (
            <button
              key={href}
              type="button"
              onClick={() => router.push(href)}
              className="card press relative flex flex-col items-start text-left gap-2"
              style={{ minHeight: 132 }}
            >
              {count !== null && (
                <span
                  className="absolute top-3 right-3 min-h-6 min-w-6 px-1.5 rounded-full bg-primary text-white text-[12px] font-bold flex items-center justify-center"
                  aria-label={`${count}건`}
                >
                  {count}
                </span>
              )}
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${toneBg[tone]}`}>
                <Icon size={20} strokeWidth={2} />
              </div>
              <div>
                <p className="text-[15px] font-bold text-ink leading-snug">{label}</p>
                <p className="text-[12px] text-muted mt-0.5">{sublabel}</p>
              </div>
            </button>
          ))}
        </div>
      </AppContent>
    </div>
  )
}
