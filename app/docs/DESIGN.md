---
version: alpha
name: MyApo Mobile
description: A Toss-inspired Korean fintech mobile design system for MyApo, the cross-border apostille document app. Anchored on Toss Blue (`#3182F6`) as the lone signal CTA, deep ink (`#191F28`) for headlines, **Pretendard Variable** across the body, and **JetBrains Mono** for ledger / credential identifiers. Mobile-first and responsive (100vw with 20-px edge padding), safe-area aware on both iOS and Android, with a 4-tier typography scale, three-surface palette (canvas / paper / code-ink), and one focal CTA per screen.

colors:
  primary: "#3182F6"
  primary-deep: "#1B64DA"
  primary-soft: "#E8F2FE"
  on-primary: "#ffffff"
  ink: "#191F28"
  ink-secondary: "#4E5968"
  ink-muted: "#8B95A1"
  on-ink: "#ffffff"
  canvas: "#F9FAFB"
  paper: "#FFFFFF"
  code-ink: "#11181C"
  hairline: "#E5E8EB"
  hairline-soft: "#F1F3F5"
  success: "#00C48C"
  warning: "#FFB020"
  danger: "#F04452"
  danger-deep: "#B0202C"
  info: "#18BFFF"
  scrim: "rgba(0, 0, 0, 0.45)"

typography:
  display:
    fontFamily: Pretendard Variable
    fontSize: 22px
    fontWeight: 700
    lineHeight: 1.3
    letterSpacing: -0.02em
  headline:
    fontFamily: Pretendard Variable
    fontSize: 17px
    fontWeight: 700
    lineHeight: 1.35
    letterSpacing: -0.01em
  body:
    fontFamily: Pretendard Variable
    fontSize: 15px
    fontWeight: 500
    lineHeight: 1.5
    letterSpacing: 0
  body-emphasis:
    fontFamily: Pretendard Variable
    fontSize: 15px
    fontWeight: 700
    lineHeight: 1.5
    letterSpacing: 0
  caption:
    fontFamily: Pretendard Variable
    fontSize: 13px
    fontWeight: 500
    lineHeight: 1.4
    letterSpacing: 0
  button:
    fontFamily: Pretendard Variable
    fontSize: 17px
    fontWeight: 700
    lineHeight: 1.3
    letterSpacing: -0.01em
  pill:
    fontFamily: Pretendard Variable
    fontSize: 12px
    fontWeight: 600
    lineHeight: 1.3
    letterSpacing: 0
  mono:
    fontFamily: JetBrains Mono
    fontSize: 13px
    fontWeight: 500
    lineHeight: 1.5
    letterSpacing: 0

rounded:
  none: 0px
  xs: 6px
  sm: 8px
  md: 12px
  lg: 16px
  pill: 999px

spacing:
  xxs: 4px
  xs: 8px
  sm: 12px
  md: 16px
  lg: 20px
  xl: 24px
  xxl: 32px
  edge: 20px
  card-gap: 16px
  section-gap: 32px

safe-area:
  top: env(safe-area-inset-top)
  bottom: env(safe-area-inset-bottom)
  left: env(safe-area-inset-left)
  right: env(safe-area-inset-right)

shadows:
  card: 0 1px 2px rgba(0, 0, 0, 0.04), 0 1px 3px rgba(0, 0, 0, 0.06)
  sheet: 0 -8px 24px rgba(0, 0, 0, 0.08)
  pulse: 0 0 0 4px rgba(49, 130, 246, 0.15)
  modal: 0 16px 48px rgba(0, 0, 0, 0.18)

