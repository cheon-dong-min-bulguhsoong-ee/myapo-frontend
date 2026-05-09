'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { AppBar } from '@/components/ui/app-bar'
import { Button } from '@/components/ui/button'

export default function IssueVerifyPage() {
  const router = useRouter()
  const [form, setForm] = useState({ name: '', id: '', phone: '', code: '', agreed: false })
  const [codeSent, setCodeSent] = useState(false)

  const canSubmit = form.name && form.id && form.phone && form.code && form.agreed

  return (
    <div className="flex flex-col min-h-full" style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}>
      <AppBar title="본인 확인" />
      <main className="flex-1 px-5 py-4 space-y-4 overflow-y-auto">
        <p className="text-sm text-ink-secondary">본인 확인 후 서류 발급이 진행됩니다</p>

        {[
          { key: 'name', label: '이름', placeholder: '홍길동' },
          { key: 'id', label: '주민등록번호 앞 6자리', placeholder: '000000' },
        ].map(({ key, label, placeholder }) => (
          <div key={key}>
            <p className="text-sm font-semibold text-ink mb-1.5">{label}</p>
            <input
              value={form[key as keyof typeof form] as string}
              onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
              placeholder={placeholder}
              className="w-full h-[52px] px-4 rounded-xl border border-hairline bg-paper text-sm focus:outline-none focus:border-primary"
            />
          </div>
        ))}

        <div>
          <p className="text-sm font-semibold text-ink mb-1.5">휴대폰 번호</p>
          <div className="flex gap-2">
            <input
              value={form.phone}
              onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
              placeholder="010-0000-0000"
              className="flex-1 h-[52px] px-4 rounded-xl border border-hairline bg-paper text-sm focus:outline-none focus:border-primary"
            />
            <Button variant="secondary" className="px-4 whitespace-nowrap" onClick={() => setCodeSent(true)}>
              {codeSent ? '재전송' : '인증번호 발송'}
            </Button>
          </div>
        </div>

        {codeSent && (
          <div>
            <p className="text-sm font-semibold text-ink mb-1.5">인증번호</p>
            <input
              value={form.code}
              onChange={e => setForm(f => ({ ...f, code: e.target.value }))}
              placeholder="6자리 입력"
              maxLength={6}
              className="w-full h-[52px] px-4 rounded-xl border border-hairline bg-paper text-sm focus:outline-none focus:border-primary"
            />
          </div>
        )}

        <button
          onClick={() => setForm(f => ({ ...f, agreed: !f.agreed }))}
          className="flex items-start gap-3 w-full text-left"
        >
          <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center mt-0.5 flex-shrink-0 ${form.agreed ? 'bg-primary border-primary' : 'border-hairline'}`}>
            {form.agreed && <span className="text-white text-xs font-bold">✓</span>}
          </div>
          <p className="text-sm text-ink-secondary">
            개인정보보호법 제17조에 따른 개인정보 제3자 제공에 동의합니다
          </p>
        </button>
      </main>
      <div className="px-5 pb-6">
        <Button fullWidth disabled={!canSubmit} onClick={() => router.push('/issue/success')}>
          본인 확인 완료
        </Button>
      </div>
    </div>
  )
}
