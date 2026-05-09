# REFACTOR-PLAN.md — Wireframe Componentization Migration

> **Why this exists.** The current implementation drifted from the wireframes —
> uses the wrong list shapes, ad-hoc div banners, and bypasses the bottom-sheet
> pattern. This plan turns
> [`COMPONENTS.md`](./COMPONENTS.md) and [`SCREENS.md`](./SCREENS.md) into a
> **landing-order** so each phase ships a visible improvement and never blocks
> the next.
>
> **One PR per phase.** Match the project's "one change → one commit → one push"
> harness in `AGENTS.md`. Each phase = one branch, one commit, one push,
> documented progress.
>
> **Done bar.** A phase is done when (a) every page that the phase touches still
> builds (`bun run build`), (b) the changed routes render correctly in the
> browser at 360 px and 430 px, (c) the wireframe HTML side-by-side matches.
> Type-checks aren't enough — we screenshot-compare to wireframes.

---

## 0. Prerequisites (do once before Phase 1)

These are read-only / pure-data tasks. No refactor, no UI risk.

| # | Action | File(s) |
|---|---|---|
| P0.1 | Audit `lib/mock-data.ts` against §6 of `SCREENS.md` and add `mockDocuments`, `mockSubmissionRequests`, `mockHistoryEvents` collections | `lib/mock-data.ts` |
| P0.2 | Confirm every `page.tsx` empty file inventory (`documents/[id]`, `history/*`, `disputes/new`, `disputes/[id]`, `disputes/success`) has placeholder export so the app builds | listed routes |
| P0.3 | Verify the design-system imports survive: `app/globals.css` should already pull tokens → typography → components in order. If not, fix first. | `app/globals.css` |

**Don't open Phase 1 until P0 passes a build.**

---

## 1. Phase ladder

Phases are ordered to **bottom-up reduce risk**: shared atoms first, then molecules,
then organisms, then page-by-page swap. Late phases never reach into early files.

```
P1  Atoms gap         (Spinner, Pill variants, Button inverted, Callout, IconBox)
P2  Layout chrome     (AppShell + AppBar badges + PageHeader compact/hero split)
P3  Doc primitives    (DocCard, DocGrid, ProgressBar rename, ErrorState)
P4  Sheet/Tab         (BottomSheet, TabBar)
P5  Pages — write     (issue-select, persona, login, home, renewal, issue-complete)
P6  Pages — empty     (documents/[id], history list, history detail, disputes/*)
P7  Pages — flows     (delivery, submission-request, /documents tab swap)
P8  Polish            (motion, a11y, focus traps, scroll lock, KR/EN persona gate)
```

Estimated commits: 8–12 across 1–2 weeks for a single agent. Parallelizable on
P5/P6 across two agents because pages don't share state.

---

## 2. Phase details

### Phase 1 — Atoms gap (no page touches)

**Why first.** Every later phase consumes these. Building them in isolation means
zero cross-file blast radius.

**Tasks.**
1. Add `Button variant="inverted"` (white bg / blue fg) so `/issue-complete`
   can drop the `!bg-white !text-primary` override.
2. Extend `Pill`: add `testnet | mock | precheck | revoked` variants. Append the
   four CSS rules to `app/globals.css` per `COMPONENTS.md` §2.2.
3. Create `components/ui/spinner.tsx` per §2.3.
4. Create `components/ui/callout.tsx` per §2.5. Append the `.callout.*` CSS rules
   per `COMPONENTS.md` §6.
5. Create `components/ui/icon-box.tsx` per §2.6.

**Verification.**
- `bun run build` clean.
- `npm run lint` clean.
- Add a temporary `app/_kitchen-sink/page.tsx` rendering all variants to eyeball.
  Delete it before merging.

**Don't.**
- Do not modify any existing page yet.
- Do not rename `ProgressFill` yet (Phase 3).

---

### Phase 2 — Layout chrome

**Why next.** AppShell becomes the canonical wrapper. AppBar's `badges` prop is
referenced on 7+ screens. Without it, every screen needs a `badges` slot via a
custom `action` ReactNode.

**Tasks.**
1. Create `components/ui/app-shell.tsx` per `COMPONENTS.md` §1.1. Re-uses
   existing `.app-frame` + `.app-scroll` classes — no new CSS.
2. Refactor `AppBar` to accept `badges?: ('testnet'|'mock'|'precheck')[]`. Keep
   the `action` slot for backward compat; assert at most one is supplied.
3. Refactor `PageHeader` to accept `size?: 'compact'|'hero'`. Default `compact`.
   Existing pages keep their look only if they explicitly pass `size="hero"`.
   **One-time scan** — every existing `<PageHeader>` callsite. Most should switch
   to `compact`; only `/login`, `/persona-select`, `/issue-complete` keep `hero`.

