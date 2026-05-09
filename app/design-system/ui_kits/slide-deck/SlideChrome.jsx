/** @jsx React.createElement */
// Slide-deck UI kit — shared slide chrome.
// Every slide is a 1920×1080 <section class="slide"> containing .frame-top + content.

const BrandMark = ({ size = 24 }) => (
  <span className="brand-mark" style={{ width: size, height: size, display: 'inline-block' }}>
    <svg viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2a10 10 0 0 1 10 10h-10V2z" />
      <path d="M12 22a10 10 0 0 1-10-10h10v10z" />
    </svg>
  </span>
);

const FrameTop = ({ section, index, total }) => (
  <div className="frame-top">
    <span className="tag">
      <BrandMark size={24} />
      <span>{section}</span>
    </span>
    <span className="num">{String(index).padStart(2, '0')} / {String(total).padStart(2, '0')}</span>
  </div>
);

const Slide = ({ bg = 'light', label, children }) => {
  const cls = 'slide' + (bg === 'ink' ? ' bg-ink' : bg === 'blue' ? ' bg-blue' : bg === 'soft' ? ' bg-soft' : '');
  return <section className={cls} data-screen-label={label}>{children}</section>;
};

Object.assign(window, { BrandMark, FrameTop, Slide });
