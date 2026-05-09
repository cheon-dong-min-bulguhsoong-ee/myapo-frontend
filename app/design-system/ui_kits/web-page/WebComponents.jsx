/** @jsx React.createElement */
// Web page UI kit · reusable pieces.

const WebHeader = ({ onNav, current = 'home' }) => (
  <header style={{ position: 'sticky', top: 0, zIndex: 10, background: 'rgba(255,255,255,0.9)', backdropFilter: 'blur(8px)', borderBottom: '1px solid var(--line)' }}>
    <div style={{ maxWidth: 1280, margin: '0 auto', padding: '16px 64px', display: 'flex', alignItems: 'center', gap: 28 }}>
      <a onClick={() => onNav('home')} style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer' }}>
        <span style={{ width: 28, height: 28, color: 'var(--blue)' }}>
          <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2a10 10 0 0 1 10 10h-10V2z" /><path d="M12 22a10 10 0 0 1-10-10h10v10z" /></svg>
        </span>
        <span style={{ fontSize: 20, fontWeight: 700, letterSpacing: '-0.02em' }}>Claude</span>
      </a>
      <nav style={{ display: 'flex', gap: 24, marginLeft: 20, flex: 1 }}>
        {['Product', 'Pricing', 'Docs', 'Blog'].map(x => (
          <a key={x} onClick={() => onNav(x.toLowerCase())} style={{ fontSize: 15, fontWeight: 600, color: current === x.toLowerCase() ? 'var(--ink)' : 'var(--ink-3)', cursor: 'pointer' }}>{x}</a>
        ))}
      </nav>
      <button className="btn ghost">로그인</button>
      <button className="btn primary">시작하기</button>
    </div>
  </header>
);

const Hero = ({ onStart }) => (
  <section style={{ maxWidth: 1280, margin: '0 auto', padding: '120px 64px 80px' }}>
    <span className="chip" style={{ marginBottom: 32 }}>
      <span style={{ width: 6, height: 6, borderRadius: 999, background: 'var(--blue)' }}></span>
      <span>v2.0 · <span className="en">Credential Bundle</span> 출시</span>
    </span>
    <h1 style={{ fontSize: 88, lineHeight: 1.05, letterSpacing: '-0.04em', fontWeight: 700, margin: '0 0 28px', maxWidth: 1100 }}>
      크레딧이 아니라,<br/><span style={{ color: 'var(--blue)' }}>증명</span>으로 대출한다.
    </h1>
    <p style={{ fontSize: 24, color: 'var(--ink-3)', lineHeight: 1.55, fontWeight: 500, maxWidth: 720, margin: '0 0 40px' }}>
      비자·소득·거주를 온체인 VC로 묶어 제출. <span className="num" style={{ color: 'var(--ink)' }}>90초</span> 내 승인.
    </p>
    <div style={{ display: 'flex', gap: 12 }}>
      <button className="btn primary lg" onClick={onStart}>지금 신청하기</button>
      <button className="btn ghost">자세히 보기 →</button>
    </div>
  </section>
);

const FeatureGrid = () => (
  <section style={{ maxWidth: 1280, margin: '0 auto', padding: '80px 64px' }}>
    <div className="eyebrow">WHY NOW</div>
    <h2 style={{ fontSize: 52, fontWeight: 700, letterSpacing: '-0.03em', margin: '0 0 48px', maxWidth: 900 }}>
      기존 심사가 놓친 <span style={{ color: 'var(--blue)' }}>3가지</span>를 채운다.
    </h2>
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 16 }}>
      {[
        { n: '01', h: 'On-chain primitive', b: 'XRPL은 W3C VC를 <strong>프로토콜 레벨</strong>에서 지원. 파서·검증기 필요 없음.' },
        { n: '02', h: '0.00001 XRP / tx', b: 'Ethereum 대비 <strong>6,000×</strong> 저렴. 평균 3–5초 정산.', ink: true },
        { n: '03', h: '90초 승인', b: '자동 검증 파이프라인. 사람이 개입하는 단계 <strong>0</strong>.' },
      ].map((f, i) => (
        <div key={i} className={'why-card' + (f.ink ? ' ink' : '')}>
          <div className="idx">{f.n} / 03</div>
          <h3 style={{ fontSize: 32, fontWeight: 700, letterSpacing: '-0.025em', margin: 0 }}>{f.h}</h3>
          <p className="body" style={{ fontSize: 17, lineHeight: 1.55, color: f.ink ? 'rgba(255,255,255,0.82)' : 'var(--ink-2)' }} dangerouslySetInnerHTML={{ __html: f.b }} />
        </div>
      ))}
    </div>
  </section>
);

