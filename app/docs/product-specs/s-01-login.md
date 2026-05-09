# S-01 — Google 로그인

첫 진입. 풀스크린, 앱바·하단탭 없음.

## Layout

```
┌──────────────────────┐ safe-area-inset-top
│                      │
│                      │
│       MyApo          │ display 22 / 700 / -0.02em
│  한국 서류,            │ body 15 / 500 / ink-secondary
│  한 번 발급하고        │
│  평생 재사용           │
│                      │
│       (flex-grow)    │
│                      │
│ ┌──────────────────┐ │ Google 브랜드 버튼 (custom)
│ │ G  Google로 시작할게요│ │ paper bg / 1px hairline / 56px
│ └──────────────────┘ │
│ 이용약관 · 개인정보처리방침│ caption 13 / ink-muted
└──────────────────────┘ safe-area-inset-bottom + 16px
```

## Spec

- 워드마크 위치: 화면 상단 ~30vh
- Google 버튼: 하단 고정, 풀-와이드, edge 20px
- 버튼 텍스트: "Google로 시작할게요"
- 약관 링크: 버튼 아래 12px, tap → bottom-sheet 모달

## TBD

- 로딩 / 에러 상태 (OAuth 구현 시점)
- 비로그인 deep-link 진입 동작
- 약관 본문 카피 (법무 검토)
