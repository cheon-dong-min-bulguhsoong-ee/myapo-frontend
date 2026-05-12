# MyApo 프론트엔드 인수인계 명세

> 다른 프로젝트에서 MyApo 모바일 프론트의 UX, API 계약, 디자인 시스템을 재사용하기 위한 실무 명세입니다.  
> 기준 자료: `API_SPEC.md`, `design-system/`, 현재 앱 코드(`app/`, `components/`, `contexts/`, `lib/mock-data.ts`).

## 1. 문서 목적

이 문서는 `API_SPEC.md` 전체를 그대로 복사한 API 레퍼런스가 아닙니다. 현재 프론트가 어떤 화면과 데이터 모델을 기대하는지, 실제 백엔드 연동 시 어떤 API를 우선 연결해야 하는지, 그리고 어떤 API는 현재 앱에서 쓰이지 않는지 구분합니다.

현재 코드 기준 핵심 사실:

- 앱은 Next.js App Router 기반 모바일 웹앱입니다.
- 로그인은 Web3Auth SDK에서 외부 JWT를 받은 뒤 백엔드 `POST /api/v1/auth/signin`을 호출해 MyApo 자체 accessToken을 저장합니다.
- 현재 구현된 실제 `/api/v1` 호출은 로그인/로그아웃 인증 교환입니다. 문서/분쟁/제출 화면은 아직 목업 데이터를 사용합니다.
- 문서, 발급 진행, 이의 신청, 제출 기관 데이터는 `lib/mock-data.ts`의 목업을 사용합니다.
- `API_SPEC.md`에는 백엔드 전체 33개 엔드포인트가 포함되어 있으며, 현재 프론트가 모두 소비하지는 않습니다.

## 2. 기술 스택

| 항목 | 값 |
| --- | --- |
| Framework | Next.js `16.2.6` |
| React | `18.3.1` |
| Language | TypeScript |
| Package manager / runtime | Bun. 앞으로 이 앱의 설치·개발·검증 스크립트는 `npm`, `yarn`, `pnpm` 대신 `bun`만 사용합니다. |
| Styling | Tailwind CSS v4 + 전역 CSS 토큰 |
| Auth SDK | `@web3auth/modal`, `@web3auth/auth-adapter`, `@web3auth/xrpl-provider` |
| Blockchain SDK | `xrpl` |
| Icon | `lucide-react` |
| 주요 경로 alias | `@/*` |

## 3. 앱 정보 구조

| Route | 화면 역할 | 현재 데이터 소스 | 백엔드 연동 후보 |
| --- | --- | --- | --- |
| `/login` | Google/Web3Auth 로그인 | `contexts/auth-context.tsx` | `POST /api/v1/auth/signin`, `POST /api/v1/auth/logout` |
| `/persona-select` | 사용자 페르소나 선택 | local state / localStorage | 사용자 프로필 확장 API가 필요하면 별도 정의 |
| `/home` | 주요 메뉴 대시보드 | `mockDocuments`, `mockApplications`, `mockDisputes` | 문서/발급/이의 API 집계 |
| `/issue/select` | 발급할 문서 선택 | `mockIssuableDocuments` | `GET /api/v1/documents/types`, `POST /api/v1/documents` |
| `/issue/verify` | 본인 확인 입력 | local form | 현재 API_SPEC에는 별도 본인확인 API 없음 |
| `/issue/success` | 발급 신청 완료 | local route transition | `POST /api/v1/documents` 성공 후 이동 |
| `/history` | 진행 중인 발급 목록 | `mockApplications` | MVP 기준 `GET /api/v1/document-mvp`, 운영/상세 후보 `GET /api/v1/documents` 또는 `GET /api/v1/credentials/issue-requests/{id}` |
| `/history/[id]` | 발급 진행 상세 | `mockApplications` | MVP 기준 `GET /api/v1/document-mvp/{documentCode}`, 운영 상세 후보 `GET /api/v1/documents/{documentCode}` |
| `/documents` | 지갑에 도착한 문서 목록 | `mockDocuments` | `GET /api/v1/documents` 또는 `GET /api/v1/credentials` |
| `/documents/[id]` | 문서 상세, 제출, 재발급, 이의 신청 | `mockDocuments` | `GET /api/v1/documents/{documentCode}`, 파일 다운로드, 제출 API |
| `/submission-request` | 기관 제출 요청 선택 | `mockInstitutions` | `POST /api/v1/credentials/{credentialId}/submissions` |
| `/delivery` | 제출 진행 상태 | local constants | 제출 상태 조회 API가 필요하면 별도 정의 |
| `/renewal` | 문서 재발급 안내 | `mockDocuments`, `mockIssuableDocuments` | `POST /api/v1/documents` 재사용 가능 |
| `/disputes` | 이의 신청 목록 | `mockDisputes` | `GET /api/v1/disputes` |
| `/disputes/[id]` | 이의 신청 상세 | `mockDisputes` | `GET /api/v1/disputes/{id}` |
| `/disputes/new` | 이의 신청 작성 | local form | `POST /api/v1/disputes` |
| `/disputes/success` | 이의 신청 완료 | local route transition | `POST /api/v1/disputes` 성공 후 이동 |

