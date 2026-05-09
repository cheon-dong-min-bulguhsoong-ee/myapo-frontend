# S-02 — 페르소나 선택

로그인 직후 1회 선택. 풀스크린 미니멀, 앱바 없음 (강제 진행).

## Layout

```
┌──────────────────────┐ safe-area-inset-top
│                      │
│       (큰 빈 공간)     │
│                      │
│ 외국인인가요, 한국인인가요?│ display 22 / 700 / -0.02em
│ Are you Korean or     │ body 15 / 500 / ink-secondary
│ foreigner?            │
│                      │
│ ┌──────────────────┐ │ segmented control
│ │ 한국인 │ 외국인     │ │ 좌 활성 (기본)
│ │Korean │Foreigner   │ │ bilingual stacked, height 52px
│ └──────────────────┘ │
│                      │
│ ┌──────────────────┐ │ btn-primary 56px, 항상 활성
│ │ 다음으로 갈게요 / Continue│
│ └──────────────────┘ │
└──────────────────────┘ safe-area-inset-bottom + 24px
```

## Spec

- segmented 좌측(한국인) **기본 선택**
- 라벨: 한글 `body-emphasis` 위, 영문 `caption ink-muted` 아래
- 뒤로가기 차단 (Android 백 / iOS 스와이프 백)
- "다음으로 갈게요" tap → 선택값 저장 → S-03 push

## 변경 가능

한 번 선택 후 변경 가능 — 진입로 TBD (인사말 tap? 길게 누르기?)

## TBD

- 영문 헤드라인 최종 카피
