# SCREENS.md — Screen × Component Composition Map

> **Purpose.** Wire-by-wire, what components must compose each route, in which
> states, and where the wireframe disagrees with the current build.
>
> **Read with.** [`COMPONENTS.md`](./COMPONENTS.md) (component contracts) ·
> [`REFACTOR-PLAN.md`](./REFACTOR-PLAN.md) (migration order) ·
> [`wireframes/app-korean.html`](./wireframes/app-korean.html) (canonical visuals).
>
> **Naming.** Wireframes use `A-XX` IDs. Product specs use `S-XX`. Routes use
> Next.js paths. The `Wireframe ID ↔ Route` map is in §1.

---

## 1. ID ↔ Route ↔ Status

| Wireframe | Product spec | Route | Current file | Wireframe-faithful? |
|---|---|---|---|---|
| (S-01) | S-01 로그인 | `/login` | `app/login/page.tsx` | 🟡 close, missing scroll-lock on sheet |
| (S-02) | S-02 페르소나 | `/persona-select` | `app/persona-select/page.tsx` | 🟡 segmented OK, layout fine |
| (S-03) | S-03 홈 | `/home` | `app/home/page.tsx` | 🟡 4-menu grid present, tones drift |
| **A-01** | A-01 발급 신청 | `/issue/select` | `app/issue/select/page.tsx` | 🔴 wrong list shape — uses `<label>+<input>` not `DocCard` |
| **A-01** kyc | A-01.kyc 본인확인 | `/issue/verify` | `app/issue/verify/page.tsx` | 🟡 needs PIPA §17 checkbox |
| **A-01** success | A-01.success | `/issue/success` | `app/issue/success/page.tsx` | 🟡 should redirect to `/history`, not `/home` |
| **A-02** | (servicing inside S-05.detail bottom-sheet per decision 2026-05-10) | `/history/[id]` (bottom-sheet) | empty file | 🔴 bottom-sheet flow not built |
| **A-03** | S-04 내 증명서 | `/documents` | `app/documents/page.tsx` | 🔴 no `TabBar`, no expired tab |
| **A-03**.detail | S-04.detail | `/documents/[id]` | empty file | 🔴 missing |
| **A-04** | (서명 / 기관 선택) | `/submission-request` | `app/submission-request/page.tsx` | 🟡 list uses `SelectableCard`, missing bottom-sheet confirm |
| **A-05** | (전송) | `/delivery` | `app/delivery/page.tsx` | 🟡 progress timeline shape OK, lacks "현재 단계" pulse callout |
| **A-06** | S-06 분쟁 / 이력 | `/history`, `/history/[id]` | empty files | 🔴 missing entirely |
| **A-07** | (재발급) | `/renewal` | `app/renewal/page.tsx` | 🟡 close — replace local blocks with `Callout`/`IconBox` |
| (S-06) 신고 | S-06 분쟁 | `/disputes`, `/disputes/new`, `/disputes/[id]`, `/disputes/success` | partially empty | 🟡 list page OK, others 🔴 |
| issue-complete | A-03 풀스크린 | `/issue-complete` | `app/issue-complete/page.tsx` | 🟡 button override hack |

**Empty source files (must build):** `app/documents/[id]/page.tsx`, `app/history/page.tsx`,
`app/history/[id]/page.tsx`, `app/disputes/new/page.tsx`, `app/disputes/[id]/page.tsx`,
`app/disputes/success/page.tsx`. (Confirmed via `cat` — these files exist but are zero-byte.)

---

## 2. State machine vocabulary

Every screen renders one of these states. The wireframe shows 4 frames per
screen — that's the source of truth.

| State | Meaning | Visual |
|---|---|---|
| `active` | Default happy path; data loaded | full UI, primary CTA enabled |
| `loading` | Fetching primary data | skeleton + `Spinner` `Callout` "잠깐만요" |
| `empty` | Loaded successfully, zero items | `EmptyState` icon + title + secondary CTA |
| `error` | Fetch failed | `ErrorState` red + retry + dismiss |
| `success`* | Post-submit confirmation | full-screen blue card (only `/issue-complete`, `/disputes/success`) |

`*` not listed in wireframe variants but inferred from product flow.

