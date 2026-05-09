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
    <div className="flex gap-1 rounded-xl bg-canvas p-1">
      {options.map((opt) => (
        <button
          key={opt.value}
          type="button"
          onClick={() => onChange(opt.value)}
          className={`flex min-h-11 flex-1 flex-col items-center justify-center rounded-lg px-2 ds-caption font-bold transition-colors ${
            value === opt.value ? 'bg-paper text-primary' : 'text-ink-secondary active:bg-paper'
          }`}
        >
          <span>{opt.label}</span>
          {opt.sublabel && <span className="mt-0.5 text-xs font-medium opacity-70">{opt.sublabel}</span>}
        </button>
      ))}
    </div>
  )
}
