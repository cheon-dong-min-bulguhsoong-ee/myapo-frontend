# UI Consistency Harness

> 목적: 현재 MyApo 디자인 시스템의 색상은 그대로 유지하면서, 화면마다 어긋난 텍스트 크기·여백·요소 간격·정렬감을 일관되게 개선하기 위한 설계 및 검수 하네스입니다.  
> 기준 자료: `design-system/`, `app/globals.css`, `components/ui/`, 현재 앱 화면(`app/`).

## 1. 핵심 원칙

이번 UI 개선은 새로운 디자인 시스템을 만드는 작업이 아닙니다. 이미 정의된 Toss-inspired 팔레트와 모바일 앱 톤을 보존하고, 시각적 불균형을 만드는 **크기·간격·밀도·정렬 규칙**을 정리합니다.

| 구분 | 원칙 |
| --- | --- |
| 색상 | 기존 토큰과 의미 체계를 유지합니다. 새 hex 색상 추가를 금지합니다. |
| 타이포 | 임의의 px 크기를 줄이고 역할 기반 크기 체계로 통일합니다. |
| 여백 | 화면 단위 vertical rhythm을 만들고 섹션·카드·폼 간격을 반복 가능한 규칙으로 맞춥니다. |
| 컴포넌트 | 버튼, 카드, 입력 필드, 콜아웃, 하단 내비게이션은 공유 컴포넌트 기준으로 우선 정리합니다. |
| 검수 | 변경 전후를 같은 화면 단위로 비교하고, 색상 변경 여부를 별도 체크합니다. |

## 2. 변경 금지선

### 2.1 색상은 수정하지 않습니다

색상의 기준 파일은 다음입니다.

| 파일 | 역할 |
| --- | --- |
| `design-system/tokens.css` | 원본 디자인 토큰. `--ink`, `--blue`, `--green`, `--red`, `--yellow`, spacing, radius, shadow, motion 정의. |
| `design-system/colors_and_type.css` | `--fg1`, `--bg1`, `--accent`, `--success`, `--warn`, `--danger` 같은 의미 alias 정의. |
| `app/globals.css` | 실제 앱에서 쓰는 Tailwind v4 CSS-first token bridge와 공용 UI 클래스. |

금지 사항:

- 새로운 브랜드/상태 hex 값을 추가하지 않습니다.
- `--blue`, `--green`, `--red`, `--yellow`, `--ink`, `--bg-soft`, `--line`의 의미를 바꾸지 않습니다.
- UI가 지저분해 보인다는 이유로 색 농도나 채도를 조정하지 않습니다.
- hardcoded color가 필요해 보여도 먼저 기존 token 또는 semantic alias로 치환 가능한지 확인합니다.

예외:

- 기존 화면이 토큰과 다른 임시 색상을 직접 쓰고 있다면, **새 색상을 만드는 것이 아니라 기존 토큰으로 복귀**합니다.
- 예: `app/history/[id]/page.tsx`의 success 상태 색상처럼 token과 다른 hardcoded green은 `--success`/기존 green 계열로 정리 대상입니다.

## 3. UI 정리 대상

현재 우선 정리해야 하는 불균형은 다음 4가지입니다.

| 문제 | 증상 | 개선 방향 |
| --- | --- | --- |
| 텍스트 크기 mismatch | `text-[10px]`, `text-[11.5px]`, `text-[12px]`, `text-[13px]`, `text-[15px]`, `text-[18px]`, `text-[22px]`가 화면마다 섞임 | 역할별 type role로 통합 |
| 여백 rhythm 부족 | `gap-0.5`부터 `gap-5`까지 맥락 없이 혼재 | 섹션/카드/폼 단위 간격 scale 적용 |
| 요소 간격 불균형 | 아이콘-라벨, 카드 내부, 리스트 row 간격이 화면마다 다름 | component-level gap 규칙 우선 적용 |
| 화면 밀도 불일치 | 어떤 화면은 지나치게 촘촘하고 어떤 화면은 headline만 큼 | 모바일 화면별 content density 기준 적용 |

대표 점검 파일:

- `components/ui/page-header.tsx`
- `components/ui/button.tsx`
- `components/ui/text-field.tsx`
- `components/ui/callout.tsx`
- `components/ui/step-timeline.tsx`
- `components/ui/bottom-home-bar.tsx`
- `app/documents/[id]/page.tsx`
- `app/history/[id]/page.tsx`
- `app/login/page.tsx`
- `app/issue-complete/page.tsx`

