# S-05.detail — 신청 진행 상황

S-05 발급 내역 카드 tap 시 push 진입. "지금 어디까지 진행됐어?"가 한눈에.

## Layout

```
┌──────────────────────┐
│ ← 신청 진행 상황       │ app-bar 56px
├──────────────────────┤
│                      │
│ 납세증명서 (영문)      │ headline 17 / 700
│ Tax Payment Cert.     │ caption 13 / ink-secondary
│ KR-NTS                │ pill-neutral mono 13
│                      │
│ ●━━━●━━━○━━━○        │ step-dot 타임라인
│ 국세청 번역 외교부 지갑  │ 단계 라벨 caption 13
│ 1단계 완료, 2단계 활성  │ active = pulse halo
│                      │
│ ┌──────────────────┐ │ detail-panel (canvas bg)
│ │ 지금 번역·공증 처리 중│ │ body 15 / 500 / ink
│ │                   │ │
│ │ 처리 시작 5월 8일   │ │ caption 13 / ink-secondary
│ │ 예상 완료 5월 11일  │ │ caption 13 / ink-secondary
│ └──────────────────┘ │
│                      │
└──────────────────────┘
```

## Spec

- 앱바: ← back + "신청 진행 상황"
- 서류명 영역: 페르소나 단일 언어 (한국인=한글 / 외국인=영문) + 발급기관 pill (mono, 페르소나 무관)
- step-dot 타임라인: 4단계 기본 (`국세청` → `번역` → `외교부` → `지갑`), 단계 수는 서류별 가변
  - 완료 단계 = `step-dot-done` 초록 ✓
  - 현재 단계 = `step-dot-active` Toss블루 + pulse halo
  - 대기 단계 = `step-dot-wait` 회색
  - 실패 단계 = `step-dot-error` 빨강 (에러 시)
- 현재 상태 패널: `detail-panel` 컴포넌트
  - 1줄: "지금 [단계명] 처리 중이에요"
  - 2줄: "처리 시작 [날짜]"
  - 3줄: "예상 완료 [날짜]"

## 동작

- 자동 갱신 (단계 진행 시 step-dot 색 변화)
- 모든 단계 완료 → S-05 리스트에서 사라짐 + S-04로 credential 이관 (자동)

## 서명 요청 인터랙션

서명이 필요한 단계 도달 시 → 화면 하단에 sticky `btn-primary` "서명할게요" 노출.

```
┌──────────────────────┐
│ ... step-dot timeline │
│                      │
│ ┌──────────────────┐ │ detail-panel
│ │ 지금 외교부 인증을 │ │ "이 단계는 사용자 서명이
│ │ 위해 서명이 필요해요│ │  필요해요"
│ └──────────────────┘ │
├──────────────────────┤ sticky 하단
│ ┌──────────────────┐ │
│ │ 서명할게요          │ │ btn-primary 56px
│ └──────────────────┘ │
└──────────────────────┘
```

"서명할게요" tap → bottom-sheet 등장:
- 핸들 + "서명이 필요해요" 헤드라인
- detail-panel: 서류명 / 발급기관 / 단계 / 환경 메타
- `btn-primary` "서명할게요" + `btn-secondary` "나중에 할게요"
- 서명 완료 → bottom-sheet 닫힘 + step-dot 진행

## 에러 케이스

단계가 멈췄을 때 (번역사 응답 없음 등):
- step-dot `step-dot-error` 빨강
- detail-panel 카피: "[기관] 응답이 없어요. 다시 시도할 수 있어요."
- 하단 sticky `btn-primary` "다시 시도할게요"

## TBD

- 단계별 타임스탬프 (처리 완료 시각) 표시 여부
- 취소 / 알림 토글
- 푸시 알림 — 완료 시 자동 알림 ON?
- A-02 와이어프레임 → 이 스펙으로 흡수 예정
