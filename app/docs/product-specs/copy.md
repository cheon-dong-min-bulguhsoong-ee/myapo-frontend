# Copy — 한·영 카피 마스터

모든 화면의 사용자-노출 문자열 한 곳에 마감.

## i18n 정책

- **S-01 (로그인)** — 한글 기본. 페르소나 미정이지만 진입 화면이므로 한글 단독.
- **S-02 (페르소나 선택)** — 한·영 둘 다 노출 (게이트, 페르소나 선택 전).
- **S-03 이후 모든 화면** — **페르소나 따라 단일 언어**.
  - 한국인 = 한글만
  - 외국인 = 영문만 (한글 표시 X, "한·영 stacked" 패턴 폐기)
- 기관 코드 (`KR-NTS`, `KR-MFA`, `US-CONS` 등) = 페르소나 무관 mono 노출.

## 톤 원칙

- 토스 스타일 — 영문은 짧고 단호 ("Get", "Sign", "Submit")
- 한글 평서문 종결 ("~할게요") → 영문은 명령형 또는 명사구
- 사용자 호칭 안 씀 — "you" / "당신" 모두 회피

---

## 공통 (Common)

| 한글 | 영문 |
|---|---|
| 확인 | OK |
| 닫기 | Close |
| 취소 | Cancel |
| 다음에 할게요 | Maybe later |
| 다시 시도할게요 | Retry |
| 다시 발급할게요 | Reissue |
| 발급일 | Issued |
| 유효기간 | Valid until |
| 만료일 | Expired on |
| 발급기관 | Issuer |
| 신청일 | Applied |
| 신고일 | Submitted |
| 응답일 | Replied |
| 단계 N/M | Step N/M |
| 정상 | OK |
| 처리 중 | Processing |

---

## S-01 — Google 로그인

| 위치 | 한글 | 영문 |
|---|---|---|
| 워드마크 | MyApo | MyApo |
| 부제 1줄 | 한국 서류, | Korean documents — |
| 부제 2줄 | 한 번 발급하고 평생 재사용 | issue once, reuse forever |
| Google 버튼 | Google로 시작할게요 | Continue with Google |
| 약관 링크 | 이용약관 · 개인정보처리방침 | Terms · Privacy |

---

## S-02 — 페르소나 선택

| 위치 | 한글 | 영문 |
|---|---|---|
| 헤드라인 | 외국인인가요, 한국인인가요? | Are you Korean or foreign? |
| 좌 옵션 | 한국인 | Korean |
| 우 옵션 | 외국인 | Foreigner |
| Primary CTA | 다음으로 갈게요 | Continue |

---

## S-03 — 홈

| 위치 | 한글 | 영문 |
|---|---|---|
| 인사말 | 안녕하세요 | Hello |
| 타일 1 | 증명서 발급 | Issue document |
| 타일 2 | 내 증명서 | My documents |
| 타일 3 | 발급 내역 | History |
| 타일 4 | 분쟁 내역 | Disputes |

---

## S-04 — 내 증명서

| 위치 | 한글 | 영문 |
|---|---|---|
| 앱바 | 내 증명서 | My documents |
| Segmented 좌 | 사용 가능 | Active |
| Segmented 우 | 만료됨 | Expired |
| 카드 라벨 | 발급일 / 유효기간 | Issued / Valid until |
| 만료 임박 pill | D-N | D-N |
| 빈 상태 헤드 | 발급받은 증명서가 없어요 | No documents yet |
| 빈 상태 부제 | 증명서 발급 메뉴에서 첫 서류를 받아보세요 | Issue your first document from "Issue document" |
| 빈 상태 CTA | 증명서 발급하러 가기 | Issue document |
| 만료됨 빈 상태 | 만료된 증명서가 없어요 | No expired documents |

---

## S-04.detail — 증명서 상세