## 4. 인증 계약

### 4.1 현재 프론트 동작

`contexts/auth-context.tsx`는 Web3Auth Modal을 초기화하고 XRPL Testnet 지갑 키를 읽습니다.

의도된 로그인 플로우는 다음 구조입니다.

1. 프론트가 Web3Auth 로그인으로 Web3Auth-issued JWT 또는 OAuth ID token을 받습니다.
2. 프론트가 그 토큰을 `ExternalJwtBearer`로 `POST /api/v1/auth/signin`에 보냅니다.
3. 백엔드는 Web3Auth 토큰을 검증하고 MyApo 자체 `accessToken`을 발급합니다.
4. 프론트는 이후 API 요청에서 MyApo `accessToken`을 `InternalJwtBearer`로 사용합니다.

현재 코드 상태는 위 1~4번을 구현합니다. `auth-context.tsx`는 `web3auth.authenticateUser()`의 `idToken` 또는 OAuth ID token을 `POST /api/v1/auth/signin`의 `ExternalJwtBearer`로 보내고, 응답의 MyApo `accessToken`을 `myapo_access_token` localStorage 키에 저장합니다.

환경 변수:

| 변수 | 설명 |
| --- | --- |
| `NEXT_PUBLIC_WEB3AUTH_CLIENT_ID` | Web3Auth client id |
| `NEXT_PUBLIC_WEB3AUTH_NETWORK` | 기본값은 코드상 `sapphire_mainnet`, Docker ARG 기본값은 `sapphire_devnet` |

XRPL 설정:

| 항목 | 값 |
| --- | --- |
| chainNamespace | XRPL |
| chainId | `0x2` |
| rpcTarget | `https://testnet-ripple-node.tor.us` |
| wsTarget | `wss://s.altnet.rippletest.net:51233` |
| blockExplorerUrl | `https://testnet.xrpl.org/` |

주의:

- 현재 데모는 `myapo_wallet` localStorage에 XRPL private key를 저장합니다.
- 운영 서비스에서는 XSS 위험 때문에 private key를 localStorage에 저장하면 안 됩니다.
- Web3Auth 로그인 후 백엔드 세션을 만들려면 Web3Auth JWT 또는 OAuth ID token을 `POST /api/v1/auth/signin`에 전달하는 별도 API client가 필요합니다.
- XRPL CredentialAccept / CredentialDelete에서 필요한 `signedTransactionBlob`은 prepare API 응답을 Web3Auth XRPL 지갑으로 서명해 얻습니다. 구현 전에 `docs/XRPL_SIGNED_TRANSACTION_BLOB.md`를 먼저 읽으세요.

### 4.2 백엔드 인증 방식

`API_SPEC.md` 기준 인증 스킴은 2개입니다.

