# S-04.detail — 증명서 상세

S-04 카드 tap 시 push 진입. PDF 미리보기 + 하단 3-액션 바.

## Layout

```
┌──────────────────────┐
│ ← 납세증명서 (영문)   │ app-bar 56px
├──────────────────────┤
│                      │
│   ┌────────────┐     │
│   │            │     │ PDF 페이지 (1/N)
│   │   [PDF]    │     │ paper bg, hairline border,
│   │            │     │ rounded-md, edge 20px
│   │            │     │ aspect ratio approx 1:1.4 (A4)
│   │            │     │ 페이지 우상단 "1 / 2" pill
│   │            │     │
│   └────────────┘     │
│                      │ 멀티 페이지 = 세로 스크롤
│                      │
├──────────────────────┤ sticky 하단 액션 바
│  ⟳    📤    ⚖       │ 3-cell (균등 분할)
│ 재발급  제출   분쟁    │ 아이콘 24 + micro 11
│        신청          │ height 64 + safe-area-bottom
└──────────────────────┘
```

## Spec

- 앱바: ← back + 서류명, 페르소나 따라 단일 언어 (한국인=한글 / 외국인=영문, [copy.md](./copy.md) 참조)
- 우상단 액션 / `⋯` 메뉴 **없음** (액션은 하단 바 전부)
- PDF 영역: full-width minus 20px edge, paper bg, 1px hairline, rounded-md, 세로 스크롤
- 페이지 인디케이터: 우상단 PDF 영역 안 `pill-neutral` "N / M"
- XRPL 검증 정보 표시 **없음**
- 하단 액션 바: sticky, paper bg, 1px hairline 상단, height 64px + safe-area-bottom 추가
- 액션 셀: 균등 3등분, 아이콘 24px (Lucide outline) + 라벨 `micro 11/500 ink-secondary`, 가운데 정렬
- 셀 tap 시 ripple 없이 background 살짝 어두워짐

## 액션 3종

| 셀 | 한글 | 영문 | 아이콘 | 동작 |
|---|---|---|---|---|
| 1 | 재발급 | Reissue | `refresh-cw` | A-07 (재발급) 진입 |
| 2 | 제출 | Submit | `send` | A-06 제출 플로우 — 기관 선택 bottom-sheet |
| 3 | 분쟁 신청 | Dispute | `scale` | 분쟁 신청 폼 (S-06.new, TBD) |

## 만료 credential 차이

- "사용 가능" 탭에서 진입한 카드: 3 액션 모두 활성
- "만료됨" 탭에서 진입한 카드: 제출 비활성 (`ink-muted`), 재발급 강조 (`primary`), 분쟁 신청 활성

## TBD

- PDF 렌더링 라이브러리 (react-pdf? pdfjs?)
- PDF 다운로드 / 공유 진입로 (액션 바에 없으니 추가? 또는 우상단 `⋯` 부활?)
- 분쟁 신청 폼 (S-06.new) 구조
