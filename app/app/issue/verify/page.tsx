'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Check } from 'lucide-react'
import { AppBar } from '@/components/ui/app-bar'
import { Pill } from '@/components/ui/pill'
import { TextField } from '@/components/ui/text-field'
import { PageFooter } from '@/components/ui/page-footer'

export default function IssueVerifyPage() {
  const router = useRouter()
  const [form, setForm] = useState({ name: '', id: '', phone: '', code: '', agreed: false })
  const [codeSent, setCodeSent] = useState(false)

  const update = (key: keyof typeof form, value: string) => setForm(f => ({ ...f, [key]: value }))
  const canSubmit = form.name && form.id && form.phone && form.code && form.agreed

  return (
    <div className="flex flex-col flex-1 min-h-full">
      <AppBar
        title="본인 확인"
        badges={<Pill variant="testnet" size="sm">Testnet</Pill>}
      />

      <main className="app-content flex-1 overflow-y-auto">
        <div className="text-[15px] font-bold text-ink mb-1">본인 정보를 확인할게요</div>
        <div className="text-[12px] leading-relaxed text-sub mb-3">발급을 위해 본인 명의 인증이 필요해요</div>

        <div className="card flex flex-col gap-4">
          <TextField
            label="이름"
            value={form.name}
            onChange={e => update('name', e.target.value)}
            placeholder="홍길동"
          />
          <TextField
            label="주민등록번호 앞 6자리"
            value={form.id}
            onChange={e => update('id', e.target.value)}
            placeholder="000000"
            maxLength={6}
          />
          <TextField
            label="휴대폰 번호"
            value={form.phone}
            onChange={e => update('phone', e.target.value)}
            placeholder="010-0000-0000"
            trailing={
              <button
                type="button"
                onClick={() => setCodeSent(true)}
                className="btn-secondary"
                style={{ width: 'auto', height: 48, padding: '0 14px', fontSize: 14 }}
              >
                {codeSent ? '재전송' : '인증번호'}
              </button>
            }
          />
          {codeSent && (
            <TextField
              label="인증번호"
              value={form.code}
              onChange={e => update('code', e.target.value)}
              placeholder="6자리 입력"
              maxLength={6}
            />
          )}
        </div>

        <button
          type="button"
          onClick={() => setForm(f => ({ ...f, agreed: !f.agreed }))}
          className="press flex items-start gap-3 w-full text-left mt-4 px-1"
        >
          <div
            className={`w-5 h-5 rounded-md flex items-center justify-center mt-0.5 flex-shrink-0 transition-colors ${
              form.agreed ? 'bg-primary' : 'bg-white border-2 border-border'
            }`}
          >
            {form.agreed && <Check size={14} className="text-white" strokeWidth={3} />}
          </div>
          <p className="text-[12px] leading-relaxed text-sub">
            개인정보보호법 제17조에 따른 개인정보 제3자 제공에 동의합니다
          </p>
        </button>
      </main>

      <PageFooter>
        <button
          type="button"
          disabled={!canSubmit}
          onClick={() => router.push('/issue/success')}
          className="btn-primary"
        >
          본인 확인 완료
        </button>
      </PageFooter>
    </div>
  )
}
