<!-- BEGIN:agents-toc -->
# AGENTS.md — MyApo

This file is a **table of contents**, not an encyclopedia. ~100 lines, scoped to navigation.
Anything you can't find here is in `docs/`. Anything you can't find in `docs/` doesn't exist for an agent.

## Project

MyApo is a cross-border apostille document app. Korean residents and foreign residents in Korea
issue Korean government documents (납세증명서, 가족관계증명서, etc.), get them translated &
notarized & apostilled, then submit to overseas institutions (US Consulate, AU/CA Immigration).
Credentials live on **XRPL Testnet** (Pre-Check Only mode). Mobile-only frontend in Next.js 15.

## Hard rules

- **Next.js 15 App Router**. APIs in your training data may be wrong. Read `node_modules/next/dist/docs/`
  before writing route / server-component / metadata code. Heed deprecation notices.
- **Mobile-only**. No desktop layouts. See `docs/DESIGN.md` for the responsive contract.
- **Repo-local truth**. If a decision matters, it lives in `docs/`. Slack / Notion / chat don't exist.
- **No manual code in production paths** unless explicitly authorized. Agents write, humans steer.

## Where to look

| If you need… | Read |
|---|---|
| Architecture, domains, layering | `ARCHITECTURE.md` |
| UI design system, tokens, components | `docs/DESIGN.md` |
| Frontend conventions (Next.js, components, state) | `docs/FRONTEND.md` |
| Product domain decisions, persona priorities | `docs/PRODUCT_SENSE.md` |
| Reliability — XRPL, retries, fallbacks | `docs/RELIABILITY.md` |
| Security — PIPA, key custody, signing | `docs/SECURITY.md` |
| Quality grades per domain / layer | `docs/QUALITY_SCORE.md` |
| Plan philosophy + active plans index | `docs/PLANS.md` |
| Past design decisions + why | `docs/design-docs/index.md` |
| Agent-first operating principles | `docs/design-docs/core-beliefs.md` |
| Wireframes for screens A-01 → A-07 | `docs/design-docs/wireframes/` |
| Component library spec (props, CSS, status) | `docs/design-docs/COMPONENTS.md` |
| Screen × component composition map | `docs/design-docs/SCREENS.md` |
| Wireframe-faithful refactor plan | `docs/design-docs/REFACTOR-PLAN.md` |
| Product feature specs | `docs/product-specs/index.md` |
| Active execution plans | `docs/exec-plans/active/` |
| Known technical debt | `docs/exec-plans/tech-debt-tracker.md` |
| External library / standard docs (llms.txt) | `docs/references/` |
| Auto-generated artifacts (route map, etc.) | `docs/generated/` |

## Workflow

1. **Plan before code.** Lightweight changes can ship without a plan; complex work goes in
   `docs/exec-plans/active/<slug>.md` first. See `docs/PLANS.md` for the threshold.
2. **Reference, don't paraphrase.** When a doc owns the rule (design tokens, security rules),
   link to it. Don't restate.
3. **Update `docs/` in the same PR** as the code change. Stale docs are a bug.
4. **Quality grade lives in `docs/QUALITY_SCORE.md`.** If you ship something that lowers a domain's
   grade, leave a note in `tech-debt-tracker.md`.

## Tech stack

- **Runtime**: Bun (`bun.lock`); Node compatible
- **Framework**: Next.js 15 (App Router, RSC by default)
- **Styling**: Tailwind v4 + design tokens in `docs/DESIGN.md`
- **Fonts**: Pretendard Variable + JetBrains Mono
- **Icons**: Lucide (outline only)
- **Ledger**: XRPL Testnet via `xrpl` SDK (mock-first; see `docs/RELIABILITY.md`)

## Commands

- `bun dev` — start dev server
- `npm run build` — production build
- `npm run lint` — eslint

## File ownership cheat sheet

- `app/` — Next.js routes (RSC + client components)
- `public/` — static assets
- `docs/` — system of record (this file's domain)
- `node_modules/next/dist/docs/` — Next.js 15 reference (read before writing route code)

## Commit + push harness

**Auto-commit-and-push directive.** After every meaningful change (UI tweak, route edit,
component update, dependency change, doc update, decision logged), the agent **must**:

1. Stage only the files actually changed in this turn (avoid `git add -A` to keep
   `.claude/`, `.omc/`, `*.swp`, and other local-only files out).
2. Create one commit that captures the user-visible delta:
   - Subject ≤ 70 chars, imperative mood ("Add", "Fix", "Refactor", "Migrate", "Tweak").
   - Body explains *why*, not what.
   - Always include the `Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>` trailer.
3. Push to `origin/main` immediately after commit. Branch protection / hooks failures
   are not bypassed (no `--no-verify`, no `--force`).
4. If a commit ends up empty (no real change), skip — never create no-op commits.
5. If the user says "don't commit yet" / "wait" / "rollback", honor that and pause the
   harness until they re-enable it.

**One change → one commit → one push.** Don't batch unrelated changes across commits.

**Repo root** = `fe/` (one directory above this `app/` package). Run git from `fe/app/`
or `fe/`; paths in commands must be cwd-relative. `app/issue/select/page.tsx` from
`fe/app/` cwd is the *Next.js route* file, not the package root.

**Allowed without confirmation**: docs, app routes, components, styles, package.json
deps, design tokens. **Confirm first**: branch operations (`checkout`, `reset`),
force push, merging, dropping migrations, rewriting history.

<!-- END:agents-toc -->