A page renders these via a discriminated union on the data hook:

```tsx
const view = useMyDocs()       // returns { state: 'active' | 'loading' | …, data?, error? }
return (
  <AppShell header={<AppBar title="내 문서" badges={['testnet']}/>} footer={<BottomHomeBar/>}>
    {view.state === 'loading' && <DocumentsTabList.Loading />}
    {view.state === 'empty'   && <DocumentsTabList.Empty />}
    {view.state === 'error'   && <ErrorState onRetry={view.retry}/>}
    {view.state === 'active'  && <DocumentsTabList docs={view.data}/>}
  </AppShell>
)
```

Each screen organism exposes named sub-components for the non-active states.

---

## 3. Per-screen composition

### 3.1 `/login` — S-01

```
AppShell scroll="fixed" background="canvas"
└─ <main> (no AppBar — splash)
   ├─ Wordmark "MyApo" (ds-title text-primary, centered)
   ├─ Subtitle "해외 제출용 공공문서를…" (ds-body text-ink-secondary)
   └─ Footer slot:
      ├─ Button variant="primary" fullWidth (Google 로그인)
      └─ Row: <button>이용약관</button> · <button>개인정보처리방침</button>
└─ BottomSheet open={open} title={…}
   └─ <p className="ds-body">terms / privacy text</p>
```

**State variants.** Only `active` for the splash. The bottom-sheet is its own
toggle, not a page-level state.
**Today's gaps.** Inlines `.ds-scrim`+`.ds-sheet` instead of `<BottomSheet>`. No
focus-trap, no scroll-lock on body when sheet open.

---

### 3.2 `/persona-select` — S-02

```
AppShell
├─ AppBar wordmark
└─ main:
   ├─ PageHeader size="hero" title="당신은 누구신가요?" subtitle="..."
   └─ SegmentedControl options={[
        { value:'korean',     label:'한국인',          sublabel:'Korean resident' },
        { value:'foreigner',  label:'재한 외국인',      sublabel:'Foreign resident' },
      ]} value={persona} onChange={setPersona}
└─ Footer:
   └─ Button fullWidth onClick={→ /home}>다음</Button>
```

**Decision** (2026-05-10): tabbing rules, KR default, no back-out — enforce with
`router.replace('/home')` on submit and a locked back-handler.

---

### 3.3 `/home` — S-03

```
AppShell
├─ AppBar wordmark badges={['testnet','mock','precheck']}
└─ main:
   ├─ PageHeader size="hero" title="안녕하세요" eyebrow="MyApo"
   └─ Grid 2×2:
      ├─ MenuTile icon=FilePlus      tone="blue"   label="증명서 발급"  href="/issue/select"
      ├─ MenuTile icon=Wallet         tone="green"  label="내 증명서"   count={validDocs}     href="/documents"
      ├─ MenuTile icon=ClipboardList  tone="yellow" label="발급 내역"   count={inProgress}    href="/history"
      └─ MenuTile icon=Scale          tone="red"    label="분쟁 내역"   count={openDisputes}  href="/disputes"
```

**`MenuTile` is a new local molecule** = `<Card clickable>` containing
`<IconBox tone size="lg">` + label + sublabel + count badge. Only used here, no
need to put it in `components/ui/`. Keep in `components/home/menu-tile.tsx`.

**Today's gap.** `home/page.tsx` builds the tile inline with raw classes. Once
`IconBox` exists this collapses to ~6 lines per tile.

---

### 3.4 `/issue/select` — A-01

**Wireframe.** `app-korean.html` lines 760–950 (4 variants).

```
AppShell
├─ AppBar title="서류 발급 신청" badges={['testnet','precheck']}
└─ main (px-5 py-3):
   ├─ PageHeader size="compact"
   │     title="어떤 한국 서류를 발급받을까요?"
   │     subtitle="발급기관: 한국 정부 · 해외 기관 제출용"
   ├─ DocGrid                              // active state
   │     docs={mockDocuments}
   │     selectedIds={[selected]}          // single-select per wireframe
   │     onToggle={setSelected}
   └─ Footer caption: "발급해두면 유효기간 안에 무한 재사용해요"
└─ Footer:
   ├─ Button fullWidth disabled={!selected}>발급 신청할게요</Button>
   └─ <p className="ds-caption text-ink-muted text-center">PIPA §17 동의 포함 · 사용자 디바이스 한정 보관</p>
```