components:
  app-bar:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    typography: "{typography.headline}"
    height: 56px
    paddingTop: "{safe-area.top}"
    padding: 0 20px
    borderBottom: 1px solid {colors.hairline}
  bottom-nav:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink-muted}"
    height: 56px
    paddingBottom: "{safe-area.bottom}"
    borderTop: 1px solid {colors.hairline}
  bottom-nav-item-active:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.primary}"
    typography: "{typography.pill}"
  bottom-home-bar:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink-muted}"
    height: 56px
    paddingBottom: "{safe-area.bottom}"
    borderTop: 1px solid {colors.hairline}
    iconSize: 24px
    typography: "{typography.pill}"
  page-header:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    typography: "{typography.display}"
    padding: 16px 20px 20px
  card:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    typography: "{typography.body}"
    rounded: "{rounded.md}"
    padding: 16px
    border: 1px solid {colors.hairline}
    shadow: "{shadows.card}"
  card-selectable:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    rounded: "{rounded.md}"
    padding: 16px
    border: 1px solid {colors.hairline}
    shadow: "{shadows.card}"
  card-selected:
    backgroundColor: "{colors.primary-soft}"
    textColor: "{colors.ink}"
    rounded: "{rounded.md}"
    padding: 16px
    border: 1.5px solid {colors.primary}
  list-row:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    typography: "{typography.body}"
    padding: 14px 20px
    borderBottom: 1px solid {colors.hairline-soft}
    minHeight: 56px
  detail-panel:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink-secondary}"
    typography: "{typography.caption}"
    rounded: "{rounded.md}"
    padding: 12px 16px
  btn-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.on-primary}"
    typography: "{typography.button}"
    rounded: "{rounded.md}"
    height: 56px
    padding: 0 20px
  btn-primary-pressed:
    backgroundColor: "{colors.primary-deep}"
    textColor: "{colors.on-primary}"
  btn-primary-disabled:
    backgroundColor: "{colors.hairline}"
    textColor: "{colors.ink-secondary}"
  btn-primary-danger:
    backgroundColor: "{colors.danger}"
    textColor: "{colors.on-primary}"
    typography: "{typography.button}"
    rounded: "{rounded.md}"
    height: 56px
    padding: 0 20px
  btn-primary-danger-pressed:
    backgroundColor: "{colors.danger-deep}"
    textColor: "{colors.on-primary}"
  btn-secondary:
    backgroundColor: transparent
    textColor: "{colors.ink-secondary}"
    typography: "{typography.button}"
    rounded: "{rounded.md}"
    height: 48px
    border: 1px solid {colors.hairline}
  btn-text-link:
    backgroundColor: transparent
    textColor: "{colors.primary}"
    typography: "{typography.body-emphasis}"
    padding: 4px 0
    minHeight: 32px
  pill-status:
    typography: "{typography.pill}"
    rounded: "{rounded.pill}"
    padding: 3px 10px
  pill-success:
    backgroundColor: rgba(0, 196, 140, 0.12)
    textColor: "#067A55"
  pill-warning:
    backgroundColor: rgba(255, 176, 32, 0.14)
    textColor: "#9A6500"
  pill-danger:
    backgroundColor: rgba(240, 68, 82, 0.12)
    textColor: "#B0202C"
  pill-info:
    backgroundColor: rgba(24, 191, 255, 0.14)
    textColor: "#0A7B9E"
  pill-neutral:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink-secondary}"
    border: 1px solid {colors.hairline}
  step-dot:
    width: 24px
    height: 24px
    rounded: "{rounded.pill}"
    typography: "{typography.pill}"
  step-dot-done:
    backgroundColor: "{colors.success}"
    textColor: "{colors.on-primary}"
  step-dot-active:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.on-primary}"
    shadow: "{shadows.pulse}"
  step-dot-wait:
    backgroundColor: "{colors.hairline}"
    textColor: "{colors.ink-muted}"
  step-dot-error:
    backgroundColor: "{colors.danger}"
    textColor: "{colors.on-primary}"
  step-line:
    backgroundColor: "{colors.hairline}"
    height: 2px
  step-line-done:
    backgroundColor: "{colors.success}"
    height: 2px
  progress-track:
    backgroundColor: "{colors.hairline}"
    rounded: "{rounded.pill}"
    height: 6px
  progress-fill:
    backgroundColor: "{colors.primary}"
    rounded: "{rounded.pill}"
    height: 6px
  tab-bar:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink-secondary}"
    typography: "{typography.body-emphasis}"
    borderBottom: 1.5px solid {colors.hairline}
    height: 48px
  tab-bar-active:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.primary}"
    typography: "{typography.body-emphasis}"
    borderBottom: 2px solid {colors.primary}
  segmented:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink-muted}"
    typography: "{typography.caption}"
    rounded: "{rounded.md}"
    padding: 4px
    border: 1px solid {colors.hairline}
  segmented-active:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.primary}"
    rounded: "{rounded.sm}"
    shadow: "{shadows.card}"
  text-input:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    typography: "{typography.body}"
    rounded: "{rounded.md}"
    height: 52px
    padding: 0 16px
    border: 1px solid {colors.hairline}
  text-input-focused:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    border: 1.5px solid {colors.primary}
  text-input-error:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    border: 1.5px solid {colors.danger}
  bottom-sheet:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    rounded: "{rounded.lg} {rounded.lg} 0 0"
    padding: 20px
    paddingBottom: "calc(20px + {safe-area.bottom})"
    shadow: "{shadows.sheet}"
  bottom-sheet-handle:
    backgroundColor: "{colors.hairline}"
    rounded: "{rounded.pill}"
    width: 36px
    height: 4px
  modal-scrim:
    backgroundColor: "{colors.scrim}"
  toast:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.on-ink}"
    typography: "{typography.body}"
    rounded: "{rounded.md}"
    padding: 12px 16px
    shadow: "{shadows.modal}"
  skeleton:
    backgroundColor: "{colors.hairline}"
    rounded: "{rounded.sm}"
