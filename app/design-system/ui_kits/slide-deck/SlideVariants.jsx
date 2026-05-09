/** @jsx React.createElement */
// Slide-deck UI kit · slide variants.

const CoverSlide = ({ section = 'Brand · Project', index = 1, total = 12, eyebrow = 'v1.0', title, kicker, meta = '팀 · 발표자 · 2026' }) => (
  <Slide label={String(index).padStart(2,'0') + ' Cover'}>
    <FrameTop section={section} index={index} total={total} />
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
      <div className="display-cover">{title}</div>
      <div className="body" style={{ fontSize: 28, color: 'var(--ink-3)', marginTop: 40, maxWidth: 1200 }}>{kicker}</div>
    </div>
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', fontSize: 20, color: 'var(--ink-4)', paddingTop: 32, borderTop: '1px solid var(--line)' }}>
      <span><strong style={{ color: 'var(--ink)', fontWeight: 600 }}>{meta}</strong></span>
      <span className="num">{eyebrow}</span>
    </div>
  </Slide>
);

const ContentSlide = ({ section, index, total, eyebrow, title, children }) => (
  <Slide label={String(index).padStart(2,'0') + ' Content'}>
    <FrameTop section={section} index={index} total={total} />
    {eyebrow ? <div className="eyebrow">{eyebrow}</div> : null}
    <h2 className="title" dangerouslySetInnerHTML={{ __html: title }} />
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 32, minHeight: 0 }}>{children}</div>
  </Slide>
);

const SectionBreakSlide = ({ bg = 'ink', section = 'Chapter 2', index, total, chapter, statement }) => (
  <Slide bg={bg} label={String(index).padStart(2,'0') + ' Section'}>
    <FrameTop section={section} index={index} total={total} />
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
      <div style={{ fontFamily: "'Work Sans', sans-serif", fontSize: 18, letterSpacing: '0.1em', textTransform: 'uppercase', color: bg === 'ink' ? 'var(--blue-tint)' : 'rgba(255,255,255,0.8)', fontWeight: 600, marginBottom: 28 }}>{chapter}</div>
      <h1 style={{ fontSize: 120, lineHeight: 1.05, fontWeight: 700, letterSpacing: '-0.04em', margin: 0, color: '#fff', textWrap: 'balance', maxWidth: 1600 }} dangerouslySetInnerHTML={{ __html: statement }} />
    </div>
  </Slide>
);

const BigNumberSlide = ({ section, index, total, eyebrow, number, title, caption }) => (
  <Slide label={String(index).padStart(2,'0') + ' Big number'}>
    <FrameTop section={section} index={index} total={total} />
    {eyebrow ? <div className="eyebrow">{eyebrow}</div> : null}
    <div style={{ flex: 1, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 80, alignItems: 'center' }}>
      <div className="display-bignum" style={{ fontSize: 520 }}>{number}</div>
      <div>
        <h2 style={{ fontSize: 64, lineHeight: 1.1, fontWeight: 700, letterSpacing: '-0.03em', margin: '0 0 32px' }} dangerouslySetInnerHTML={{ __html: title }} />
        <div style={{ fontSize: 26, color: 'var(--ink-3)', lineHeight: 1.5, maxWidth: 640, fontWeight: 500 }} dangerouslySetInnerHTML={{ __html: caption }} />
      </div>
    </div>
  </Slide>
);

const EvidenceSlide = ({ section, index, total, title, lbl, text, risk, defense = [] }) => (
  <Slide label={String(index).padStart(2,'0') + ' Evidence'}>
    <FrameTop section={section} index={index} total={total} />
    <h2 className="title" dangerouslySetInnerHTML={{ __html: title }} />
    <div style={{ flex: 1, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 48, alignItems: 'start' }}>
      <div className="evidence">
        <div className="lbl">{lbl}</div>
        <div className="text" dangerouslySetInnerHTML={{ __html: text }} />
        {risk ? <div className="risk">{risk}</div> : null}
      </div>
      <div className="numbered-list">
        {defense.map((d, i) => (
          <div className="item" key={i}>
            <div className="n">{String(i + 1).padStart(2, '0')}</div>
            <div className="text" dangerouslySetInnerHTML={{ __html: d }} />
          </div>
        ))}
      </div>
    </div>
  </Slide>
);

Object.assign(window, { CoverSlide, ContentSlide, SectionBreakSlide, BigNumberSlide, EvidenceSlide });