**Verification.**
- Pick three pages (e.g. `/home`, `/issue/select`, `/delivery`), wrap them in
  `<AppShell>`, test build.
- Compare title sizes in browser to wireframe lines (header is 16/700 in wireframe,
  not 26/700).

**Risk.** Page-level boilerplate change reaches every page. Land carefully —
one route at a time inside this phase, or split into 2a/2b/2c if a single PR
gets unwieldy.

---

### Phase 3 — Doc primitives + state primitives

**Why now.** A-01 and A-03 pages depend on `DocCard`/`DocGrid`. The error pattern
is reused across 6+ screens.

**Tasks.**
1. Create `components/ui/doc-card.tsx` per `COMPONENTS.md` §3.1.
2. Create `components/ui/doc-grid.tsx` per §3.2.
3. Append `.doc-card`, `.doc-card-icon`, `.doc-card.selected`, `.doc-card.expired`
   CSS to `app/globals.css`.
4. Rename `ProgressFill` → `ProgressBar`, add `label?: string` prop. Find/replace
   imports; the file itself stays the same shape.
5. Create `components/ui/error-state.tsx` per §3.9. Mirror `EmptyState`'s API but
   with two CTAs.

**Verification.**
- Storybook-style preview: render `DocCard` with `selected`, `expired`, `disabled`
  in a temporary route. Confirm padding 10 × 12, 1.5 px border, blue-soft selected fill.
- `tsc` after rename passes.

---

### Phase 4 — Sheet + Tab

**Why now.** `/login`, `/submission-request`, `/documents`, `/history/[id]`, the
upcoming dispute flow — all need either or both. Build once, reuse everywhere.

**Tasks.**
1. Create `components/ui/tab-bar.tsx` per `COMPONENTS.md` §3.4. Generic over the
   tab value type. CSS already in spec; append.
2. Create `components/ui/bottom-sheet.tsx` per §3.5. Use the project's existing
   `ds-scrim` + `ds-sheet` classes; add `.bottom-sheet-overlay` / `.bottom-sheet-handle`
   if not present. **Ship with focus-trap and body-scroll-lock from day 1** —
   refactoring those in later is more painful than adding them now.

**Verification.**
- Open the sheet on the existing `/login` page (no logic change yet — just
  swap the inline scrim for `<BottomSheet>`). Confirm:
  - Backdrop click closes.
  - Esc closes (a11y).
  - Body doesn't scroll while open.
  - Focus returns to triggering button on close.
- Render TabBar in a throwaway route with two tabs, confirm 2 px underline + blue.

---

### Phase 5 — Pages with existing files (rewrite to use new components)

**Why now.** All atoms/molecules exist. These pages have content already; we just
restructure to faithful wireframe shape.

Order **inside** Phase 5 (smallest blast radius first):

| 5.1 | `/issue-complete` | swap `Button` override → `variant="inverted"`. **2 LOC.** |
| 5.2 | `/login` | `<BottomSheet>` swap. **~15 LOC.** |
| 5.3 | `/persona-select` | wrap in `<AppShell>`. Keep `SegmentedControl`. |
| 5.4 | `/home` | extract `MenuTile` local component, swap to `<IconBox>`. |
| 5.5 | `/renewal` | swap `Callout` + `IconBox`. |
| 5.6 | `/issue/select` | **biggest change.** Replace `<label><input>` rows with `<DocGrid><DocCard/></DocGrid>`. Drop `documentCategories`, use flat `mockDocuments`. |
| 5.7 | `/issue/verify` | add PIPA §17 checkbox, `Callout`, `DataRow`. |
| 5.8 | `/issue/success` | wrap `<AppShell scroll="fixed" background="blue">`. |

**Verification per route.** Open in browser, compare with `app-korean.html` at
the same screen. Test active + (where applicable) loading + empty + error.

---

### Phase 6 — Empty file routes (write from scratch)

**Why now.** Atoms/molecules done; rest of the app has examples to mimic.

| 6.1 | `app/documents/[id]/page.tsx` | per `SCREENS.md` §3.10 |
| 6.2 | `app/history/page.tsx` | per `SCREENS.md` §3.7 |
| 6.3 | `app/history/[id]/page.tsx` | per §3.8. Includes `HistoryStep` molecule + dispute `<BottomSheet>` |
| 6.4 | `app/disputes/new/page.tsx` | per §3.14. Includes `RadioGroup` (build local if no shared one) |
| 6.5 | `app/disputes/[id]/page.tsx` | per §3.14. Read-only timeline. |
| 6.6 | `app/disputes/success/page.tsx` | mirror `/issue-complete`. |

**Add as you go.** `RadioGroup` and `FileUpload` are not in `COMPONENTS.md`
because they're scoped to one or two screens. Build them as **local** components
under `components/disputes/` first. Promote to `components/ui/` only if a 3rd
caller appears.