**State variants.**

| State | Body | CTA |
|---|---|---|
| `active` | DocGrid w/ one selected | `Button primary` enabled |
| `loading` | DocGrid (read-only) + Spinner row | `Button` disabled, label "신청 접수 중이에요…" |
| `empty` | `EmptyState` "서류 목록을 불러올 수 없어요" | retry secondary |
| `error` | `ErrorState` "발급기관 응답 오류" | retry + dismiss |

**Today's gaps.** Uses `documentCategories` (with sections!) — wireframe is a
**flat 10-row grid**, not categorized. Refactor `lib/mock-data.ts`: add
`mockDocuments: DocCardData[]` with `{id, name, englishName?, use, issuer, issuerIcon}`.

---

### 3.5 `/issue/verify` — A-01.kyc

```
AppShell
├─ AppBar title="본인 확인"
└─ main (px-5 py-4):
   ├─ PageHeader size="compact" title="이 정보로 발급할게요" subtitle="틀리면 발급기관에서 거절돼요"
   ├─ Card variant="paper":          // identity readback
   │  ├─ DataRow label="이름"   value="김민수"
   │  ├─ DataRow label="생년월일" value="1985-03-01"
   │  └─ DataRow label="여권번호" value="M12345678" (mono font)
   ├─ Callout tone="info" icon=Info
   │       title="발급기관에 본인 확인이 필요해요"
   │       description="KR-NTS · 인증서 또는 카드결제 1회 인증"
   └─ Checkbox PIPA §17 (required)    // decision 2026-05-10
└─ Footer:
   └─ Button fullWidth disabled={!agreed}>다음 단계로</Button>
```

**`DataRow` is local** — `components/issue/data-row.tsx`, simple flex row.

---

### 3.6 `/issue/success` — A-01.success

Brief celebratory card. Decision 2026-05-10: redirect to `/history` (발급 내역),
**not** `/home`.

```
AppShell scroll="fixed" background="blue"
└─ main centered:
   ├─ <CheckCircle size={72} className="text-white"/>
   ├─ ds-title white "발급 신청이 접수됐어요"
   └─ ds-body white/80 "백그라운드로 진행되니 다른 일을 봐도 돼요"
└─ Footer (transparent border):
   └─ Button variant="inverted" fullWidth>발급 내역 보기</Button>  // → /history
```

**Today's gap.** Currently routes to `/history` ✓ but uses `!bg-white !text-primary`
hack on `Button`. Add `variant="inverted"` to `Button` first.

---

### 3.7 `/history` — A-06 list

```
AppShell
├─ AppBar title="발급 내역" badges={['testnet']}
└─ main:
   └─ active: stack of <Card clickable> per pending application:
      ├─ Pill variant="info" "번역 중 (1/3)"
      ├─ ds-headline "납세증명서 (영문)"
      ├─ ds-caption text-ink-muted "신청 2026-05-10"
      ├─ ProgressBar value={33} label="1 / 3" (when in middle)
      └─ <ChevronRight/> trailing
└─ Footer: BottomHomeBar (no CTA — purely list)
```

**Empty.** "진행 중인 신청이 없어요" + Button secondary "발급 신청 하기" → `/issue/select`.
**Loading.** Three `<Skeleton>` cards.
**Error.** ErrorState retry.

---

### 3.8 `/history/[id]` — A-06 detail (with dispute entry)