| 이름 | 타입 | 사용처 |
| --- | --- | --- |
| `ExternalJwtBearer` | HTTP Bearer JWT | Web3Auth에서 받은 외부 JWT로 `POST /api/v1/auth/signin` 호출 |
| `InternalJwtBearer` | HTTP Bearer JWT | signin 응답의 MyApo `accessToken`으로 로그인 후 대부분의 MyApo API 호출 |

백엔드 연동 시 공통 헤더:

```http
Authorization: Bearer <accessToken>
```

공통 응답 형태:

```json
{
  "success": true,
  "code": null,
  "message": null,
  "data": {}
}
```

### 4.3 에러/응답 처리 규칙

`API_SPEC.md`는 성공 예시 중심으로 작성되어 있어 에러 코드 전체 목록은 별도 확인이 필요합니다. 프론트 API client는 아래 규칙으로 시작하세요.

| 상황 | 처리 |
| --- | --- |
| HTTP status가 2xx가 아님 | `message`가 있으면 사용자 메시지 후보로 저장하고, 없으면 기본 에러 메시지 사용 |
| `success === false` | HTTP status와 무관하게 실패로 처리 |
| `code`가 있음 | 화면별 분기 또는 로깅 키로 사용 |
| `message`가 있음 | 사용자에게 바로 노출하기 전에 UX 문구로 매핑 |
| `data`가 null/빈 객체 | 성공 응답이어도 화면에 필요한 필수 필드가 없으면 adapter에서 명시적으로 실패 처리 |

권장 UX:

- 네트워크 실패: “연결이 불안정해요. 다시 시도해 주세요.”
- 인증 만료: accessToken 제거 후 `/login`으로 이동
- 권한 없음: “이 작업을 진행할 권한이 없어요.”
- 문서/분쟁 없음: 기존 `EmptyState` 컴포넌트로 빈 상태 표시

## 5. API 연동 우선순위

현재 앱 UX를 실제 API로 살리려면 모든 33개 엔드포인트를 한 번에 연결하지 말고 아래 순서로 붙이는 것이 안전합니다.

### 5.1 1차 연동, 앱 기본 플로우

| 우선순위 | API | 목적 | 연결 화면 |
| --- | --- | --- | --- |
| P0 | `POST /api/v1/auth/signin` | Web3Auth 로그인 후 MyApo accessToken 발급 | `/login` |
| P0 | `GET /api/v1/users/me` | 로그인 사용자 프로필 확인 | 전역 auth guard, `/home` |
| P0 | `GET /api/v1/documents/types` | 발급 가능한 문서 카탈로그 | `/issue/select` |
| P0 | `GET /api/v1/document-mvp` | 모바일 history 화면용 내 문서 목록 | `/home`, `/history` |
| P0 | `GET /api/v1/document-mvp/{documentCode}` | 모바일 history/app-1 화면용 문서 상세 및 4단계 UI 상태 | `/history/[id]`, `/documents/[id]` 후보 |
| P0 | POST /api/v1/document-mvp | MVP 문서 발급 신청. 신청 즉시 1단계 서명 요청(/credentials/issue-requests) 연동 | /issue/verify -> /history/[id] |
| P0 | `POST /api/v1/document-mvp/{documentCode}/advance` | MVP 다음 단계 전이 | `/history/[id]`, 진행 상세 화면 |
| P0 | `GET /api/v1/documents` | 운영/콘솔 성격의 문서 관리 목록. `status`, `documentTypeCode`, `countryCode`, `q`, `page`, `limit` query 지원 | 관리자/운영자 화면 후보, 사용자 앱에서는 MVP API 우선 |
| P0 | `GET /api/v1/documents/{documentCode}` | 운영 상세 및 5단계 진행 상태 | 관리자/운영자 화면 후보 |

### 5.2 2차 연동, 진행/파일/승인

