import type { ReactNode } from 'react'

/**
 * Bottom CTA bar — production version of the reference's `.mobile-cta`.
 * Renders white surface with top border, 12px 20px padding, and stacks
 * children vertically with 8px gap.
 */
export function PageFooter({ children }: { children: ReactNode }) {
  return <footer className="mobile-cta">{children}</footer>
}