| 위치 | 한글 | 영문 |
|---|---|---|
| 앱바 (서류명) | 납세증명서 (영문) | Tax Payment Cert. |
| 액션 1 | 재발급 | Reissue |
| 액션 2 | 제출 | Submit |
| 액션 3 | 분쟁 신청 | Dispute |
| 페이지 표시 | N / M | N / M |

---

## S-05 — 발급 내역

| 위치 | 한글 | 영문 |
|---|---|---|
| 앱바 | 발급 내역 | History |
| 카드 라벨 | 신청 [날짜] | Applied [date] |
| 단계 라벨 | 단계 N/M [단계명] | Step N/M [name] |
| 빈 상태 헤드 | 진행 중인 신청이 없어요 | No pending requests |
| 빈 상태 부제 | 증명서 발급에서 새로 시작하세요 | Start a new request from "Issue document" |

---

## S-05.detail — 신청 진행 상황

| 위치 | 한글 | 영문 |
|---|---|---|
| 앱바 | 신청 진행 상황 | Issuance progress |
| 단계 1 라벨 | 국세청 | NTS |
| 단계 2 라벨 | 번역·공증 | Translation |
| 단계 3 라벨 | 외교부 | MFA |
| 단계 4 라벨 | 지갑 | Wallet |
| 진행 패널 1줄 | 지금 [단계] 처리 중이에요 | Currently at [step] |
| 진행 패널 2줄 | 처리 시작 [날짜] | Started [date] |
| 진행 패널 3줄 | 예상 완료 [날짜] | Expected by [date] |
| 서명 안내 | 지금 외교부 인증을 위해 서명이 필요해요 | Your signature is needed for MFA verification |
| 서명 sticky | 서명할게요 | Sign |
| 서명 sheet 헤드 | 서명이 필요해요 | Signature required |
| 에러 패널 | [기관] 응답이 없어요. 다시 시도할 수 있어요 | [agency] is unresponsive. You can retry |
| 에러 sticky | 다시 시도할게요 | Retry |

---

## S-06 — 분쟁 내역

| 위치 | 한글 | 영문 |
|---|---|---|
| 앱바 | 분쟁 내역 | Disputes |
| 카드 라벨 | 단계 N · [단계명] | Step N · [name] |
| 카드 사유 | 사유: [라디오값] | Reason: [value] |
| 상태 pill 접수 | 접수 | Received |
| 상태 pill 검토중 | 검토중 | Reviewing |
| 상태 pill 종결 | 종결 | Closed |
| 빈 상태 | 신고한 분쟁이 없어요 | No disputes yet |

---

## S-06.new — 분쟁 신고 폼

| 위치 | 한글 | 영문 |
|---|---|---|
| 앱바 | 분쟁 신고 | File a dispute |
| 헤드라인 1 | 어느 단계에 문제가 있나요? | Which step had the problem? |
| 헤드라인 2 | 어떤 문제인가요? | What was the issue? |
| 헤드라인 3 | 어떻게 잘못됐나요? | What went wrong? |
| 사유 옵션 1 | 번역 오류 | Translation error |
| 사유 옵션 2 | 원문과 다름 | Differs from original |
| 사유 옵션 3 | 기타 | Other |
| Textarea placeholder | 자유롭게 적어주세요 | Tell us in your own words |
| 첨부 버튼 | 스크린샷 첨부 (선택) | Attach screenshot (optional) |
| Primary CTA | 분쟁 신고할게요 | File dispute |
| Secondary | 취소 | Cancel |

---

## S-06.success — 분쟁 신고 완료

| 위치 | 한글 | 영문 |
|---|---|---|
| 헤드라인 | 신고가 접수됐어요 | Dispute received |
| 부제 | 7일 안에 검토 결과를 알려드릴게요 | We'll let you know within 7 days |
| CTA | 확인했어요 | OK |

---

## S-06.detail — 분쟁 상세

| 위치 | 한글 | 영문 |
|---|---|---|
| 앱바 | 분쟁 상세 | Dispute detail |
| 사유 라벨 | 사유 [라디오값] | Reason [value] |
| 운영자 응답 헤드 | 운영자 응답 | Admin response |
| 검토 중 placeholder | 검토 중이에요 | Under review |