| 우선순위 | API | 목적 | 연결 화면 |
| --- | --- | --- | --- |
| P1 | `POST /api/v1/documents/{documentCode}/stages/advance` | 운영 Document의 단계 승인 + 전이. `documentCode`는 path, 승인 정보는 body로 전달 | 진행 상세 화면 또는 운영자 도구 |
| P1 | `GET /api/v1/documents/{documentCode}/files/{stage}` | PDF 다운로드 | `/documents/[id]` |
| P1 | `POST /api/v1/documents/files/upload` | 일반 첨부 파일 업로드 | 운영자/백오피스 프로젝트 후보 |
| P1 | `POST /api/v1/documents/files/upload-encrypted` | 암호화 PDF 업로드 | 운영자/백오피스 프로젝트 후보 |

### 5.3 3차 연동, 자격증명/제출/분쟁

| 우선순위 | API | 목적 | 연결 화면 |
| --- | --- | --- | --- |
| P2 | `GET /api/v1/credentials` | 사용자 크리덴셜 목록 | `/documents` 대체 후보 |
| P2 | `GET /api/v1/credentials/issue-pipeline-stages/{currentStage}` | 특정 credential issue pipeline stage 기준 크리덴셜 목록 | 단계별 운영/디버그 화면 후보 |
| P2 | `GET /api/v1/credentials/{credentialId}` | 크리덴셜 상세 | `/documents/[id]` 대체 후보 |
| P2 | `POST /api/v1/credentials/{credentialId}/submissions` | 기관 제출 | `/submission-request`, `/delivery` |
| P2 | `GET /api/v1/credentials/{credentialId}/submissions` | 제출 이력 | 제출 내역 화면이 생길 경우 |
| P2 | `POST /api/v1/disputes` | 이의 신청 생성 | `/disputes/new` |
| P2 | `GET /api/v1/disputes` | 이의 신청 목록 | `/disputes` |
| P2 | `GET /api/v1/disputes/{id}` | 이의 신청 상세 | `/disputes/[id]` |

### 5.4 현재 앱에서 직접 쓰지 않는 백엔드/API 후보

다음 API는 `API_SPEC.md`에는 있지만 현재 프론트 화면과 코드 기준 직접 사용처가 없습니다. 다른 프로젝트가 관리자 콘솔, 운영자 도구, XRPL 고급 기능까지 만들 경우에만 연결하세요.

| API | 현재 판단 |
| --- | --- |
| `DELETE /api/v1/users/me` | 회원 탈퇴 화면 없음 |
| `PATCH /api/v1/users/{id}/role` | Admin 전용, 모바일 사용자 앱 범위 밖 |
| `POST /api/v1/auth/logout` | 현재 Web3Auth SDK logout만 호출 |
| `POST /api/v1/credentials/issue-requests` | 현재 문서 API 중심 UX와 중복 가능 |
| `GET /api/v1/credentials/issue-requests/{issueRequestId}` | 현재 진행 상세는 MVP 문서 API 우선 |
| `GET /api/v1/credentials/issue-pipeline-stages/{currentStage}` | 모바일 사용자 앱 직접 화면 없음. 단계별 운영/디버그 화면 후보 |
| `POST /api/v1/credentials/{credentialId}/xrpl/accept/prepare` | XRPL accept 수동 서명 UI 없음 |
| `POST /api/v1/credentials/{credentialId}/xrpl/accept` | XRPL accept 제출 UI 없음 |
| `POST /api/v1/credentials/{credentialId}/xrpl/delete/prepare` | XRPL delete 수동 서명 UI 없음 |
| `POST /api/v1/credentials/{credentialId}/xrpl/delete` | XRPL delete 제출 UI 없음 |
| `PATCH /api/v1/disputes/{id}/assign` | Admin/Operator 전용 |
| `PATCH /api/v1/disputes/{id}/status` | Operator 전용 |

## 6. 프론트 데이터 모델

현재 목업 모델은 백엔드 응답과 1:1이 아닙니다. 실제 API 연동 시 어댑터 레이어를 두는 것이 좋습니다.

### 6.1 현재 `Document`

```ts
interface Document {
  id: string
  type: string
  issuedAt: string
  expiresAt: string
  status: 'available' | 'expired'
  credentialId: string
  isExpiringSoon?: boolean
}
```

백엔드 후보 매핑:

| 프론트 필드 | 백엔드 후보 |
| --- | --- |
| `id` | `documentCode` 또는 `credentialId` |
| `type` | `documentTypeName` |
| `issuedAt` | `issuedAt` |
| `expiresAt` | Credentials API의 `expiresAt` |
| `status: available` | `DocumentStatus.VALID` 또는 `CredentialStatus.ISSUED` |
| `status: expired` | `DocumentStatus.EXPIRED/REVOKED` 또는 `CredentialStatus.EXPIRED/REVOKED` |
| `credentialId` | `credentialId`, `xrplTxHash`, 또는 별도 표시용 ID |

주의: `GET /api/v1/documents`의 `DocumentListItemRes`에는 `expiresAt`과 `credentialId`가 없습니다. 만료일/credential id가 필요한 화면은 `GET /api/v1/credentials` 또는 상세 API를 함께 조합하는 adapter가 필요합니다.

### 6.2 현재 `Application`

```ts
interface Application {
  id: string
  documentType: string
  stage: number
  totalStages: number
  stageName: string
  stages: { label: string; status: 'done' | 'active' | 'wait' | 'error' }[]
  createdAt: string
}
```

모바일 MVP 연동은 `DocumentMvpDetailRes.uiSteps[]`와 `DocumentMvpDetailRes.stages[]`를 우선 사용하세요. 운영 Document API를 붙일 때는 `DocumentDetailRes.stages[]`를 UI 단계로 변환하세요.

| MVP 백엔드 stage | UI label 추천 |
| --- | --- |
| `USER_DOC_REQUESTED` | 신청 완료 |
| `AUTHORITY_DOC_ISSUED` | 기관 발급 |
| `TRANSLATOR_DOC_RECEIVED` | 번역 접수 |
| `TRANSLATOR_DOC_NOTARIZED` | 번역·공증 |
| `APOSTILLE_DOC_ISSUED` | 아포스티유 |

운영 Document API의 기존 5단계 stage(`AUTHORITY_ISSUED`, `DOCUMENT_ARRIVED`, `TRANSLATED_NOTARIZED`, `APOSTILLE_ISSUED`, `WALLET_STORED`)는 관리자/운영자 화면을 붙일 때 사용하세요.

| 백엔드 status | UI status |
| --- | --- |
| `DONE` | `done` |
| `PENDING` 또는 현재 stage | `active` |
| null 또는 미시작 | `wait` |
| `FAILED` | `error` |

### 6.3 현재 `Dispute`

```ts
interface Dispute {
  id: string
  documentType: string
  stage: string
  targetStage?: string
  reason: string
  status: 'received' | 'reviewing' | 'closed'
  createdAt: string
  operatorResponse?: string
}
```

백엔드 매핑:

| 백엔드 status | UI status |
| --- | --- |
| `RECEIVED` | `received` |
| `ASSIGNED`, `IN_REVIEW`, `INFO_REQUESTED` | `reviewing` |
| `RESOLVED`, `REJECTED` | `closed` |

주의: 현재 Swagger에는 `GET /api/v1/disputes` 목록 API가 있습니다. 기존 목업 `Dispute` UI 상태는 `DisputeSummaryRes.status`를 `received/reviewing/closed`로 변환해 사용하세요. 최신 응답에는 이의 대상 파이프라인 단계 `targetStage`가 포함되므로, 단계별 분쟁 화면을 붙일 때 `MYDATA_RECEIVED`, `DOCUMENT_MOVED`, `TRANSLATION_RECEIVED`, `APOSTILLE_RECEIVED` 값을 표시용 라벨로 매핑하세요.

### 6.4 현재 발급 가능 문서 카탈로그

`mockIssuableDocuments`는 화면용 문서 카탈로그입니다.

```ts
interface IssuableDocument {
  id: string
  name: string
  englishName?: string
  use: string
  issuerCode: IssuerCode
  issuerIcon: string
}
```

현재 항목:

| id | 문서명 | issuerCode | 사용 목적 |
| --- | --- | --- | --- |
| `fam` | 가족관계증명서 (영문) | `KR-법원` | 미국 이민국 결혼 증빙 |
| `res` | 주민등록등본 (영문) | `KR-MOIS` | 거주증명 · 비자 보조 |
| `tax` | 납세증명서 (영문) | `KR-NTS` | 미국 영사관 비자 재정증명 |
| `income` | 소득금액증명원 (영문) | `KR-NTS` | 비자 · 이민 |
| `biz` | 사업자등록증명원 | `KR-NTS` | 해외 법인 설립 |
| `land` | 부동산등기부등본 | `KR-법원` | 자산증명 |
| `mil` | 병적증명서 | `KR-병무청` | 비자 · 이민 보조 |
| `drv` | 운전경력증명서 | `KR-경찰청` | 해외 면허 변환 |
| `edu` | 학력증명서 (영문) | `KR-학교` | 해외 취업 · 유학 |
| `health` | 건강보험료납부확인서 (영문) | `KR-건보` | 해외 비자 · 건강보험 증빙 |

현재 Swagger에는 `GET /api/v1/documents/types` 카탈로그 API가 있습니다. `personaType=KOREAN|FOREIGNER` query로 발급 가능 문서 목록을 가져와 `mockIssuableDocuments`를 대체하세요.

## 7. 디자인 시스템 적용 명세

### 7.1 원본 디자인 시스템

`design-system/README.md` 기준 시각 언어:

- Toss Blue `#3182F6`
- Pretendard × Work Sans
- 60·30·10 규칙, white 60 / ink 30 / blue 10
- 큰 타이포와 타이트한 letter-spacing
- pill chip/button
- 카드 반경 20px가 원본 디자인 시스템의 시그니처
- semantic color는 상태 표현 전용

원본 로드 순서:

```html
<link rel="stylesheet" href="tokens.css" />
<link rel="stylesheet" href="typography.css" />
<link rel="stylesheet" href="components.css" />
<link rel="stylesheet" href="colors_and_type.css" />
```

### 7.2 현재 모바일 앱에서 실제 쓰는 변형

현재 앱의 `app/globals.css`는 `design-system/tokens.css`를 import하지만 모바일 화면에 맞게 컴포넌트를 다시 정의합니다.

핵심 차이:

| 항목 | 원본 design-system | 현재 모바일 앱 |
| --- | --- | --- |
| 카드 radius | 20px | 12px |
| 카드 padding | 40px 중심 | 16px 중심 |
| 버튼 shape | pill `999px` | 12px rounded rectangle |
| 앱 폭 | 웹 1280px / 슬라이드 1920px | 모바일 frame max-width 430px |
| 폰트 | Pretendard + Work Sans | Pretendard + Work Sans + JetBrains Mono |
| 배경 | white/bg-soft 중심 | 외부 `#EAECEF`, 내부 `#F9FAFB` |

다른 프로젝트가 모바일 앱을 재현하려면 `app/globals.css` 쪽 규칙을 우선 사용하세요. 피치덱, 랜딩 페이지, 디자인 카탈로그를 만들려면 `design-system/*.css` 원본 규칙을 사용하세요.

### 7.3 컬러 토큰

| Token | 값 | 용도 |
| --- | --- | --- |
| `--blue` / primary | `#3182F6` | 주요 CTA, 선택 상태, Testnet 강조 |
| `--blue-deep` | `#1B64DA` | primary hover/press |
| `--blue-soft` / primary-soft | `#E8F3FF` 또는 앱 `#E8F2FE` | 부드러운 선택 배경 |
| `--ink` | `#191F28` | 1차 텍스트 |
| `--ink-2` | `#4E5968` | 2차 텍스트 |
| `--ink-3` / muted | `#6B7684` 또는 앱 `#8B95A1` | 보조/메타 텍스트 |
| `--line` | `#E5E8EB` | border/divider |
| `--bg-soft` / base | `#F9FAFB` | 앱 내부 배경, soft card fill |
| success | 앱 `#00C48C`, 원본 `#25A768` | 완료/성공 |
| warning | 앱 `#FFB020`, 원본 `#F1A31F` | 경고/만료 예정 |
| danger | `#F04452` | 위험/이의 신청/실패 |
| info | 앱 `#18BFFF` | 정보성 badge |

