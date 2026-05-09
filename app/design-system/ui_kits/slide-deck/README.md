# Slide Deck UI Kit

A 1920×1080 HTML slide deck using `<deck-stage>`. Each slide is a direct `<section class="slide">` child; deck-stage handles scaling, keyboard nav, and print.

## Components (all exported to `window` in their files)
- `SlideChrome.jsx` — `BrandMark`, `FrameTop`, `Slide` (applies bg variants).
- `SlideVariants.jsx` — `CoverSlide`, `ContentSlide`, `SectionBreakSlide`, `BigNumberSlide`, `EvidenceSlide`.

## Layout
- Slide padding `96px 104px`.
- `.frame-top` at the top (brand-mark + section label + NN/NN).
- One ink card + one primary accent per slide, max.

## Demo
`index.html` shows a 5-slide mini deck: cover → content → section-break → big-number → evidence. Arrow keys navigate; `R` resets.
