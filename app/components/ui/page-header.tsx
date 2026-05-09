interface PageHeaderProps {
  title: string
  subtitle?: string
  eyebrow?: string
  size?: 'compact' | 'hero'
}

export function PageHeader({ title, subtitle, eyebrow, size = 'compact' }: PageHeaderProps) {
  const isHero = size === 'hero'
  return (
    <header className={`shrink-0 px-5 bg-canvas ${isHero ? 'pt-7 pb-5' : 'pt-4 pb-3'}`}>
      {eyebrow && (
        <p className="ds-overline text-primary mb-2">
          {eyebrow}
        </p>
      )}
      {isHero ? (
        <h1 className="ds-page-title">{title}</h1>
      ) : (
        <h1 className="ds-headline">{title}</h1>
      )}
      {subtitle && (
        <p
          className={`text-ink-secondary text-pretty ${
            isHero ? 'ds-body mt-2.5' : 'text-[12px] mt-1 leading-snug'
          }`}
        >
          {subtitle}
        </p>
      )}
    </header>
  )
}