## 4. 타이포그래피 하네스

### 4.1 역할 기반 크기

임의의 pixel 크기를 화면마다 직접 고르지 말고, 먼저 텍스트의 역할을 분류합니다.

| 역할 | 용도 | 권장 기준 |
| --- | --- | --- |
| Screen title | 화면 최상단 제목 | `PageHeader` 기준으로 통일 |
| Section title | 카드/섹션 제목 | 16-18px 범위에서 한 단계로 통일 |
| Body | 설명문, 일반 본문 | 14-15px 범위에서 한 단계로 통일 |
| Metadata | 날짜, 보조 상태, 설명 라벨 | 12-13px 범위에서 한 단계로 통일 |
| Micro label | 탭/스텝/칩 내부의 아주 작은 라벨 | 10-11px는 정말 필요한 경우만 허용 |
| CTA | 버튼 텍스트 | primary/secondary/link variant별로 공유 컴포넌트에서 통일 |

### 4.2 적용 규칙

1. `text-[11.5px]`처럼 반 단위 arbitrary size는 제거합니다.
2. 같은 의미의 텍스트가 서로 다른 크기를 쓰면 더 많이 쓰이는 공유 컴포넌트 기준으로 맞춥니다.
3. 화면 제목, 섹션 제목, 카드 제목은 같은 화면 안에서 위계가 명확해야 합니다.
4. metadata와 body의 대비가 너무 작으면 metadata를 더 작게 하기보다 body/section 간격을 정리합니다.
5. 숫자와 영문이 강조되는 경우에는 디자인 시스템의 `.num`/`.en` 의도를 유지합니다.

## 5. 간격 하네스

### 5.1 간격 단위

간격은 “화면 → 섹션 → 카드 → 컴포넌트 내부 → 아이콘/텍스트” 순서로 정합니다. 안쪽 요소부터 임의로 조정하면 화면 전체 rhythm이 깨집니다.

| 레벨 | 대상 | 기준 |
| --- | --- | --- |
| Page | 화면 상하단 여백, safe area | 앱 shell과 CTA/bar 높이를 기준으로 유지 |
| Section | 큰 기능 블록 사이 | 한 화면에서 같은 section gap 반복 |
| Card | 카드 간 간격, 카드 내부 padding | 카드 종류별 padding/gap 고정 |
| Row | 리스트 row, 정보 row | label/value 간격과 row height 통일 |
| Inline | 아이콘-텍스트, 칩 내부 | 작은 gap은 1-2단계만 사용 |

### 5.2 정리 규칙

1. 한 화면에서 `gap-3`, `gap-3.5`, `gap-4`, `gap-5`가 동시에 쓰이면 section/card/row 역할로 재분류합니다.
2. 아이콘과 라벨 사이의 `gap-0.5`는 너무 촘촘해 보이면 공유 내비게이션/스텝 컴포넌트 기준으로 조정합니다.
3. 카드 내부 padding은 visual density를 결정하므로 페이지마다 직접 바꾸지 않습니다.
4. 버튼 위아래 margin은 CTA 영역 규칙으로 처리하고, 개별 버튼에 임시 margin을 붙이지 않습니다.
5. 입력 필드 label, hint, error 간격은 `TextField`에서 먼저 정리합니다.

## 6. 컴포넌트 우선순위

UI 개선은 화면 파일을 하나씩 patch하기보다 공유 컴포넌트부터 정리합니다.

| 우선순위 | 대상 | 이유 |
| --- | --- | --- |
| 1 | `PageHeader` | 모든 화면의 첫 인상과 제목 위계를 결정합니다. |
| 2 | `Button` | CTA 높이, 라벨 크기, 터치 타겟 일관성을 만듭니다. |
| 3 | `TextField` | 폼 화면의 라벨/힌트/입력 높이 mismatch를 줄입니다. |
| 4 | `Callout` | 상태/안내 박스의 정보 밀도와 tone을 맞춥니다. |
| 5 | `StepTimeline` | 작은 라벨과 진행 상태 간격을 한 번에 정리합니다. |
| 6 | `BottomHomeBar` | 하단 내비게이션의 icon-label 간격과 micro label을 통일합니다. |

