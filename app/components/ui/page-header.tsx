interface PageHeaderProps {
  title: string
  subtitle?: string
  eyebrow?: string
}

/**
 * Inline page intro that lives inside `mobile-content`. Mirrors the
 * "어떤 한국 서류를 발급받을까요? + 발급기관: 한국 정부…" pattern from A-01.
 */
export function PageHeader({ title, subtitle, eyebrow }: PageHeaderProps) {
  return (
    <header>
      {eyebrow && (
        <p className="mb-1 text-xs font-bold uppercase tracking-[0.06em] text-primary">
          {eyebrow}
        </p>
      )}
      <h1 className="mb-1 text-lg font-bold leading-snug text-ink">{title}</h1>
      {subtitle && <p className="mb-2 text-sm leading-relaxed text-sub">{subtitle}</p>}
    </header>
  )
}