const Comparison = () => (
  <section style={{ background: 'var(--bg-soft)', padding: '80px 0' }}>
    <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 64px' }}>
      <div className="eyebrow">COMPARISON</div>
      <h2 style={{ fontSize: 52, fontWeight: 700, letterSpacing: '-0.03em', margin: '0 0 40px' }}>
        왜 우리가 <span style={{ color: 'var(--blue)' }}>유일한</span> 답인가.
      </h2>
      <div className="comp-table">
        <div className="comp-row comp-head"><div>Competitor</div><div>Approach</div><div className="comp-cell-head">On-chain?</div></div>
        <div className="comp-row"><div className="comp-name">전통 은행 <span className="tagy">Legacy</span></div><div className="comp-desc">국내 크레딧 스코어 기반. <strong>외국인 거의 불가.</strong></div><div className="comp-cell no">✕</div></div>
        <div className="comp-row"><div className="comp-name">DeFi 대출 <span className="tagy">Crypto</span></div><div className="comp-desc">담보형. <strong>크레딧 역사 무의미.</strong></div><div className="comp-cell partial">△</div></div>
        <div className="comp-row us"><div className="comp-name">Claude <span className="tagy">XRPL</span></div><div className="comp-desc"><strong>Credential Bundle</strong>로 소득·체류를 온체인 증명.</div><div className="comp-cell yes">✓</div></div>
      </div>
    </div>
  </section>
);

const CTASection = ({ onStart }) => (
  <section style={{ maxWidth: 1280, margin: '0 auto', padding: '96px 64px' }}>
    <div className="card ink" style={{ padding: 72, display: 'grid', gridTemplateColumns: '1fr auto', alignItems: 'center', gap: 48 }}>
      <div>
        <h2 style={{ fontSize: 56, fontWeight: 700, letterSpacing: '-0.03em', margin: '0 0 16px', color: '#fff' }}>90초면 충분하다.</h2>
        <p className="body" style={{ color: 'rgba(255,255,255,0.8)', fontSize: 22, margin: 0 }}>비자 발급일 기준 3개월 이상이면 신청 가능.</p>
      </div>
      <button className="btn primary lg" onClick={onStart} style={{ background: '#fff', color: 'var(--blue)' }}>지금 신청</button>
    </div>
  </section>
);

const WebFooter = () => (
  <footer style={{ borderTop: '1px solid var(--line)', padding: '48px 64px', maxWidth: 1280, margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 24 }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
      <span style={{ width: 22, height: 22, color: 'var(--blue)' }}>
        <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2a10 10 0 0 1 10 10h-10V2z" /><path d="M12 22a10 10 0 0 1-10-10h10v10z" /></svg>
      </span>
      <span className="label" style={{ color: 'var(--ink-4)' }}>© 2026 · Claude Design System</span>
    </div>
    <div style={{ display: 'flex', gap: 24 }}>
      {['Privacy', 'Terms', 'Contact'].map(x => <a key={x} style={{ fontSize: 14, color: 'var(--ink-3)', fontWeight: 500, cursor: 'pointer' }}>{x}</a>)}
    </div>
  </footer>
);

const ApplyModal = ({ onClose }) => (
  <div style={{ position: 'fixed', inset: 0, background: 'rgba(25,31,40,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 }} onClick={onClose}>
    <div className="card" style={{ background: '#fff', width: 520, padding: 48 }} onClick={e => e.stopPropagation()}>
      <div className="eyebrow">APPLY</div>
      <h4 style={{ fontSize: 32, margin: '0 0 20px' }}>신청서</h4>
      <input placeholder="이메일" style={{ width: '100%', padding: '14px 18px', fontSize: 16, border: '1px solid var(--line)', borderRadius: 12, marginBottom: 10, boxSizing: 'border-box', fontFamily: 'inherit' }} />
      <input placeholder="비자 번호" style={{ width: '100%', padding: '14px 18px', fontSize: 16, border: '1px solid var(--line)', borderRadius: 12, marginBottom: 20, boxSizing: 'border-box', fontFamily: 'inherit' }} />
      <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
        <button className="btn ghost" onClick={onClose}>취소</button>
        <button className="btn primary" onClick={onClose}>제출</button>
      </div>
    </div>
  </div>
);

Object.assign(window, { WebHeader, Hero, FeatureGrid, Comparison, CTASection, WebFooter, ApplyModal });