```
AppShell
├─ AppBar title="발급 이력"
└─ main:
   ├─ PageHeader size="compact" title="납세증명서 (영문)"
   ├─ Card: vertical timeline of <HistoryStep>:
   │    ├─ HistoryStep status="done"   title="신청 접수"      timestamp="05-09 10:30" issuer="KR-NTS"
   │    ├─ HistoryStep status="done"   title="번역 시작"      timestamp="05-09 11:05" issuer="번역사 A"
   │    ├─ HistoryStep status="active" title="공증 진행 중"   timestamp="05-10 09:12" issuer="공증인 B"
   │    │    └─ <Callout tone="info" icon="spinner" title="공증 처리 중이에요" description="평균 2시간"/>
   │    └─ HistoryStep status="wait"   title="아포스티유 대기"
   └─ <p className="ds-caption text-ink-muted text-center">자동 만료·폐기 시 개인정보는 즉시 삭제돼요</p>
└─ Footer:
   └─ Button variant="danger" fullWidth onClick={openDispute}>이 단계에 문제가 있어요</Button>
└─ BottomSheet open={openDispute} title="어디에 문제가 있나요?"
   ├─ RadioGroup options=[번역 오류 / 원문과 다름 / 진행 지연 / 기타]
   ├─ TextArea (선택) "자세히 알려주세요"
   ├─ FileUpload "스크린샷 첨부 (선택)"
   └─ Button variant="danger">신고할게요</Button>
```

**`HistoryStep` is a new molecule** — `components/ui/history-step.tsx`. Composes
`StepDot` + title + timestamp + optional callout.

---

### 3.9 `/documents` — A-03 list

```
AppShell
├─ AppBar title="내 문서" badges={['testnet']}
└─ main:
   ├─ TabBar value={tab} onChange={setTab}
   │       options=[{value:'available',label:'사용 가능',count:2}, {value:'expired',label:'만료됨',count:1}]
   ├─ if (tab==='available' && hasIncoming):
   │      Callout tone="info" icon="spinner"
   │          title="납세증명서 (영문) 가 도착해요"
   │          description="KR-MFA 인증 처리 중이에요. 곧 도착해요"
   ├─ if (tab==='expired' && hasExpired):
   │      Callout tone="warning" icon=Clock
   │          title="유효기간이 지난 문서예요. 다시 발급받을 수 있어요"
   ├─ DocCard list (tab-filtered):
   │      tab==='available' → DocCard onClick={→ /documents/[id]}, trailing icons (refresh, history)
   │      tab==='expired'   → DocCard expired onClick={→ /history/[id]}
   └─ if (tab==='expired'):
         Callout tone="info" icon=Info "자동 만료·폐기 완료됐어요. 개인정보는 자동으로 삭제돼요"
└─ Footer:
   if (tab==='expired' && hasExpired):
      Button variant="primary" fullWidth>다시 발급할게요</Button>     → /renewal
      Button variant="secondary" fullWidth>다음에 할게요</Button>      → /home
   else:
      BottomHomeBar
```

**State variants.**
- `loading` (available tab) — keep TabBar visible, render skeleton DocCards.
- `empty` (available tab) — `EmptyState` "아직 발급된 문서가 없어요" + Button secondary `발급 신청 하기`.
- `empty` (expired tab) — `EmptyState` "만료된 문서가 없어요" (positive message).
- `error` — replace tab content with `ErrorState`, keep TabBar.

**Today's gap.** `documents/page.tsx` mixes both tabs into one list and lacks the
`TabBar`. Refactor: data hook returns `{ available: Doc[], expired: Doc[] }`.

---

### 3.10 `/documents/[id]` — A-03 detail (S-04.detail)

**Decision 2026-05-10.** Detail = PDF preview + 3 actions, **no XRPL verification info**.

```
AppShell
├─ AppBar title="납세증명서 (영문)"
└─ main:
   ├─ PdfPreview src={doc.pdfUrl}      // simple <iframe>/<embed>, no over-design
   ├─ Card variant="paper":
   │   DataRow "발급기관" "KR-NTS"
   │   DataRow "발급일"   "2026-05-10"
   │   DataRow "유효기간"  "2026-08-10" + Pill variant="warning" if D-7 (decision 2026-05-10)
└─ Footer (3 stacked buttons):
   ├─ Button primary fullWidth → /submission-request
   ├─ Button secondary fullWidth → /renewal
   └─ Button variant="text-link" → /history/[id] then opens dispute sheet
```

---

### 3.11 `/submission-request` — A-04