---

## A-01 — 서류 발급 (서류 선택)

| 위치 | 한글 | 영문 |
|---|---|---|
| 앱바 | 증명서 발급 | Issue document |
| 헤드라인 | 어떤 한국 서류를 발급받을까요? | Which Korean docs do you need? |
| 카테고리 1 | 신분·가족 | Identity & Family |
| 카테고리 2 | 세무 | Tax |
| 카테고리 3 | 사업 | Business |
| 카테고리 4 | 부동산 | Real Estate |
| 카테고리 5 | 병역 | Military |
| 카테고리 6 | 보험 | Insurance |
| 하단 CTA | 발급 신청할게요 (N) | Request (N) |

### 서류명 매핑

| 한글 | 영문 |
|---|---|
| 가족관계증명서 (영문) | Family Relations Cert. |
| 주민등록등본 | Resident Registration |
| 혼인관계증명서 | Marriage Cert. |
| 기본증명서 | Basic Cert. |
| 납세증명서 (영문) | Tax Payment Cert. |
| 소득금액증명원 | Income Cert. |
| 사업자등록증명원 | Business Reg. Cert. |
| 휴업·폐업사실증명원 | Closure Cert. |
| 부동산등기등본 | Real Estate Reg. |
| 병적증명서 | Military Service Cert. |
| 건강보험료납부확인서 | Health Insurance Payment |
| 4대보험 가입내역 | Social Insurance Status |

### 발급기관 매핑

| 코드 (mono) | 한글 | 영문 |
|---|---|---|
| `KR-NTS` | 국세청 | National Tax Service |
| `KR-MFA` | 외교부 | Ministry of Foreign Affairs |
| `KR-법원` | 법원 | Court |
| `KR-행안부` | 행정안전부 | Ministry of Interior |
| `KR-MMA` | 병무청 | Military Manpower Admin |
| `KR-NHIS` | 건강보험공단 | National Health Insurance |

---

## A-01.kyc — 본인 인증

| 위치 | 한글 | 영문 |
|---|---|---|
| 앱바 | 본인 인증 | ID verification |
| 헤드라인 | 본인 인증이 필요해요 | ID verification required |
| 부제 | 발급 기관에 본인을 확인하기 위한 절차예요 | Required to verify your identity with the agency |
| 필드 1 | 이름 | Name |
| 필드 2 | 주민등록번호 | Resident reg. number |
| 필드 2 (외국인) | 여권번호 | Passport number |
| 필드 3 | 휴대폰 번호 | Phone number |
| 필드 4 | 인증번호 | Verification code |
| 필드 5 (외국인 선택) | 외국인등록번호 | Alien reg. number |
| 발송 인라인 버튼 | 인증번호 발송 | Send code |
| 카운트다운 | MM:SS | MM:SS |
| 동의 체크박스 | 개인정보 제3자 제공에 동의해요 | I agree to share my info with the agency |
| 동의 보기 링크 | 보기 | View |
| 동의 sheet 헤드 | 개인정보 제3자 제공 동의 | Third-party data sharing |
| Primary CTA | 발급 신청할게요 | Request |

---

## A-01.success — 신청 완료 알림

| 위치 | 한글 | 영문 |
|---|---|---|
| 헤드라인 | 발급 신청을 성공했어요 | Request submitted |
| 부제 1 | 추후 추가 서명이 필요해요 | More signatures will be needed |
| 부제 2 | 알려드릴게요 | We'll notify you |
| CTA | 발급 내역으로 가기 | View history |

---

## A-03 — 발급 완료 알림

| 위치 | 한글 | 영문 |
|---|---|---|
| 헤드라인 | 모든 서명이 끝났어요 | All signatures complete |
| 부제 1 | 내 문서에서 | Your document is ready |
| 부제 2 | 확인 가능해요 | in My documents |
| CTA | 확인해보겠어요? | View document |

---

## A-04 — 요청 기관 선택

