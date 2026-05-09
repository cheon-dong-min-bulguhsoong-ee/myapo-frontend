interface PageHeaderProps {
  title: string
  subtitle?: string
}

export function PageHeader({ title, subtitle }: PageHeaderProps) {
  return (
    <header className="shrink-0 px-5 pt-6 pb-4 bg-canvas">
      <h1 className="text-[22px] font-bold tracking-[-0.02em] text-ink leading-[1.3]">{title}</h1>
      {subtitle && (
        <p className="text-[15px] font-medium text-ink-secondary mt-2 leading-[1.4]">{subtitle}</p>
      )}
    </header>
  )
}
