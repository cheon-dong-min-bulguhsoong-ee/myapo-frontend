# Product specs — index

> 맵. 화면 한 줄 요약 + 상세 파일 링크. 본문은 각 파일에 있음.

## Sequence

| # | 화면 | 상태 | 파일 |
|---|---|---|---|
| S-01 | Google 로그인 | 스펙 완료 | [s-01-login.md](./s-01-login.md) |
| S-02 | 페르소나 선택 | 스펙 완료 | [s-02-persona-select.md](./s-02-persona-select.md) |
| S-03 | 홈 (4-메뉴 2×2) | 스펙 완료 | [s-03-home.md](./s-03-home.md) |
| S-04 | 내 증명서 (보유 credential) | 스펙 완료 | [s-04-my-documents.md](./s-04-my-documents.md) |
| S-04.detail | 증명서 상세 (PDF + 3액션) | 스펙 완료 | [s-04-detail.md](./s-04-detail.md) |
| S-05 | 발급 내역 (진행 중만) | 스펙 완료 | [s-05-history.md](./s-05-history.md) |
| S-05.detail | 신청 진행 상황 | 스펙 완료 | [s-05-detail.md](./s-05-detail.md) |
| S-06 | 분쟁 내역 (리스트) | 스펙 완료 | [s-06-disputes.md](./s-06-disputes.md) |
| S-06.new | 분쟁 신고 폼 | 스펙 완료 | [s-06-new.md](./s-06-new.md) |
| S-06.success | 분쟁 신고 완료 | 스펙 완료 | [s-06-success.md](./s-06-success.md) |
| S-06.detail | 분쟁 상세 | 스펙 완료 | [s-06-detail.md](./s-06-detail.md) |
| A-01 | 서류 발급 (서류 선택) | 스펙 완료 | [a-01-issue-select.md](./a-01-issue-select.md) |
| A-01.kyc | 본인 인증 (dummy SMS) | 스펙 완료 | [a-01-kyc.md](./a-01-kyc.md) |
| A-01.success | 신청 완료 알림 | 스펙 완료 | [a-01-success.md](./a-01-success.md) |
| A-02 | (흡수 → S-05.detail) | 흡수됨 | [a-02-signing-progress.md](./a-02-signing-progress.md) |
| A-03 | 발급 완료 알림 | 스펙 완료 | [a-03-issue-complete.md](./a-03-issue-complete.md) |
| A-04 | 요청 기관 선택 (제출) | 스펙 완료 | [a-04-submission-request.md](./a-04-submission-request.md) |
| A-05 | 전달 중 (해외 제출 진행) | 스펙 완료 | [a-05-delivery.md](./a-05-delivery.md) |
| A-06 | (흡수 → S-06 분쟁 시리즈) | 흡수됨 | — |
| A-07 | 재발급 안내 | 스펙 완료 | [a-07-renewal.md](./a-07-renewal.md) |

## Global rules

- **Bottom home bar** — S-03 외 모든 화면 하단에 `bottom-home-bar` (단일 홈 버튼) 노출. tap → S-03, 플로우 스택 초기화. 컴포넌트 정의 = `../DESIGN.md` `bottom-home-bar`. 개별 spec 파일의 layout 박스에 명시 안 했어도 글로벌 적용.
- **i18n** — S-01 한글, S-02 한·영 게이트, S-03 이후는 페르소나에 따라 단일 언어 (한국인=한글 / 외국인=영문). `copy.md` 마스터 참조.
- **Sticky CTA 위치** — sticky CTA가 있는 화면은 CTA가 `bottom-home-bar` 위에 떠있음. CTA padding-bottom = 16px (safe-area는 home-bar가 흡수).

## 진행 상태

전체 화면 스펙 1차 완료. 남은 작업은 TBD 항목 정리, 페르소나 영문 카피 마감, 코드 구현.

## See also

- 결정 로그: [decisions.md](./decisions.md)
- 미해결 항목 + 우선순위: [tbd.md](./tbd.md)
- 한·영 카피 마스터: [copy.md](./copy.md)
- 와이어프레임 원본: [../design-docs/wireframes/](../design-docs/wireframes/)
- 디자인 시스템: [../DESIGN.md](../DESIGN.md)
