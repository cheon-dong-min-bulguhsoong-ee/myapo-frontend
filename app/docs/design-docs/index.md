# design-docs/ — Componentization Hub

This folder is the **bridge** between the visual contract (wireframes) and the
React implementation. Read in this order:

| Order | File | What it answers |
|---|---|---|
| 1 | [`wireframes/app-korean.html`](./wireframes/app-korean.html) · [`app-foreigner.html`](./wireframes/app-foreigner.html) | What does each screen *look* like? (canonical source) |
| 2 | [`COMPONENTS.md`](./COMPONENTS.md) | What primitives must exist? Which exist already? Which are missing? |
| 3 | [`SCREENS.md`](./SCREENS.md) | How does each route compose those primitives? What state variants must it render? |
| 4 | [`REFACTOR-PLAN.md`](./REFACTOR-PLAN.md) | In what order do we land the refactor without breaking main? |

## TL;DR — what's wrong today

The current `components/ui/` library has **the right atoms** (Button, Card, Pill,
StepTimeline, Skeleton, …) but is missing the **molecules** that the wireframes
build screens out of:

- **`DocCard` / `DocGrid`** — A-01 and A-03's signature row (issuer monogram +
  Korean+English name + use-case + selected/expired states). Today A-01 fakes it
  with `<label><input type=checkbox>`.
- **`TabBar`** — A-03 사용 가능 / 만료됨 toggle. Today the documents page has
  no tabs.
- **`BottomSheet`** — A-02/A-04 confirms + login terms. Today inlined as raw divs.
- **`Callout`** — universal info/warning/danger banner used 10+ times across
  wireframes. Today every screen rebuilds it inline.
- **`Spinner`** — used 30+ times in wireframe loading variants. Today copy-pasted
  Tailwind classes in every page.
- **`ErrorState`** — distinct from `EmptyState`; pairs retry + dismiss CTAs.
- **`AppShell`** — single page-level wrapper. Today ~6 LOC of `flex flex-col h-full
  bg-canvas` boilerplate is repeated in every page.

A few existing components also drifted:

- **`AppBar`** doesn't take a status-badge stack (Testnet / Mock / Pre-Check Only)
  even though every screen in the wireframe shows it.
- **`PageHeader`** renders 26 px titles where the wireframe wants 16 px in-screen
  prompts. Splits into `compact` (default) vs `hero`.
- **`Pill`** lacks `testnet | mock | precheck | revoked` palette variants.

[`REFACTOR-PLAN.md`](./REFACTOR-PLAN.md) sequences the fix in 8 phases that each
land independently.

## The three rules

When in doubt:

1. **Wireframe > docs > code.** If this folder disagrees with the wireframe
   HTML, fix the docs. If the docs disagree with what's built, fix the code.
2. **Tokens not values.** Reach for `var(--blue)`, `var(--sp-4)`, `var(--r-lg)`.
   Never hardcode hex/px in a component.
3. **One primary per screen.** One blue CTA, one ink card, one accent at a time.

## Cross-references

- Decision log (read before disagreeing with a wireframe): `../product-specs/decisions.md`
- Per-screen product specs: `../product-specs/index.md`
- Visual design system source: `../../design-system/`
- Token bridge to Tailwind: `../../app/globals.css`
- Frontend operating rules: `../../AGENTS.md`
