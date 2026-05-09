---
name: claude-design
description: Use this skill to generate well-branded interfaces and assets for the Claude Design System (Toss-inspired Korean pitch-deck / frontend / wireframe visual language), either for production or throwaway prototypes/mocks/etc. Contains essential design guidelines, colors, type, fonts, assets, and UI kit components for prototyping.
user-invocable: true
---

Read the README.md file within this skill, and explore the other available files.

If creating visual artifacts (slides, mocks, throwaway prototypes, etc), copy assets out and create static HTML files for the user to view. If working on production code, you can copy assets and read the rules here to become an expert in designing with this brand.

If the user invokes this skill without any other guidance, ask them what they want to build or design, ask some questions, and act as an expert designer who outputs HTML artifacts _or_ production code, depending on the need.

## Quick orientation

- **Foundations:** `tokens.css` (colors, spacing, radii, motion), `typography.css` (Pretendard × Work Sans), `components.css` (chips, buttons, cards, persona, evidence, comp-table, frame-top, etc.)
- **Semantic layer:** `colors_and_type.css` (fg1/fg2/bg1, h1/h2/p defaults)
- **Slide shell:** `deck-stage.js` (1920×1080 auto-scaling web component)
- **Reference catalog:** `preview/index.html` (visual browser of every token + component)
- **UI kits:** `ui_kits/slide-deck/` and `ui_kits/web-page/`
- **Sample slides:** `slides/` (cover, content, section-break, big-number, evidence)

## The three rules that override everything

1. **60·30·10** — white 60, ink 30, blue 10. Primary accent used once per page.
2. **Numbers heavier** — wrap every numeral and every Latin word in `.num` or `.en` so Work Sans takes over at one weight heavier than Pretendard.
3. **Pill before rectangle** — chips and buttons are `border-radius: 999px`; cards are `20px`.

## Slides: copy `templates/slide-templates.html` first.
