'use client'
import { useRouter } from 'next/navigation'
import { AppBar } from '@/components/ui/app-bar'
import { FileText, Folder, Clock, AlertCircle } from 'lucide-react'

const menuItems = [
  { icon: FileText, label: '발급 신청', href: '/issue/select', color: 'text-primary', bg: 'bg-primary-soft' },
  { icon: Folder, label: '내 문서', href: '/documents', color: 'text-success', bg: 'bg-success/10' },
  { icon: Clock, label: '발급 현황', href: '/history', color: 'text-warning', bg: 'bg-warning/10' },
  { icon: AlertCircle, label: '이의 신청', href: '/disputes', color: 'text-danger', bg: 'bg-danger/10' },
]

export default function HomePage() {
  const router = useRouter()
  return (
    <div className="flex flex-col min-h-dvh" style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}>
      <AppBar wordmark showBack={false} />
      <main className="flex-1 px-5 py-6">
        <p className="text-sm text-ink-secondary mb-6">서비스를 선택해 주세요</p>
        <div className="grid grid-cols-2 gap-4">
          {menuItems.map(({ icon: Icon, label, href, color, bg }) => (
            <button
              key={href}
              onClick={() => router.push(href)}
              className="bg-paper rounded-2xl border border-hairline p-5 flex flex-col gap-3 active:bg-canvas text-left"
              style={{ boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}
            >
              <div className={`w-12 h-12 rounded-xl ${bg} flex items-center justify-center`}>
                <Icon size={24} className={color} />
              </div>
              <span className="text-base font-bold text-ink">{label}</span>
            </button>
          ))}
        </div>
      </main>
    </div>
  )
}