```
AppShell
├─ AppBar title="제출 기관 선택" badges={['testnet']}
└─ main:
   ├─ PageHeader size="compact" title="어디로 제출할까요?" subtitle="문서를 받을 해외 기관을 선택해 주세요"
   ├─ Callout tone="info" icon=Info "받은 요청 3건 중 선택" (when applicable)
   └─ Stack of <SelectableCard> per institution:
       ├─ ds-headline "주미 한국대사관"
       ├─ ds-caption text-ink-secondary "United States Embassy"
       ├─ Pill variant="neutral" mono "US-CONS"
       └─ ChevronRight trailing
└─ Footer:
   └─ Button primary fullWidth disabled={!selected} onClick={openConfirm}>보낼게요</Button>

BottomSheet open={openConfirm} title="이 기관에 보낼까요?"
   ├─ ds-body "주미 한국대사관 (US-CONS)에 납세증명서 (영문)을 보냅니다."
   ├─ ds-caption text-ink-muted "전송 후엔 취소할 수 없어요."
   └─ Footer:
       ├─ Button primary fullWidth>네, 보낼게요</Button>
       └─ Button secondary>다음에 할게요</Button>
```

**Today's gap.** Direct submit on button click, no confirm. Add `BottomSheet`.

---

### 3.12 `/delivery` — A-05

```
AppShell
├─ AppBar title="해외 제출 현황" badges={['testnet']}
└─ main:
   ├─ Callout tone="info" icon=Send title="현재 전송 중이에요" description="기관 접수까지 영업일 기준 1~3일 소요"
   ├─ Card:
   │   ds-caption text-ink-muted "제출 기관"
   │   ds-headline "주미 한국대사관"
   │   ProgressBar value={50} label="2 / 4 단계"
   └─ Card variant="paper":
       <h3 className="ds-headline">전송 단계</h3>
       <StepTimeline stages={[
         {label:'제출 요청',     status:'done'},
         {label:'서류 전송 중',   status:'active'},
         {label:'기관 접수 확인', status:'wait'},
         {label:'처리 완료',      status:'wait'},
       ]}/>
└─ Footer:
   ├─ Button primary fullWidth disabled={!completed}>확인했어요</Button>
   └─ Button secondary fullWidth>홈으로</Button>
```

**Today's gap.** Single secondary button only; missing primary + completion-gating.

---

### 3.13 `/renewal` — A-07

Already close. Refactor:

```
AppShell
├─ AppBar title="재발급 안내"
└─ main:
   ├─ Callout tone="warning" icon=RefreshCw
   │       title="유효기간이 곧 만료돼요"
   │       description="기존 정보로 재발급할 수 있어요"
   └─ Card[3] per step:
       ├─ IconBox tone="blue" size="md" icon=numberStr  // "1", "2", "3"
       ├─ ds-headline title
       └─ ds-caption text-ink-secondary desc
└─ Footer:
   ├─ Button primary fullWidth>재발급 신청하기</Button>   → /issue/select
   └─ Button secondary fullWidth>다음에 할게요</Button>     → /home
```

**Today's gap.** Uses raw `ds-icon-box ds-tone-yellow` and a custom numbered
circle. Pull both into `IconBox`.

---

### 3.14 `/disputes` and `/disputes/new` — S-06

**`/disputes`** (list) — already shape-correct. Verify:
- `Pill` variants align (`disputeStatusMap` uses `success/warning/danger/info/neutral`).
- Empty state uses `EmptyState` ✓.
- Footer CTA `Button variant="danger"` ✓ (per design rule "destructive only").

**`/disputes/new`** (S-06.new — wireframe A-06 sub-state 4a) — currently empty:

```
AppShell
├─ AppBar title="이의 신청"
└─ main:
   ├─ PageHeader size="compact" title="어디에 문제가 있나요?"
   ├─ Card: which step (read-only inherited from history detail, or step picker)
   ├─ RadioGroup label="사유" options=[번역 오류 / 원문과 다름 / 진행 지연 / 기타]
   ├─ TextArea label="자세히 알려주세요" showCount maxLength={500}
   └─ FileUpload "스크린샷 첨부 (선택)"     // optional, can be a Button with hidden input
└─ Footer:
   └─ Button variant="danger" fullWidth disabled={!valid}>신고할게요</Button>
```

**`/disputes/success`** — full-screen blue confirmation card (mirror `/issue-complete`).

