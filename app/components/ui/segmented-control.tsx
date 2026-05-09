'use client'

interface Option {
  value: string
  label: string
  sublabel?: string
}

interface SegmentedControlProps {
  options: Option[]
  value: string
  onChange: (v: string) => void
}

export function SegmentedControl({ options, value, onChange }: SegmentedControlProps) {
  return (
    <div className="grid gap-1 rounded-xl bg-canvas p-1" style={{ gridTemplateColumns: `repeat(${options.length}, minmax(0, 1fr))` }}>
      {options.map((opt) => (
        <button
          key={opt.value}
          type="button"
          onClick={() => onChange(opt.value)}
          className={`flex min-h-11 flex-col items-center justify-center rounded-lg px-2 text-sm font-bold transition-colors ${
            value === opt.value ? 'bg-paper text-primary shadow-sm' : 'text-ink-secondary active:bg-paper'
          }`}
        >
          <span>{opt.label}</span>
          {opt.sublabel && <span className="mt-0.5 text-xs font-medium opacity-70">{opt.sublabel}</span>}
        </button>
      ))}
    </div>
  )
}