---

## Overview

MyApo's mobile system reads like a **Korean fintech ledger app** — Toss meets a government document portal. The whole UI sits on a near-white canvas (`{colors.canvas}` — `#F9FAFB`) with white paper cards (`{colors.paper}` — `#FFFFFF`) lifted by a hairline border + a barely-there 1-px shadow. There is one chromatic action color — **Toss Blue** (`{colors.primary}` — `#3182F6`) — and one ink color (`{colors.ink}` — `#191F28`); together they carry every primary CTA, every link, every active tab.

The signature gesture is the **pulsing step-dot timeline** — 24-px round dots stitched together with hairline lines, where `done` dots fill green (`{colors.success}`), `active` dots glow Toss-blue with a soft 4-px halo + 1.5-s pulse, `wait` dots stay gray, and `error` dots flip red. The timeline is the architectural spine of every multi-step issuance flow.

Two voice modes carry every screen: a **white-paper card body** for actionable surfaces (selection lists, status, progress) and a **canvas-gray section** between cards for breathing room. JetBrains Mono (`{typography.mono}`) is the only typographic break — reserved for issuer codes, credential IDs, and ledger references where a string should read as machine-canonical (`KR-NTS`, `US-CONS`, `xrpl:credential:...`).

The system is **mobile-first and mobile-only** at runtime. Width is 100vw with 20-px edge padding; the app-bar honors `safe-area-inset-top`, the bottom-nav and bottom-sheet honor `safe-area-inset-bottom`. There is no fixed-pixel mobile frame — the layout flexes from 320 (iPhone SE) to 430 (iPhone Pro Max) without breakpoints.

**Key Characteristics:**
- Off-white canvas (`{colors.canvas}`) with white card-paper (`{colors.paper}`) lifted by hairline + 1-px shadow — never heavy material elevation
- Toss Blue (`{colors.primary}`) is the lone CTA fill, link color, active-tab indicator, active step-dot — at most twice per viewport, ideally once
- Pretendard Variable runs every UI surface; JetBrains Mono carries credential and issuer identifiers — the only typographic split
- 4-tier scale: `display` 22 → `headline` 17 → `body` 15 → `caption` 13, with `button` 17 / `pill` 12 / `mono` 13 as functional siblings
- Cards round at `{rounded.md}` (12px); buttons match cards; the bottom-sheet rounds top corners only at `{rounded.lg}` (16px)
- Pulsing step-dot timeline drives every progress story — green / blue / gray / red
- Safe-area aware: `safe-area-inset-top` on app-bar; `safe-area-inset-bottom` on bottom-nav, bottom-sheet, sticky CTAs
- One focal action per screen — `btn-primary` is full-width, 56-px tall, stacked above `btn-secondary` with an 8-px gap

## Colors

> **No Interaction sub-section.** Pressed states live on individual components. Allowed sub-sections: Brand & Accent, Surface, Text, Semantic.

### Brand & Accent
- **Toss Blue** (`{colors.primary}` — `#3182F6`): the system's lone signal — primary CTA fill, link color, active-tab indicator, active step-dot, progress-fill, focused input border. Reserved for one focal action per screen.
- **Toss Blue Deep** (`{colors.primary-deep}` — `#1B64DA`): pressed state for `btn-primary` and the visited-link color.
- **Toss Blue Soft** (`{colors.primary-soft}` — `#E8F2FE`): the pale-blue surface for `card-selected` selection backgrounds and informational highlight rows.

