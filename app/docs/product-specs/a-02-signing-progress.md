# A-02 — 발급 진행 (단계별 서명)

A-01 발급 신청 후 진입. 다단계 서명 플로우. **와이어프레임 있음.**

원본: [../design-docs/wireframes/](../design-docs/wireframes/) (`A-02` 섹션)

## 핵심 시각 요소

- step-dot 타임라인 (3단계 기본): 한국 정부 → 번역/공증 → KR-MFA 인증 → 내 지갑
- 활성 단계 = `step-dot-active` (pulse halo)
- 진행률 progress-fill

## 4 variant

- Active: 단계 1/3 진행
- Loading: 번역사 처리 중
- Wallet 서명 요청: bottom-sheet "서명할게요" 등장
- Error: 번역사 응답 없음 → 다시 시도

## TBD

- 단계 수 가변 (서류별로 2~4단계)?
- 서명 요청 알림 / 백그라운드 동작