공유 컴포넌트 정리 후에도 어긋나는 부분만 화면 파일에서 조정합니다.

## 7. 화면 audit 절차

각 화면은 아래 순서로 점검합니다.

1. **색상 스냅샷**: 변경 전 사용 중인 색상 token/hardcoded color를 확인합니다.
2. **텍스트 역할 분류**: 제목, 섹션 제목, 본문, metadata, CTA, micro label로 나눕니다.
3. **간격 역할 분류**: page, section, card, row, inline gap으로 나눕니다.
4. **공유 컴포넌트 적용 여부 확인**: 직접 스타일이 공유 컴포넌트를 우회하는지 확인합니다.
5. **불필요한 arbitrary value 제거**: 반 px, 임시 margin/padding, 중복 gap을 줄입니다.
6. **전후 비교**: 같은 데이터 상태에서 모바일 viewport 기준으로 비교합니다.
7. **색상 불변 확인**: 개선 후 새 hex나 token 의미 변경이 없는지 확인합니다.

## 8. PR 체크리스트

UI 개선 PR은 아래 항목을 모두 만족해야 합니다.

### 8.1 색상

- [ ] `design-system/tokens.css`의 palette 값을 바꾸지 않았습니다.
- [ ] `app/globals.css`의 color token 의미를 바꾸지 않았습니다.
- [ ] 새 hardcoded hex 색상을 추가하지 않았습니다.
- [ ] 기존 hardcoded 색상을 수정했다면 기존 token/semantic alias로 치환했습니다.

### 8.2 타이포그래피

- [ ] 같은 역할의 텍스트 크기가 화면 안에서 통일되어 있습니다.
- [ ] `text-[11.5px]` 같은 반 단위 arbitrary size가 없습니다.
- [ ] micro label은 필요한 곳에만 제한적으로 사용했습니다.
- [ ] 화면 제목과 섹션 제목의 위계가 명확합니다.

### 8.3 간격

- [ ] section/card/row/inline gap을 구분해 적용했습니다.
- [ ] 같은 화면 안에서 비슷한 요소 간격이 반복됩니다.
- [ ] CTA와 하단 bar가 콘텐츠와 겹치거나 뜨지 않습니다.
- [ ] 입력 필드 label/hint/error 간격이 일관됩니다.

### 8.4 컴포넌트

- [ ] 공유 컴포넌트로 해결 가능한 스타일을 화면 파일에 중복 작성하지 않았습니다.
- [ ] 버튼 높이와 touch target이 유지됩니다.
- [ ] 카드 radius, border, surface 스타일이 기존 시스템과 맞습니다.
- [ ] 콜아웃/상태 UI는 색상이 아니라 밀도와 위계로 개선했습니다.

### 8.5 검증

- [ ] 변경 파일에 대한 TypeScript/LSP 오류가 없습니다.
- [ ] `bun run lint`를 통과합니다.
- [ ] `bun run build`를 통과합니다.
- [ ] 주요 모바일 화면을 전후 비교했습니다.

## 9. 완료 기준

UI 개선이 완료되었다고 판단하려면 아래 상태가 되어야 합니다.

1. 새 색상 없이 기존 팔레트가 유지됩니다.
2. 공유 컴포넌트의 텍스트 크기와 내부 간격이 먼저 정리됩니다.
3. 화면 파일의 임시 arbitrary size/gap이 줄어듭니다.
4. 페이지별로 제목, 본문, 보조정보, CTA 위계가 반복됩니다.
5. 모바일 viewport에서 “촘촘함”과 “비어 보임”이 동시에 줄어듭니다.
6. lint/build가 통과하고, 검수 체크리스트가 PR에 첨부됩니다.

## 10. 작업 순서 제안

1. `PageHeader`, `Button`, `TextField`부터 정리합니다.
2. `Callout`, `StepTimeline`, `BottomHomeBar`의 micro label과 gap을 맞춥니다.
3. `login`, `documents/[id]`, `history/[id]`, `issue-complete` 화면을 대표 샘플로 정리합니다.
4. 샘플 화면에서 안정된 기준을 다른 화면으로 확장합니다.
5. 마지막에 새 hex 색상, 반 px arbitrary text, 과도한 gap 변형을 grep으로 확인합니다.
