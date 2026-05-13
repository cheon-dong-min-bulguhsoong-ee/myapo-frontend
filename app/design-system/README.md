# Claude Design System

> **한국어 피치덱·프론트엔드·와이어프레임에서 공통으로 쓰는 시각 언어.**
> Toss의 디자인 언어에서 영감을 얻은 팔레트·타이포·컴포넌트 모음.

시그니처: Toss Blue (#3182F6) · Pretendard × Work Sans · 20px radius 카드 · pill 칩 ·
60·30·10 규칙 · 큰 타이포와 타이트한 letter-spacing(-0.035em).

---

## 📇 Index (root manifest)

| File | Purpose |
|---|---|
| **`README.md`** | This document. |
| **`SKILL.md`** | Agent-skill frontmatter + quick orientation. |
| `tokens.css` | Raw tokens — colors, spacing, radii, shadows, motion. |
| `typography.css` | Pretendard + Work Sans font loading, type scale. |
| `components.css` | Chip · button · card · persona · comp-table · evidence · slide-frame. |
| `colors_and_type.css` | Semantic aliases — `--fg1`, `--bg1`, `--accent`, h1/h2/p defaults. |
| `deck-stage.js` | 1920×1080 auto-scaling slide-deck web component. |
| `assets/` | Brand mark SVG + any copied logos/imagery. |
| `fonts/` | Font-loading notes (Pretendard/Work Sans are CDN-loaded — see note below). |
| `templates/slide-templates.html` | Cover · content · section-break skeleton to fork from. |
| `preview/` | The **design-system cards** registered in this project's Design System tab. |
| `wireframes/` | Linked HTML wireframes for app, console, and institution surfaces — see [`wireframes/Readme.md`](./wireframes/Readme.md). |
| `ui_kits/slide-deck/` | JSX UI kit — slide shell, cover, content, evidence, big-number, section-break. |
| `ui_kits/web-page/` | JSX UI kit — header, hero, feature cards, comparison, footer. |
| `slides/` | Sample slide HTML files registered as cards (cover, content, big-number, evidence, section-break). |

**Sources.** Extracted from a user-provided design-system codebase mounted as
`design-system/` via the File System Access API. All four CSS/JS source files
(`tokens.css`, `typography.css`, `components.css`, `deck-stage.js`) plus
`templates/slide-templates.html` and the reference `index.html` catalog were
copied verbatim from that source. No Figma file was provided — the visual
catalog at `design-system/index.html` (copied into `preview/catalog.html`)
served as the primary reference.

---

## ⚡ Quick start (3 lines)

```html
<link rel="stylesheet" href="tokens.css" />
<link rel="stylesheet" href="typography.css" />
<link rel="stylesheet" href="components.css" />
<!-- Optional semantic layer -->
<link rel="stylesheet" href="colors_and_type.css" />
<!-- For slide decks only -->
<script src="deck-stage.js"></script>
```

For a slide deck, start from `templates/slide-templates.html`.

---

## 🎨 Design Principles

1. **60·30·10** — white 60, ink 30, blue 10. One primary accent per page.
2. **Big type, tight** — titles are large; letter-spacing `-0.035em`.
3. **Numbers heavier** — numbers + Latin use Work Sans via `.num` / `.en`, one weight heavier than Pretendard (Toss TPS rule).
4. **Pill before rectangle** — chips + buttons `999px`; cards `20px`.
5. **Soft over shadow** — separate surfaces with `--bg-soft` (#F9FAFB), not drop shadows.
6. **Ask before adding** — never fill empty space with filler. One idea per section, one claim per card.

---

# CONTENT FUNDAMENTALS

### Language
Korean primary. English and numbers are wrapped in `.en` / `.num` so Work Sans takes over — they sit one weight heavier than the surrounding Pretendard. This gives headlines their signature typographic texture (e.g. "**2026** · **XRPL Credentials**" where the English/numeric runs feel structurally bolder).

### Tone — "단호하고 선언적" (decisive and declarative)
- **One big sentence, not paragraphs.** Slides use a single large declarative statement; supporting detail sits in smaller body copy below.
- **Strike-reveal** is a signature rhetorical device: strike through the common assumption, then state the correction in blue. Example: ~~신용이 없어서~~ → **증명이 없어서** ("not because of credit — because of proof").
- **Framing by numbers.** "0 financial products," "6,000× cheaper," "90s approval." A single big numeral carries a slide.
- **Evidence block for law/citations.** Legal / regulatory material appears in the `.evidence` block with a left blue rule, a small caps `LAW` label, and an optional red `.risk` line for penalties. Source: "특정금융정보법 시행령 §10의2. … 위반 시 형사처벌 5년 이하 · 5천만원 이하".
- **Competitive claims are tabular, not prose.** `.comp-table` rows with a highlighted `.us` row. Never compared in bullets.

### Person
No explicit "I" vs "you". The deck speaks as the product team to an investor or partner audience. Claims are stated as fact ("**Credential Bundle**로 소득·체류를 온체인 증명"), with backing evidence in the next slide. Avoid softeners (think, maybe, might) — assertive voice.

### Casing
- **UPPERCASE + letter-spacing 0.06em** for small labels (eyebrows, table headers, evidence `LAW`, `TAKEAWAY` pills on callouts).
- **Sentence case** for everything else — including headlines.
- Never title case.

### Punctuation
- **Middle dot `·`** is the signature separator. Meta lines: "v1.0 · Pretendard × Work Sans · 60-30-10 Rule". Chip content: "Success · GA".
- En-dash `—` for strong breaks inside a sentence.
- Period ending allowed in headlines (unlike Western pitch style), softly used.

### Emoji
**No decorative emoji in UI or slides.** The reference deck uses zero emoji in slide content. Emoji can appear in README-level docs (📂, 🎨, ⚡) but never inside a card, slide, or UI component. If a status marker is needed, use a chip (`.chip.green`, `.chip.red`) or a coloured dot (`.risk::before`).

### Example copy in the voice

| Context | Copy |
|---|---|
| Cover title | 외국인 IT 노동자를 위한<br/>**첫 번째 신용대출**. |
| Section break | 이제 **진짜 문제**를 이야기할 차례. |
| Big number + caption | **0** — 외국인 IT 노동자가 접근 가능한 국내 신용대출 상품 수. |
| Strike-reveal | ~~신용이 없어서~~ · **증명이 없어서**. |
| Callout takeaway | 크레딧이 아니라 **증명**이 이 제품의 엔진이다. · `TAKEAWAY` |
| Evidence | 특정금융정보법 시행령 §10의2. 가상자산사업자가 아니면 영업할 수 없으며… / 위반 시 형사처벌 5년 이하 · 5천만원 이하 |

---

# VISUAL FOUNDATIONS

### Color

**Ink (7-step grayscale)** does almost all the work. `#191F28 → #4E5968 → #6B7684 → #8B95A1 → #B0B8C1 → #E5E8EB → #F2F4F6 → #F9FAFB`. Text uses ink-1/2/3; dividers use `line` / `bg-2`; surfaces use `bg-soft`.

**Toss Blue** is the **only** brand accent: `#3182F6` primary, `#1B64DA` deep (hover + on-white text), `#E8F3FF` soft fill, `#6DA8FF` tint (on-dark variant). Use 10% of surface — one primary button, one blue callout, one accent word per slide.

**Semantic (green / yellow / red)** — #25A768 / #F1A31F / #F04452 — are **status-only**: GA (live), partial/warning, risk/strike-through. They must not be used for decoration, theming, or data-viz.

### Typography

- **Pretendard Variable** for Korean body + headings.
- **Work Sans** for numbers and Latin, one weight heavier than the Korean around it (the Toss TPS rule). `.num` (600) and `.en` classes are the switch.
- **Tight tracking on big type.** Display cover `-0.045em`, display quote `-0.04em`, h1.title `-0.035em`, h2.title `-0.03em`.
- **No italics.** No all-caps display text.
- **No underlines on links** except on hover.
- **Tabular numerals always on** for numbers (`font-feature-settings: "tnum" 1`).

### Spacing — multiples of 4

`--sp-1..12` = 4, 8, 12, 16, 20, 24, 32, 40, 48, 64, 80, **104**. Slide horizontal padding is `104px`, vertical `96px`. Card padding is `36–40px`. Web pages max out at `1280px` with `64px` horizontal padding.

### Radii

`6 / 10 / 14 / **20** / 24 / 28 / 999(pill)`. **The 20px radius on cards is the signature.** Chips + buttons are always pill. Nothing in the system uses a 4px or 8px radius.

### Backgrounds

- **White 60%** of surface (canvas).
- **bg-soft (#F9FAFB)** to separate surfaces — used instead of shadows.
- **ink (#191F28)** and **blue (#3182F6)** as full-bleed section break backgrounds, or for a single emphasized card on an otherwise light slide.
- No gradients. No patterns. No textures. No hand-drawn illustration. No background imagery inside slides.
- Full-bleed imagery is allowed (not provided by default) but must keep ink + blue visual consistency.

### Shadows

Subtle, almost invisible. `--shadow-1: 0 1px 2px rgba(0,0,0,0.04)`. `--shadow-2: 0 4px 12px rgba(0,0,0,0.05)`. `--shadow-3: 0 12px 32px rgba(0,0,0,0.08)`. In the reference deck, shadows are **not used** on cards — `bg-soft` does the separation. Shadows are available for hover states on web UI only.

### Animation

- **Easing:** `--ease-out: cubic-bezier(0.22, 1, 0.36, 1)` (Toss's signature — quick, decisive, with a slight overshoot feel). `--ease-in-out: cubic-bezier(0.65, 0, 0.35, 1)`.
- **Durations:** 160ms (fast / taps), 240ms (base / hover), 420ms (slow / page transitions).
- **No bounces, no elastic.** No wobble. Decisive, clean.
- **Buttons press-shrink** on `:active`: `transform: scale(0.97)`.

### Hover / press states

- **Primary button hover:** background `--blue` → `--blue-deep`. No brightness filter, no shadow change.
- **Secondary button hover:** background `--bg-2` → `--line`.
- **Ghost button hover:** background transparent → `--bg-soft`.
- **Press (all):** `transform: scale(0.97)` for 160ms.
- **No color fades on text** for link hover — underline appears instead.

### Borders

- **Dividers:** 1px `--line` (#E5E8EB). 2px ink under table heads.
- **Outline cards:** 1px `--line`.
- **Evidence block:** **6px solid `--blue` left rule**. Signature.
- **Competitor table `.us` row:** no border, filled ink with `r-md` (14px) radius.

### Transparency + blur

Reserved for **on-dark text** only:
- on `bg-ink`: body at `rgba(255,255,255,0.75)`; caption at `0.55`; eyebrow uses `--blue-tint`.
- on `bg-blue`: body at `rgba(255,255,255,0.9)`.

No `backdrop-filter: blur()` in the reference system.

### Imagery vibe

Not provided. The reference deck is **type-and-color only** — no photography, no illustration. When images are added, keep them cool/neutral, unsaturated, and aligned to a white or ink background. No warm filters, no grain, no B&W stylisation.

### Layout rules

- **Slides:** fixed 1920×1080 canvas, letterboxed on black by `<deck-stage>`. Padding 96×104.
- **Pages:** max width 1280, centered, 64px horizontal padding.
- **Fixed top frame on slides:** `brand-mark` + section label on the left, `NN / NN` slide count on the right, 22px font, `--ink-3` on light.
- **One primary per page.** One primary button or one blue callout — not both.
- **One ink card per slide.** If you need emphasis inside a content slide.

### Card anatomy (the signature)

A card is: `bg-soft` (#F9FAFB) · `20px` radius · `40px` padding · `gap: 16px` inside. No border, no shadow. Variants: `.card.ink` (filled #191F28, white text), `.card.blue` (filled Toss Blue), `.card.outline` (transparent + 1px line — the rare case when you need a card on an already-soft background).

---

# ICONOGRAPHY

### The brand mark
A two-path SVG — two quarter-circles forming an abstract dialectic / duality mark. Used at 24×24 in slide frames, at 72×72 on the hero, and as the only "logo" anywhere in the system. Color: `--blue` on light, `#fff` on ink/blue backgrounds. Source: `assets/brand-mark.svg`.

### Approach
The reference deck uses **almost no iconography**. It relies on:

- **Text markers** — numbered lists (`01` / `02` / `03` in Work Sans, ~36px, blue) carry the weight most icon sets would in other systems.
- **Dot bullets** — `.bullets` uses a solid 8px Toss Blue circle as the list marker.
- **Check/cross cells** — `✓` / `✕` / `△` plain Unicode glyphs in the comparison table (`.comp-cell.yes` / `.no` / `.partial`). These are **the only icon-like glyphs in the system**.
- **Status dots** — `.evidence .risk::before` is an 8px solid red circle.
- **Strike-through lines** — for "struck-through" assumptions. Text-decoration, not an icon.

### No icon font, no icon library is included
If a project genuinely needs an icon set, the nearest match to Toss's aesthetic is **Phosphor Icons** (regular weight, 1.5px stroke) — rounded, friendly, minimal. Load from CDN:

```html
<script src="https://unpkg.com/@phosphor-icons/web"></script>
<i class="ph ph-check-circle" style="color: var(--blue); font-size: 24px;"></i>
```

**Alternative:** Lucide (`https://unpkg.com/lucide@latest`) — thinner strokes, feels Western. Prefer Phosphor for KR-audience work.

> **Flagged substitution.** Phosphor is a CDN stand-in and was not in the source codebase. If the brand wants an icon system, ask the user to specify (Phosphor / Lucide / custom).

### Unicode as icon
Allowed for:
- `·` separator (signature).
- `→` `←` `↑` `↓` arrows in flow diagrams.
- `✓` `✕` `△` in the comp-table only.
- `—` em-dash for strong breaks.

### Emoji
**Never in UI / slides.** Allowed only in README-level developer docs.

### Images & illustrations
None provided. If a full-bleed image is needed, keep it cool, unsaturated, and framed so ink-colored text stays legible over it.

---

## 🧩 Main component cheat sheet

| Class | Use |
|---|---|
| `.chip` · `.chip.green/gray/red/yellow` | Pill label — status / tag. |
| `.btn.primary` · `.secondary` · `.ghost` | Pill button. One primary per page. |
| `.card` · `.card.ink` · `.card.outline` | 20px-radius soft card. |
| `.persona` | 3-region persona card (name/visa · fact · need). |
| `.comp-table` · `.comp-row.us` | Competitor comparison. `.us` highlights self. |
| `.numbered-list .item` | Big Work Sans numeral + body row list. |
| `.callout` + `.pill` | Blue-soft strip for the slide's takeaway. |
| `.evidence` | Blue-left-rule citation / legal block. |
| `.why-card` · `.why-card.ink` | Supporting-reason card (N of M). |
| `.bullets` | Blue-dot list. |
| `.frame-top` + `.brand-mark` + `.num` | Slide header bar. |
| `.display-cover` · `.display-quote` · `.display-bignum` | Display type — cover / pull-quote / big-number. |

Full reference: `preview/catalog.html` (the original `design-system/index.html`, copied in so this project is self-contained).

---

## 🎯 Type scale (at-a-glance)

| Class | Size | Use |
|---|---|---|
| `.display-cover` | 152px | Deck slide-1 title |
| `.display-quote` | 128px | Big quote / declaration |
| `.display-bignum` | 640px | One overwhelming numeral |
| `h1.title` | 104px | Content-slide title |
| `h2.title` | 72px | Section title |
| `h4` | 36px | Card subtitle |
| `.h3 / .subtitle` | 30px | Subtitle |
| `.body` | 30px | Body |
| `.body-md` | 22px | Card body |
| `.body-sm` | 19px | Secondary body |
| `.eyebrow` | 22px | Section ID (blue) |
| `.label` | 14px | UPPERCASE label |

Numbers + Latin: **always `.num` or `.en`** → Work Sans takeover.

---

## 🎨 Color cheat sheet

```css
/* Text + surface (grayscale does the work) */
--ink         /* #191F28 — primary text */
--ink-2       /* #4E5968 — secondary text */
--ink-3       /* #6B7684 — caption */
--line        /* #E5E8EB — divider */
--bg-soft     /* #F9FAFB — card surface */

/* The one brand color */
--blue        /* #3182F6 — PRIMARY */
--blue-deep   /* #1B64DA — hover / on-white text */
--blue-soft   /* #E8F3FF — chip background */
--blue-tint   /* #6DA8FF — on-dark text */

/* Status only — never decoration */
--green       /* #25A768 — success / GA */
--yellow      /* #F1A31F — partial / warning */
--red         /* #F04452 — risk / strike */
```

---

*v1.0 · Extracted from a Toss-inspired Korean pitch-deck system · 2026*
