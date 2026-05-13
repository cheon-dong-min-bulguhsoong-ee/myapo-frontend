'use client'

interface Option {
  value: string
  label: string
  count?: number
}

interface SegmentedControlProps {
  options: Option[]
  value: string
  onChange: (v: string) => void
}

/**
 * A-03 카테고리 탭 — segmented pill control. Mirrors:
 *   <div class="flex bg-bg-base p-1 rounded-md">
 *     <button class="flex flex-1 items-center justify-center py-3 min-h-11 …">…</button>
 *     <button class="flex-1 py-2 rounded-sm text-sm font-medium text-muted">…</button>
 *   </div>
 */
export function SegmentedControl({ options, value, onChange }: SegmentedControlProps) {
  return (
    <div
      role="tablist"
      className="flex flex-shrink-0 rounded-xl border border-border bg-hairline-soft p-1.5"
    >
      {options.map((opt) => {
        const active = value === opt.value
        return (
          <button
            key={opt.value}
            type="button"
            role="tab"
            aria-selected={active}
            onClick={() => onChange(opt.value)}
            className={`flex min-h-11 flex-1 items-center justify-center rounded-lg py-3 text-sm transition-colors ${
              active
                ? 'bg-white shadow-[0_1px_2px_rgba(0,0,0,.04),0_1px_3px_rgba(0,0,0,.06)] font-bold text-primary'
                : 'font-medium text-muted'
            }`}
          >
            {opt.label}
            {typeof opt.count === 'number' && (
              <span className={`ml-1 ${active ? 'text-primary' : 'text-muted'} font-normal`}>
                {opt.count}
              </span>
            )}
          </button>
        )
      })}
    </div>
  )
}