### 7.4 모바일 레이아웃 규칙

| 클래스 | 역할 |
| --- | --- |
| `.app-body` | 전체 viewport를 가운데 정렬 |
| `.app-frame` | `max-width: 430px`, `height: 100dvh`, 모바일 앱 프레임 |
| `.app-scroll` | 내부 스크롤 영역 |
| `.app-content` | 화면 본문 padding `12px 20px 8px` |
| `.app-bar` | 상단 앱바, 흰 배경, 하단 border |
| `.mobile-cta`, `.page-footer` | 하단 CTA 영역, safe-area 반영 |
| `.mobile-nav` | 하단 네비게이션 |

### 7.5 핵심 UI 컴포넌트

현재 앱 컴포넌트 경로는 `components/ui/`입니다.

| Component | 용도 | 관련 CSS |
| --- | --- | --- |
| `AppBar` | 상단 제목/뒤로가기/배지 | `.app-bar`, `.app-bar-title`, `.app-bar-back` |
| `BottomHomeBar` | 하단 홈 네비게이션 | `.mobile-nav` |
| `Button` | 공통 버튼 래퍼 | `.btn-primary`, `.btn-secondary`, `.btn-danger`, `.btn-ghost`, `.btn-inverted` |
| `Pill` | 상태 배지 | `.vpill`, `.badge-*` |
| `Card` | 카드 surface | `.card` |
| `DocCard` | 문서 선택 카드 | `.doc-card`, `.doc-card.selected` |
| `SelectableCard` | 선택형 카드 | `.selectable-card`, `.selectable-card.selected` |
| `SegmentedControl` | 탭/세그먼트 | `.tab-bar`, `.tab-btn` |
| `StepTimeline` | 단계 진행 | `.step-dot-*`, `.step-line-*` |
| `ProgressFill` | 진행률 | `.progress-track`, `.progress-fill` |
| `TextField` | 입력 | `.text-input` |
| `TextArea` | 긴 입력 | `.text-area` |
| `Callout` | 안내 박스 | 카드 + semantic color |
| `EmptyState` | 빈 상태 | 앱 카드/CTA 스타일 |
| `Spinner`, `Skeleton` | loading state | `.skeleton`, `pulseDot`, `shimmer` |

### 7.6 Badge variant 의미

| Variant | 색 | 의미 |
| --- | --- | --- |
| `testnet` | info | XRPL Testnet 상태 |
| `mock` | warning | 목업/임시 데이터 |
| `precheck` | primary | 사전 확인 전용 플로우 |
| `revoked` | danger | 폐기/만료/사용 불가 |
| `success` | success | 완료 |
| `warning` | warning | 주의, 만료 예정 |
| `danger` | danger | 실패, 이의 신청 |
| `info` | info | 정보 |
| `neutral` | gray | 일반 상태 |

## 8. 구현 체크리스트

다른 프로젝트에서 이 명세를 가져갈 때 권장 순서입니다.

1. `design-system/tokens.css`와 `app/globals.css`의 모바일 토큰을 먼저 이식합니다.
2. `components/ui/` 컴포넌트를 옮기고 `@/*` alias 또는 import 경로를 맞춥니다.
3. `contexts/auth-context.tsx`를 옮기되, private key localStorage 저장은 운영용으로 교체합니다.
4. `lib/mock-data.ts` 타입을 기준으로 API adapter 타입을 만듭니다.
5. API client를 새로 만들고 `API_SPEC.md`의 공통 응답 `{ success, code, message, data }`를 unwrap합니다.
6. P0 API부터 붙입니다: signin, users/me, documents/types, document-mvp list/detail/create/advance.
7. 목업 화면이 기대하는 상태값으로 백엔드 enum을 변환하는 mapper를 둡니다.
8. 분쟁 목록과 문서 카탈로그는 각각 `GET /api/v1/disputes`, `GET /api/v1/documents/types`로 대체하고, 제출 요청 목록/상태 API는 백엔드 추가 필요 여부를 먼저 확인합니다.