### Surface
- **Canvas** (`{colors.canvas}` — `#F9FAFB`): the universal app background and the breathing space between cards.
- **Paper** (`{colors.paper}` — `#FFFFFF`): every card surface, list row background, bottom-sheet body, segmented active cell.
- **Hairline** (`{colors.hairline}` — `#E5E8EB`): the 1-px border on every card, every divider, every progress-track ground, every step-line in the wait state.
- **Hairline Soft** (`{colors.hairline-soft}` — `#F1F3F5`): the lighter alternate divider between list rows where a full hairline would over-segment.
- **Code Ink** (`{colors.code-ink}` — `#11181C`): the dark surface reserved for inline code blocks (signing payload preview, raw JSON in credential detail).
- **Scrim** (`{colors.scrim}` — `rgba(0,0,0,.45)`): the modal/bottom-sheet backdrop overlay.

### Text
- **Ink** (`{colors.ink}` — `#191F28`): the primary text color — headlines, body, button labels, app-bar title.
- **Ink Secondary** (`{colors.ink-secondary}` — `#4E5968`): the muted body — supporting copy, secondary button text, list-row metadata.
- **Ink Muted** (`{colors.ink-muted}` — `#8B95A1`): the tertiary metadata — timestamps, fine print, disabled states, inactive tabs.
- **On Primary** (`{colors.on-primary}` — `#FFFFFF`): white text on every blue / green / red filled element.

### Semantic
- **Success** (`{colors.success}` — `#00C48C`): completed step-dot, success toast, `pill-success`.
- **Warning** (`{colors.warning}` — `#FFB020`): deadline-approaching indicators, `pill-warning`.
- **Danger** (`{colors.danger}` — `#F04452`): error step-dot, error input border, `pill-danger`, destructive action accent.
- **Info** (`{colors.info}` — `#18BFFF`): informational toast, `pill-info`.

Status pills (`pill-success` / `pill-warning` / `pill-danger` / `pill-info`) use a 12% tint of the semantic color as background with a darker shade as text — readable against both `{colors.canvas}` and `{colors.paper}`.

## Typography

### Font Family

The voice is **two-family**: Pretendard Variable for every UI surface, JetBrains Mono for credential / issuer identifiers. Pretendard is a Korean-optimized geometric sans whose Hangul + Latin metrics align — critical for a bilingual app where `납세증명서 (영문)` and `Tax Payment Cert.` sit on the same row at the same baseline. JetBrains Mono is reserved for: issuer codes (`KR-NTS`, `US-CONS`), credential SHA fragments, signing nonces, ledger references — strings that should read as machine-canonical.

Pretendard runs at weight 500 for body, 700 for headlines and emphasis. The system uses **negative letter-spacing** (`-0.01em` to `-0.02em`) at headline scale to tighten Korean glyph counters; body text stays at `0`.

### Hierarchy

| Token | Size | Weight | Line Height | Letter Spacing | Use |
|---|---|---|---|---|---|
| `{typography.display}` | 22px | 700 | 1.3 | -0.02em | Page headline ("어떤 한국 서류를 발급받을까요?") |
| `{typography.headline}` | 17px | 700 | 1.35 | -0.01em | App-bar title, sheet title, in-card section header |
| `{typography.body}` | 15px | 500 | 1.5 | 0 | Default body, card description, list-row label |
| `{typography.body-emphasis}` | 15px | 700 | 1.5 | 0 | Run-in emphasis, active tab label, inline link |
| `{typography.caption}` | 13px | 500 | 1.4 | 0 | Detail panel rows, metadata, timestamps |
| `{typography.button}` | 17px | 700 | 1.3 | -0.01em | Primary + secondary CTA labels |
| `{typography.pill}` | 12px | 600 | 1.3 | 0 | Status pills, step-dot numerals, bottom-nav labels |
| `{typography.mono}` | 13px | 500 | 1.5 | 0 | Issuer codes, credential IDs, hash fragments |

### Principles

The primary button label is set at **17px / 700**, identical in size to the `headline`. The button does not visually shout via type size; it shouts via the 56-px height + full-width fill + Toss-blue color. This is the Toss bank pattern — buttons read as confident statements, not as warnings.

Pretendard's `-0.01em` to `-0.02em` letter-spacing at headline scale matters because Korean glyphs are denser than Latin; without the tighten the headline reads loose. **Do not** apply negative tracking to body sizes — Pretendard's body metrics are already balanced.

The minimum on-screen size is **12px** (`{typography.pill}`). Anything smaller fails Korean Hangul legibility on devices below 3× DPR.

### Font Substitutes

