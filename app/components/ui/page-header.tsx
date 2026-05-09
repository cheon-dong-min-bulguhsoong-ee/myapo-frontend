interface PageHeaderProps {
  title: string
  subtitle?: string
  eyebrow?: string
}

export function PageHeader({ title, subtitle, eyebrow }: PageHeaderProps) {
  return (
    <header className="shrink-0 px-5 pt-7 pb-5 bg-canvas">
      {eyebrow && (
        <p className="ds-overline text-primary mb-2">
          {eyebrow}
        </p>
      )}
      <h1 className="ds-page-title">
        {title}
      </h1>
      {subtitle && (
        <p className="ds-body text-ink-secondary mt-2.5 text-pretty">
          {subtitle}
        </p>
      )}
    </header>
  )
}
