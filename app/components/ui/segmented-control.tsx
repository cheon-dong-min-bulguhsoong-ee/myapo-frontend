'use client'
import { SegmentedControl as TDSSegmentedControl } from '@toss/tds-mobile'

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
    <TDSSegmentedControl size="large" value={value} onChange={onChange}>
      {options.map((opt) => (
        <TDSSegmentedControl.Item key={opt.value} value={opt.value}>
          {opt.sublabel ? (
            <span style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <span>{opt.label}</span>
              <span style={{ fontSize: 12, opacity: 0.7 }}>{opt.sublabel}</span>
            </span>
          ) : (
            opt.label
          )}
        </TDSSegmentedControl.Item>
      ))}
    </TDSSegmentedControl>
  )
}