Pretendard Variable is open-source and free. If unavailable:
- **Inter** at weights 500 / 700 paired with **Noto Sans KR** at the same weights — separate Korean and Latin stacks
- **System stack**: `-apple-system, BlinkMacSystemFont, system-ui` — acceptable Apple-platform fallback; Hangul rendering inherits the OS Korean default

JetBrains Mono is the canonical mono. Closest alternates: **IBM Plex Mono** (slightly warmer), **SF Mono** on Apple platforms.

## Layout

### Spacing System

- **Base unit**: 4px. The scale is gentle and weighted toward 12 / 16 / 20 / 32px — typical Korean fintech rhythm.
- **Tokens**: `{spacing.xxs}` 4 · `{spacing.xs}` 8 · `{spacing.sm}` 12 · `{spacing.md}` 16 · `{spacing.lg}` 20 · `{spacing.xl}` 24 · `{spacing.xxl}` 32
- **Edge padding** (`{spacing.edge}` 20px): the universal mobile-screen horizontal padding.
- **Card gap** (`{spacing.card-gap}` 16px): vertical spacing between sibling cards in a list.
- **Section gap** (`{spacing.section-gap}` 32px): rhythm between major content blocks.

### Container

- **Width**: 100vw with `{spacing.edge}` (20px) horizontal padding. No fixed-pixel container — the layout flexes from 320px (iPhone SE) up to 430px (iPhone 15 Pro Max) without breakpoints.
- **Vertical anatomy** (top-to-bottom): `safe-area-inset-top` → app-bar (56px) → scroll area → bottom-nav (56px) → `safe-area-inset-bottom`.
- **Sticky CTA** (when used): pinned to the bottom edge with `padding-bottom: calc(16px + safe-area-inset-bottom)`; sits above the bottom-nav on screens that hide nav.

### Safe Area

Every floating top/bottom surface respects iOS Dynamic Island / notch and Android gesture insets. Use the `{safe-area.top}` / `{safe-area.bottom}` tokens (which resolve to `env(safe-area-inset-*)`) on:
- App-bar (top padding)
- Bottom-nav (bottom padding)
- Bottom-sheet inner padding-bottom
- Sticky CTA wrapper bottom padding
- Modal full-screen inner padding (top + bottom)

### Whitespace Philosophy

Whitespace is **calmly structured** — Korean fintech expects breathing room without feeling sparse. Cards leave 16-px internal padding; the screen leaves 20-px edges; the section gap of 32px between major blocks gives the eye a rest. The system is text-first; there is no hero photography and no decorative illustration inside content surfaces.

## Elevation & Depth

| Level | Treatment | Use |
|---|---|---|
| 0 — Flat | No border, no shadow. | Canvas background, bottom-nav inactive cells |
| 1 — Hairline | 1-px solid `{colors.hairline}` border, no shadow. | Secondary buttons, segmented inactive cells, list dividers, text inputs |
| 2 — Card Lift | `{shadows.card}` (`0 1px 2px rgba(0,0,0,.04), 0 1px 3px rgba(0,0,0,.06)`) + 1-px hairline. | Cards, segmented active cell |
| 3 — Sheet Lift | `{shadows.sheet}` (`0 -8px 24px rgba(0,0,0,.08)`). | Bottom sheet, drawer |
| 4 — Modal | `{shadows.modal}` (`0 16px 48px rgba(0,0,0,.18)`) + scrim backdrop. | Full-screen modal, toast |
| 5 — Pulse Halo | `{shadows.pulse}` (`0 0 0 4px rgba(49,130,246,.15)`) + 1.5-s ease-in-out keyframe. | Active step-dot only |

Shadow is intentionally barely-there — `0.04` and `0.06` alpha — because the system relies on hairline borders to define card edges. The combination reads cleanly on both white and gray surfaces.

There is **no decorative geometry** — no chevrons, no slashes, no illustrations behind hero text. The visual hierarchy comes from card grouping + the Toss-blue CTA. The only ornamental moment is the **pulse halo** on the active step-dot, and even that is functional — it tells the user which step is currently in flight.

## Shapes

### Border Radius Scale

| Token | Value | Use |
|---|---|---|
| `{rounded.none}` | 0px | Hairline dividers, app-bar bottom edge |
| `{rounded.xs}` | 6px | Inline code chips, micro-tag pills |
| `{rounded.sm}` | 8px | Skeleton placeholders, segmented inactive cell |
| `{rounded.md}` | 12px | Cards, primary + secondary buttons, text inputs, detail panels — the workhorse |
| `{rounded.lg}` | 16px | Bottom-sheet top corners, page-level full-screen modal |
| `{rounded.pill}` | 999px | Status pills, step-dots, progress-track + fill, bottom-sheet handle |