## 9. 권장 API client 형태

```ts
type CommonRes<T> = {
  success: boolean
  code: string | null
  message: string | null
  data: T
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const isFormData = init?.body instanceof FormData
  const res = await fetch(`${process.env.NEXT_PUBLIC_MYAPO_API_BASE_URL}${path}`, {
    ...init,
    headers: {
      ...(isFormData ? {} : { 'Content-Type': 'application/json' }),
      ...init?.headers,
    },
  })

  const body = (await res.json()) as CommonRes<T>
  if (!res.ok || !body.success) {
    throw new Error(body.message ?? `MyApo API error: ${res.status}`)
  }
  return body.data
}
```

파일 업로드 API(`multipart/form-data`)는 브라우저가 boundary를 자동 설정해야 하므로 `Content-Type`을 직접 넣지 마세요.

필요 환경 변수:

```env
NEXT_PUBLIC_MYAPO_API_BASE_URL=https://api.myapo.xyz
NEXT_PUBLIC_WEB3AUTH_CLIENT_ID=...
NEXT_PUBLIC_WEB3AUTH_NETWORK=sapphire_devnet
```

## 10. 백엔드에 확인할 빈칸

현재 프론트와 `API_SPEC.md` 사이에 남아 있는 공백입니다.

- 문서 카탈로그 목록은 `GET /api/v1/documents/types`로 확인됐습니다. 현재 발급 가능 문서는 아직 목업 배열입니다.
- 분쟁 목록 조회는 `GET /api/v1/disputes`로 확인됐습니다. 현재 `/disputes` 화면은 아직 목업 배열입니다.
- 제출 요청 목록 API가 필요합니다. 현재 `/submission-request`는 `mockInstitutions`만 사용하며, 최신 Swagger에도 기관 제출 요청 목록 API는 없습니다.
- 사용자 앱의 “내 문서/발급 진행” source of truth는 최신 Swagger 기준 `Document MVP` API가 가장 직접적입니다. 운영/콘솔 화면은 `Document` API, 자격증명 지갑 화면은 `Credential` API를 조합하세요.
- Web3Auth JWT는 `ExternalJwtBearer`로 전달하는 설계로 보입니다. 구현 시 `Authorization: Bearer <web3authToken>` 헤더로 보내는지 백엔드와 최종 확인하세요.
- `POST /api/v1/auth/signin` 요청 body에는 `name`, `nationality`, `xrplAddress`, `publicKey`만 있습니다. 토큰은 body가 아니라 `ExternalJwtBearer` 헤더로 전달하는 전제입니다.
- 운영용 키 보관 정책이 필요합니다. 현재 localStorage private key 저장은 데모 전용입니다.

## 11. 소스 파일 빠른 참조

| 파일 | 용도 |
| --- | --- |
| `API_SPEC.md` | 백엔드 전체 OpenAPI 정리본 |
| `docs/XRPL_SIGNED_TRANSACTION_BLOB.md` | XRPL `signedTransactionBlob` 생성, 제출, 검증 절차 |
| `lib/myapo-api.ts` | MyApo API base URL, 공통 request wrapper, signin/logout, accessToken storage |
| `design-system/README.md` | 디자인 철학, 색/타입/레이아웃 규칙 |
| `design-system/tokens.css` | 원본 토큰 |
| `design-system/typography.css` | 원본 타이포그래피 |
| `design-system/components.css` | 원본 컴포넌트 스타일 |
| `app/globals.css` | 실제 모바일 앱 스타일, Tailwind theme bridge |
| `contexts/auth-context.tsx` | Web3Auth/XRPL 로그인 컨텍스트 |
| `lib/mock-data.ts` | 현재 화면 데이터 모델과 목업 데이터 |
| `components/ui/*` | 실제 재사용 UI 컴포넌트 |
| `app/**/page.tsx` | 화면별 UX 흐름 |