| 위치 | 한글 | 영문 |
|---|---|---|
| 앱바 | 이 문서를 요청한 기관 | Requesting agencies |
| 헤드라인 | 받은 제출 요청이에요 | Submission requests |
| 카드 사용처 라벨 | (한 줄 카피) | Used for: |
| 카드 마감 라벨 | [N월 N일]까지 제출 | Due [date] |
| 카드 요청일 라벨 | 요청 받음 [N월 N일] | Requested [date] |
| 보조 액션 | PDF로 받기 | Download PDF |
| Sheet 헤드 | 이 문서를 요청한 기관 | Requesting agency |
| Sheet primary | 보낼까요? | Send |
| Sheet secondary | 닫기 | Close |
| 빈 상태 | 받은 제출 요청이 없어요 | No submission requests |

### 기관 매핑

| 코드 | 한글 | 영문 |
|---|---|---|
| `US-CONS` | 미국 영사관 | US Consulate |
| `AU-IMM` | 호주 이민국 | AU Immigration |
| `CA-IMM` | 캐나다 이민국 | CA Immigration |

---

## A-05 — 전달 중

| 위치 | 한글 | 영문 |
|---|---|---|
| 앱바 | 전달 중 | Delivering |
| Active 헤드 | [기관]에 전달 중이에요 | Delivering to [agency] |
| Active 부제 | [코드]에 전달하고 있어요 | Sending to [code] |
| Active 부제 2 | 잠깐만요 | Hold on |
| Complete 헤드 | 전달이 완료됐어요 | Delivery complete |
| Complete 부제 | [기관]에서 확인할 거예요 | [agency] will verify |
| Empty 헤드 | 전달할 문서가 없어요 | No deliveries |
| Error 헤드 | 전달 중 문제가 생겼어요 | Delivery failed |
| Error 부제 | 다시 시도할 수 있어요 | You can retry |

---

## A-07 — 재발급 안내

| 위치 | 한글 | 영문 |
|---|---|---|
| 앱바 | 재발급 안내 | Reissue |
| 헤드라인 | [서류명]를 다시 발급할게요 | Reissuing [document] |
| 부제 | 아래 3단계를 거치면 새 문서가 도착해요 | Three steps and your new document arrives |
| 단계 1 헤드 | ① 다시 발급 신청 | ① Resubmit |
| 단계 1 본문 | 국세청 발급 신청이 자동으로 시작돼요 | Agency request starts automatically |
| 단계 2 헤드 | ② 3번의 서명 | ② Three signatures |
| 단계 2 본문 | 이전과 동일하게 서명 3번으로 발급돼요 | Same as before |
| 단계 3 헤드 | ③ 새 문서 도착 | ③ New document arrives |
| 단계 3 본문 | 유효기간이 갱신된 새 문서가 지갑에 도착해요 | Refreshed validity sent to wallet |
| 안심 메시지 | 사용자 디바이스 한정 보관, MyApo 서버 즉시 파기해요 | Stored on your device only. Server data destroyed immediately |
| Primary CTA | 다시 발급할게요 | Reissue |
| Secondary CTA | 다음에 할게요 | Maybe later |
| Empty 헤드 | 재발급할 문서가 없어요 | No documents to reissue |
| Empty 부제 | 모든 문서가 유효해요 | All documents are valid |
| Error 헤드 | 조회하는 데 문제가 생겼어요 | Lookup failed |
| Error 부제 | 다시 시도할 수 있어요 | You can retry |

---

## 영문 톤 가이드

- **명령형** ("Sign", "Reissue") 우선. "Please" 안 씀.
- **상태 표현은 명사구** ("Delivery complete", "Dispute received").
- **사용자 호칭 안 씀** — "you" 안 쓰고 직접 동작/상태로.
- **Korean 단위 그대로 유지** — D-N, KR-NTS, MM:SS 등 mono 코드.
- 16진 페어링: `display` 헤드라인은 영문도 1.3 line-height 유지 (`-0.01em` 살짝 추가 검토).