The system maintains a clear three-tier philosophy: **pills round fully** (status, dots, progress), **cards and CTAs round at 12px** (the workhorse), **floating sheets round at 16px** on the visible top edge. Buttons share the card's 12-px radius — they sit visually as actionable cards, not as a different shape language.

### Iconography

Icons are rendered via **Lucide** (or any outline icon set) at 20px / 24px sizes. Stroke weight `1.5–2px`. The system does not use filled icons; outline glyphs match Pretendard's geometric tone. Icon color follows the surrounding text color (`{colors.ink-secondary}` for nav, `{colors.primary}` for active states, `{colors.success}` / `{colors.danger}` for status).

Bottom-nav cells use a 24-px icon stacked above the 12-px `{typography.pill}` label with 2-px gap — matches the standard 24-px nav icon size and keeps the cell airy on smaller devices.

## Components

> **No hover states documented.** This is a mobile design system; the touch model has no hover. Pressed states use a one-frame background darken and an optional 100ms haptic.

### Buttons

**`btn-primary`** — the lone Toss-blue CTA
- Background `{colors.primary}`, text `{colors.on-primary}`, type `{typography.button}` (17px / 700), full-width 100%, height 56px, rounded `{rounded.md}`
- Pressed: `{colors.primary-deep}`. Disabled: bg `{colors.hairline}`, text `{colors.ink-secondary}`
- Rule: **at most one** `btn-primary` per screen at a time

**`btn-primary-danger`** — destructive / 분쟁 CTA
- Background `{colors.danger}` `#F04452`, text `{colors.on-primary}`, same dimensions as `btn-primary`
- Pressed: `{colors.danger-deep}` `#B0202C`
- Used for: 분쟁 신고, 계정 삭제 등 destructive action 한정
- Rule: 일반 발급/제출 CTA에는 절대 사용 금지 — `btn-primary` (Toss Blue)이 기본

**`btn-secondary`** — the muted opt-out
- Background transparent, text `{colors.ink-secondary}`, 1-px `{colors.hairline}` border, type `{typography.button}` (17px / 700), full-width 100%, height 48px, rounded `{rounded.md}`
- Sits 8-px below `btn-primary` in stacked CTA blocks; never side-by-side

**`btn-text-link`** — inline blue link
- Background transparent, text `{colors.primary}`, type `{typography.body-emphasis}`, 4-px vertical padding, min-height 32px (touch target floor)

### Cards & Containers

**`card`** — the workhorse white-paper container
- Background `{colors.paper}`, rounded `{rounded.md}`, padding `{spacing.md}` (16px), 1-px `{colors.hairline}` border, Card Lift shadow

**`card-selectable`** + **`card-selected`** — selection pattern
- Default identical to `card`. Selected: background `{colors.primary-soft}`, 1.5-px `{colors.primary}` border, no shadow (the border carries the lift)
- Used for document selection, persona selection, recipient selection

**`list-row`** — flat list item (alternative to cards for dense lists)
- Background `{colors.paper}`, 14-px vertical padding, 20-px horizontal, 56-px min-height (44-pt touch floor + breathing), 1-px `{colors.hairline-soft}` bottom divider

**`detail-panel`** — gray inset block inside cards
- Background `{colors.canvas}`, text `{colors.ink-secondary}`, type `{typography.caption}`, rounded `{rounded.md}`, padding 12px 16px
- Holds key-value rows ("서류명 / 발급기관 / 단계") inside a parent card

**`bottom-sheet`**
- Background `{colors.paper}`, rounded `{rounded.lg} {rounded.lg} 0 0`, padding `{spacing.lg}` (20px), padding-bottom adds `safe-area-inset-bottom`, Sheet Lift shadow
- 36×4 `bottom-sheet-handle` (rounded `{rounded.pill}`, color `{colors.hairline}`) centered at the top edge
- Max-height 85vh; dismissible via swipe-down or scrim tap

### Status & Indicators

**`pill-status`** — the base status chip
- Type `{typography.pill}` (12px / 600), rounded `{rounded.pill}`, padding 3px 10px
- Variants: `pill-success` / `pill-warning` / `pill-danger` / `pill-info` use a 12–14% tint of the semantic color as background with a deeper shade as text
- `pill-neutral`: bg `{colors.canvas}`, text `{colors.ink-secondary}`, 1-px hairline border — the gray-bordered identifier pill (e.g., issuer code)

