'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { AppBar } from '@/components/ui/app-bar'
import { Button } from '@/components/ui/button'
import { PageHeader } from '@/components/ui/page-header'
import { PageFooter } from '@/components/ui/page-footer'
import { TextField } from '@/components/ui/text-field'

export default function IssueVerifyPage() {
  const router = useRouter()
  const [form, setForm] = useState({ name: '', id: '', phone: '', code: '', agreed: false })
  const [codeSent, setCodeSent] = useState(false)

  const update = (key: keyof typeof form, value: string) => setForm(f => ({ ...f, [key]: value }))
  const canSubmit = form.name && form.id && form.phone && form.code && form.agreed

  return (
    <div className="flex flex-col h-full bg-canvas">
      <AppBar title="본인 확인" />
      <PageHeader title="본인 정보를 확인할게요" subtitle="발급을 위해 본인 명의 인증이 필요해요" />

      <main className="flex-1 overflow-y-auto px-5 pb-6 space-y-4">
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
        />
        <TextField
          label="휴대폰 번호"
          value={form.phone}
          onChange={e => update('phone', e.target.value)}
          placeholder="010-0000-0000"
          trailing={
            <Button variant="secondary" className="px-4 whitespace-nowrap" onClick={() => setCodeSent(true)}>
              {codeSent ? '재전송' : '인증번호 발송'}
            </Button>
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

        <button
          onClick={() => setForm(f => ({ ...f, agreed: !f.agreed }))}
          className="flex items-start gap-3 w-full text-left pt-2"
        >
          <div
            className={`w-5 h-5 rounded-md border-2 flex items-center justify-center mt-0.5 flex-shrink-0 ${
              form.agreed ? 'bg-primary border-primary' : 'border-hairline'
            }`}
          >
            {form.agreed && <span className="text-white text-xs font-bold">✓</span>}
          </div>
          <p className="text-sm text-ink-secondary leading-relaxed">
            개인정보보호법 제17조에 따른 개인정보 제3자 제공에 동의합니다
          </p>
        </button>
      </main>

      <PageFooter>
        <Button fullWidth disabled={!canSubmit} onClick={() => router.push('/issue/success')}>
          본인 확인 완료
        </Button>
      </PageFooter>
    </div>
  )
}