**`/disputes/[id]`** — read-only timeline:
```
AppShell
├─ AppBar title="신고 상세"
└─ main:
   ├─ Card "신고 카드": 사유 / 단계 / 신청일시 / 상세
   └─ Card "운영자 응답" (if any) — single-direction (decision 2026-05-10, no thread)
```

---

### 3.15 `/issue-complete` — A-03 fullscreen success

Already shape-correct. Just swap the `!bg-white !text-primary` Button hack
for `variant="inverted"`.

---

## 4. Cross-screen affordances (avoid duplication)

These elements appear on **multiple** screens — always render them via the same
component, never re-build inline:

| Affordance | Screens | Component |
|---|---|---|
| Status badge stack (Testnet/Mock/Pre-Check) | A-01, A-03, A-04, A-05, A-06, S-04, /history | `<AppBar badges>` |
| Loading callout w/ spinner | A-02, A-03, A-04 incoming | `<Callout tone="info" icon="spinner">` |
| Expired/warning banner | A-03 expired tab, A-07, doc-detail D-7 | `<Callout tone="warning">` |
| Error retry pattern | every screen `error` state | `<ErrorState>` |
| Empty CTA pattern | every screen `empty` state | `<EmptyState>` |
| Dispute reason sheet | A-06 detail, history detail, dispute new | `<BottomSheet>` w/ `<RadioGroup>` |
| Confirm-before-submit sheet | A-04 send, login terms, dispute submit | `<BottomSheet>` |

---

## 5. Page tree shape (canonical)

Every route follows this skeleton:

```tsx
'use client'
export default function Page() {
  const view = useScreenData()        // returns discriminated union state
  return (
    <AppShell
      header={<AppBar title="…" badges={[…]}/>}
      footer={view.state === 'active' ? <PageFooter>…</PageFooter> : <BottomHomeBar/>}
    >
      {match(view)
        .with({state:'loading'}, () => <Screen.Loading/>)
        .with({state:'empty'},   () => <Screen.Empty/>)
        .with({state:'error'},   ({error,retry}) => <ErrorState onRetry={retry}/>)
        .with({state:'active'},  ({data}) => <Screen.Active data={data}/>)
        .exhaustive()}
    </AppShell>
  )
}
```

Don't reach for `ts-pattern`'s `match()` if you don't already have it — a plain
`switch (view.state)` is fine. The point is a single source of truth per page,
not the library.

---

## 6. Mock-data shape additions

`lib/mock-data.ts` must grow these collections **before** screen refactors land:

```ts
// A-01 / A-03
export interface Document {
  id: string
  name: string                 // 납세증명서 (영문)
  englishName?: string         // Tax Payment Cert.
  use: string                  // 미국 영사관 비자 재정증명
  issuer: string               // KR-NTS · 한국 국세청
  issuerCode: 'KR-NTS' | 'KR-법원' | 'KR-MOIS' | 'KR-병무청' | 'KR-경찰청' | 'KR-학교' | 'KR-건보'
  issuerIcon: string           // 'NTS', '법원', …
  issuedAt?: string            // ISO date
  expiresAt?: string
  status: 'available' | 'expired' | 'incoming'
}

// A-04
export interface SubmissionRequest {
  id: string
  institution: { code: 'US-CONS' | 'AU-IMM' | 'CA-IMM'; name: string; country: string }
  requestedDocs: string[]      // Document.id refs
  receivedAt: string
}

// A-06
export interface HistoryEvent {
  id: string
  step: 'apply' | 'translate' | 'notarize' | 'apostille' | 'deliver'
  status: 'done' | 'active' | 'wait' | 'error'
  title: string
  timestamp: string
  actor?: string               // KR-NTS, 번역사 A, …
  callout?: { tone: 'info'|'success'|'warning'|'danger'; title: string; description?: string }
}
```

---

## 7. What lives **outside** these screens

- **Splash / onboarding** — explicitly skipped per decision 2026-05-10.
- **Settings page** — wireframe shows a settings icon in `mobile-nav`, but no
  screen drawn. Out of scope.
- **Notifications inbox** — referenced in A-02 push variant but not a screen.
- **Profile** — out of scope for v1.