### Step Timeline

**`step-dot`** + variants
- 24×24 circle, type `{typography.pill}`, rounded `{rounded.pill}`
- `step-dot-done` → bg `{colors.success}`, white glyph `✓` or step number
- `step-dot-active` → bg `{colors.primary}`, white glyph, **+ pulse halo + 1.5-s `pulseDot` keyframe**
- `step-dot-wait` → bg `{colors.hairline}`, text `{colors.ink-muted}`, glyph step number
- `step-dot-error` → bg `{colors.danger}`, white glyph `!`

**`step-line`** + **`step-line-done`**
- 2-px segments connecting dots; default `{colors.hairline}`, completed `{colors.success}`

**`progress-track`** + **`progress-fill`**
- 6-px height, rounded `{rounded.pill}`; track bg `{colors.hairline}`, fill bg `{colors.primary}`, `transition: width 600ms ease-out`

### Tabs & Segmented Controls

**`tab-bar`** + **`tab-bar-active`**
- 48-px tall, type `{typography.body-emphasis}`, 1.5-px `{colors.hairline}` bottom border
- Active: text `{colors.primary}`, 2-px `{colors.primary}` underline replaces the hairline under that tab

**`segmented`** + **`segmented-active`** — iOS-style two/three-tab toggle
- Container: bg `{colors.canvas}`, padding 4px, rounded `{rounded.md}`, 1-px hairline border
- Active cell: bg `{colors.paper}` + Card Lift shadow + text `{colors.primary}` (700), rounded `{rounded.sm}`

### Inputs

**`text-input`** + **`text-input-focused`** + **`text-input-error`**
- Background `{colors.paper}`, rounded `{rounded.md}`, padding 0 16px, height 52px, 1-px `{colors.hairline}` border
- Focused: 1.5-px `{colors.primary}` border, no halo
- Error: 1.5-px `{colors.danger}` border + caption-sized danger-colored helper text below

### Navigation

**`app-bar`** — top nav
- Background `{colors.paper}`, height 56px content (`safe-area-inset-top` adds above), 20-px horizontal padding, 1-px `{colors.hairline}` bottom border
- Layout: optional back-arrow icon (left, 24px) + title (`{typography.headline}`) + optional action icons (right, 24px each, 12-px gap)

**`bottom-nav`**
- Background `{colors.paper}`, height 56px content (`safe-area-inset-bottom` adds below), 1-px `{colors.hairline}` top border
- 4–5 evenly-distributed cells, each: 24-px outline icon + 12-px `{typography.pill}` label, 2-px gap
- Active: icon + label color shifts to `{colors.primary}`; inactive `{colors.ink-muted}`

**`bottom-home-bar`** — single-button home shortcut (sub-screen 전용)
- Same chrome as `bottom-nav` (paper bg, 56px content + `safe-area-inset-bottom`, hairline top border)
- One centered cell: 24-px `home` outline icon + 12-px `{typography.pill}` "홈" / "Home" label, 2-px gap, color `{colors.ink-muted}`
- Tap → S-03 (홈), 모든 in-flight 플로우 스택 초기화
- S-03 자체에서는 노출 안 함 (이미 홈)

### Feedback

**`toast`** — transient confirmation
- Background `{colors.ink}`, text `{colors.on-ink}`, type `{typography.body}`, rounded `{rounded.md}`, padding 12px 16px, Modal shadow
- Anchored 24-px above the bottom-nav (or `safe-area-inset-bottom` if no nav); auto-dismisses 3s

**`skeleton`** — loading placeholder
- Background `{colors.hairline}`, rounded `{rounded.sm}`, animated shimmer (1.5-s linear keyframe)
- Shapes: 16-px text rows, 60-px card blocks, 24-px circles for in-flight step-dots

**Empty / Error states** — inline within cards or full-screen
- Headline (`{typography.headline}`) + supporting body (`{typography.body}` in `{colors.ink-secondary}`) + a single `btn-primary` action ("다시 시도할게요" / "처음 화면으로")
- No illustration required; if used, monochrome line-art at `{colors.ink-muted}`

## Do's and Don'ts