---

### Phase 7 — Stateful flow pages

**Why last.** These need real data flow + state machines, not just shapes.

| 7.1 | `/documents` | add `<TabBar>` (사용 가능 / 만료됨), data hook returns `{available, expired}` |
| 7.2 | `/submission-request` | add `<BottomSheet>` confirm before route push |
| 7.3 | `/delivery` | add primary CTA + completion gate; replace inline rows with `<Callout>` |

**Verification.** Click through the full happy path:
`/login → persona → home → /issue/select → /issue/verify → /issue/success →
/history → /history/[id] → /documents → /documents/[id] → /submission-request →
/delivery → home`.
Plus the alt path: dispute submit → success → list.

---

### Phase 8 — Polish + a11y

Things you defer until shapes are stable:

1. **Motion.** Sheet entrance animation (240 ms `--ease-out`). Active step-dot
   `pulseDot`. Skeleton shimmer (already in globals).
2. **Focus management.** Tab order on each form, autofocus on the first input.
3. **Persona i18n.** `body[data-persona="foreigner"]` triggers single-language
   English copy per decision 2026-05-10. Wire `mockDocuments` to switch
   `englishName ↔ name` based on persona context.
4. **Reduced motion.** Wrap `pulseDot`, sheet animation in
   `@media (prefers-reduced-motion: reduce) { animation: none; }`.
5. **Touch target audit.** Every interactive surface ≥ 44 px tall. Most already
   are; sweep with a hover ruler.

---

## 3. Anti-goals (do not do during this refactor)

- **Don't** add a state-management library. Local `useState` + Next router are
  enough until a real backend exists.
- **Don't** introduce CSS-in-JS. Tailwind + design-system tokens are the contract.
- **Don't** add Storybook unless the team commits to maintaining stories. Use
  the throwaway `_kitchen-sink/` route during refactor and delete it before merge.
- **Don't** rebuild the design-system folder. It's the source of truth — only
  *consume* it via `app/globals.css` bridges.
- **Don't** parameterize past the wireframe. If the wireframe shows one CTA size,
  don't add a `size?: 'sm'|'md'|'lg'` prop "for later." YAGNI.
- **Don't** migrate while a phase is half-done. Keep main branch green every
  push (project harness rule).

---

## 4. Per-phase definition of done

Phase ships only when **all** boxes tick:

- [ ] `bun run build` green
- [ ] `npm run lint` clean
- [ ] Routes affected open in browser with no console errors at 360 px viewport
- [ ] Wireframe screenshot vs. browser screenshot — visually match within paddings
- [ ] One commit, one push, descriptive subject (≤ 70 chars), `Co-Authored-By: Claude…` trailer (per AGENTS.md harness)
- [ ] If new doc fact emerges: `COMPONENTS.md` / `SCREENS.md` updated **same PR**
- [ ] If quality grade in `docs/QUALITY_SCORE.md` would change: noted in `tech-debt-tracker.md`

---

## 5. Rollback policy

If a phase ships and a regression appears in production:

1. Revert the phase commit (`git revert <sha>`). Don't fast-forward through.
2. Re-open the phase plan, document the failure mode in the phase's section
   inside this file under a `> **2026-XX-XX revert.**` callout.
3. Do **not** skip the phase — the next pass takes the lesson.

---

## 6. Open questions (resolve before starting)

These need a human decision; they're not gating Phase 0/1 but block Phase 5+:

| # | Question | Default if no answer |
|---|---|---|
| Q1 | Do we need `RadioGroup` and `FileUpload` in `components/ui/`? | Build local first, promote on 3rd caller. |
| Q2 | Should the bottom-sheet animate on open by default, or feature-flag? | Animate by default; respects `prefers-reduced-motion`. |
| Q3 | When persona = foreigner, do we keep `englishName` only or stack KR/EN? | Per decision 2026-05-10: **single-language English** post S-02. |
| Q4 | Are status badges sticky on scroll, or do they flow with the AppBar? | Sticky — they ride with the AppBar header. |
| Q5 | Skeleton row count for a loading list — 3 fixed or proportional to viewport? | 3 fixed. Match wireframe. |

---

## 7. Cross-references

- Component contracts: [`COMPONENTS.md`](./COMPONENTS.md)
- Screen compositions: [`SCREENS.md`](./SCREENS.md)
- Wireframes (canonical): [`wireframes/app-korean.html`](./wireframes/app-korean.html), [`wireframes/app-foreigner.html`](./wireframes/app-foreigner.html)
- Design tokens: `design-system/tokens.css`
- Token bridge: `app/globals.css`
- Decision log (read before disagreeing with a wireframe): `docs/product-specs/decisions.md`
- Frontend operating rules: `AGENTS.md`, `docs/DESIGN.md`