### Do
- Reserve `{colors.primary}` for the primary CTA, link color, active-tab indicator, active step-dot — at most twice per viewport
- Set page headlines in Pretendard Variable at weight 700 with `-0.02em` letter-spacing — required for Korean glyph density
- Use `{rounded.md}` (12px) for every card and CTA; `{rounded.lg}` (16px) only for sheet/modal top corners
- Pad every floating top/bottom surface with `safe-area-inset-*` — no exceptions on iOS / Android
- Use the pulsing step-dot for the **currently active** step only; never animate done/wait dots
- Stack `btn-primary` above `btn-secondary` with 8-px gap when offering an opt-out — never side-by-side
- Switch to JetBrains Mono (`{typography.mono}`) for any string that is a credential ID, issuer code, or hash fragment
- Show a `pill-status` only when the status is non-default — silent success is fine

### Don't
- Don't introduce secondary saturated CTA colors outside `{colors.primary}` — even success-green and danger-red are reserved for status, not buttons
- Don't apply heavy material shadows; the system is barely-there + hairline border. A 4-dp Material elevation reads as a different brand
- Don't round `btn-primary` above `{rounded.md}` (12px); a pill-shaped primary button reads as a different brand
- Don't run Pretendard below 12px — that is the floor on Korean Hangul
- Don't show two `step-dot-active` simultaneously — only one step pulses at a time
- Don't drop ink text opacity to create hierarchy — switch to `{colors.ink-secondary}` or `{colors.ink-muted}` instead
- Don't fill icons; the system is outline-only
- Don't put environment / debug pills in production app-bars — those belong in dev/staging builds only

## Platform Guidance

### iOS

- Honor `safe-area-inset-top` (47–59px on Dynamic Island devices) and `safe-area-inset-bottom` (34px home-indicator) — already wired into app-bar / bottom-nav / bottom-sheet
- Use `-webkit-tap-highlight-color: transparent` and pair with the documented pressed states; never rely on the system blue tap flash
- Bottom-sheet swipe-down dismiss is expected; pair with `scroll-behavior: contain` so inner scroll doesn't trigger sheet drag
- Status bar style: dark content (`black-translucent` meta tag) since the app-bar is white

### Android

- Honor system gesture insets via `safe-area-inset-bottom` (16–24px on gesture-nav devices)
- Use ripple-style press feedback for `btn-primary` (subtle 4-px radius ripple from touch point) on Android — pressed-color fade is fine if simpler
- Material You dynamic color: **opt out**. The system's brand color (`{colors.primary}`) is intentional; do not let the OS theme override
- Status bar: light icons on `{colors.paper}` — set `windowLightStatusBar` true

### Touch Targets

Every interactive element clears 44×44 px (iOS HIG) and 48×48 dp (Material). `btn-primary` at 56-px clears AAA, `btn-secondary` at 48-px clears AA, `btn-text-link` at 32-px min-height clears AA when paired with 8-px tap padding around the visible label. Step-dots at 24-px are intentionally non-interactive — taps target the surrounding card.

### Reduced Motion

When `prefers-reduced-motion: reduce`, disable: step-dot pulse keyframe, progress-fill width transition (snap instead), bottom-sheet enter/exit easing (instant). Keep: tab/segmented active-state color shifts, opacity-only fade-ins.

### Dark Mode

**Not in scope for v1.** When introduced, invert canvas → `#0E1116`, paper → `#191F28`, ink → `#F2F4F7`, keep `{colors.primary}` unchanged (Toss Blue is dark-mode safe). Hairline becomes `rgba(255,255,255,.08)`; shadows drop alpha to ~`0.4` to remain visible on dark.

## Iteration Guide

1. Focus on ONE component at a time; resist refactoring the entire system in one pass
2. Reference component names and tokens directly (`{colors.primary}`, `{typography.display}`, `{rounded.md}`, `card`, `btn-primary`) — do not paraphrase to hex/px in prose
3. Add new component states as separate front-matter entries (`-pressed`, `-disabled`, `-focused`, `-error`); never bury state inside prose
4. Default body to `{typography.body}`; reach for `{typography.body-emphasis}` for run-in emphasis; reserve `{typography.display}` for true page headlines
5. Keep `{colors.primary}` scarce — at most two flame elements per viewport. Three flame items is over-saturation
6. When introducing a new section, choose surfaces from `{colors.canvas}` / `{colors.paper}` / `{colors.code-ink}` only — three surface modes is the entire vocabulary
7. Switch to JetBrains Mono only for machine-canonical strings (issuer codes, credential IDs, hashes) — never for human Korean / English copy
8. Every floating top/bottom surface gets safe-area padding — verify on a notched device before merging
