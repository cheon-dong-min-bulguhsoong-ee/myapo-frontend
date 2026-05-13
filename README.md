# MyApo Frontend

`MyApo Frontend`는 재한 외국인과 재외 한국인이 해외 금융·행정 절차에 필요한 공문서와 아포스티유를 신청, 확인, 제출, 추적할 수 있도록 만든 디지털 아포스티유 웹 프론트엔드 레포지토리입니다.

> 🚀 KFIP 2026 카테고리 기준으로 `MyApo`는 **디지털 신원**, **기타 금융/인프라**에 해당합니다.

## Intro

`MyApo`는 발급 주체, 문서 단계, 검증 기록을 표준화해 해외 문서 제출 병목을 줄이는 compliance-first 디지털 아포스티유 플랫폼입니다.

현재 레포는 `app/` 아래 단일 Next.js 모바일 웹앱을 중심으로 구성되어 있습니다. 다만 서비스 영역은 사용자 앱, 기관 제출 화면, 운영자 콘솔, 관리자 콘솔, 디자인 시스템, 데모/피치 웹페이지까지 확장될 수 있도록 문서와 구조를 분리해 둡니다.

## Background & Problem

재한 외국인이 본국 금융기관, 학교, 행정기관에 한국 발급 서류를 제출하거나 재외 한국인이 해외 발급 서류를 한국 기관에 제출하려면 정부 발급, 번역공증, 아포스티유, 국제 송부를 직접 처리해야 합니다.

- 현재 이 과정은 평균 약 8주가 걸리고 종합 비용이 30만 원 이상 발생합니다.
- 문서 위조가 적발돼도 발급, 번역공증, 아포스티유, 송부 중 어느 단계에서 문제가 들어왔는지 입증하기 어렵습니다.
- 사용자는 진행 상태를 보기 어렵고, 기관은 제출된 문서의 발급 주체와 단계별 검증 기록을 일관된 방식으로 확인하기 어렵습니다.

## Solution

MyApo Frontend는 복잡한 해외 문서 제출 절차를 사용자가 이해할 수 있는 하나의 디지털 플로우로 보여줍니다.

- 사용자는 Web3Auth 기반 로그인 후 문서 발급 신청, 진행 현황 확인, 문서 상세 확인, 기관 제출, 재발급, 이의 신청을 수행합니다.
- 정부 발급 주체, 번역공증사, 아포스티유 처리 기관, 최종 수령자는 백엔드 API와 XRPL 검증 기록을 통해 각자의 역할을 수행합니다.
- 원본 문서와 개인정보는 온체인이 아니라 오프체인 저장소와 백엔드에서 다루고, 프론트엔드는 XRPL Credential 흐름에 필요한 사용자 승인과 서명 경험을 제공합니다.

## Result

- 외국인과 재외 국민이 해외 금융 계좌 개설, 송금, 유학, 취업, 가족관계 증빙 등 cross-border 금융·행정 절차를 더 빠르게 진행할 수 있습니다.
- 사용자는 문서 발급부터 제출까지의 상태를 모바일 화면에서 추적할 수 있습니다.
- 기관과 운영자는 XLS-70 Credentials, XLS-80 Permissioned Domains, 단계별 검증 기록을 활용하는 규제 친화적 금융 인프라 UX를 확장할 수 있습니다.

## Demo & API

- ⭐️ Our demo: https://app.myapo.xyz
- Check API in Swagger: https://api.myapo.xyz/docs
- OpenAPI JSON: https://api.myapo.xyz/docs-json
- Local frontend: http://localhost:3000

## Frontend Scope

| Area | Status | Purpose |
| --- | --- | --- |
| User mobile web | 구현됨 | 로그인, 페르소나 선택, 문서 신청, 진행 현황, 제출, 이의 신청 |
| Institution submission web | 구현 후보 | 수령 기관이 제출 요청과 제출 이력을 확인하는 화면 |
| Operator console | 구현 후보 | 문서 단계 승인, 파일 업로드, 번역공증·아포스티유 처리 상태 관리 |
| Admin console | 구현 후보 | 사용자 권한, 기관 계정, 분쟁 배정, 운영 지표 관리 |
| Public landing/demo | 구현 후보 | 서비스 소개, 데모, KFIP 발표용 페이지 |
| Design system | 문서/에셋 보유 | Toss-inspired 시각 언어, UI kit, slide deck, typography, tokens |

## Repository Structure

```txt
myapo-frontend/
├── README.md                       # 레포 전체 안내 문서
├── .github/workflows/deploy.yml    # main push 기반 Docker 배포
└── app/
    ├── app/                        # Next.js App Router routes
    ├── components/ui/              # 공통 UI 컴포넌트
    ├── contexts/                   # auth/persona context
    ├── lib/                        # MyApo API client, XRPL signing, mock data
    ├── docs/                       # 인수인계, UI 일관성, XRPL 서명 명세
    ├── design-system/              # 디자인 토큰, UI kit, slide deck, fonts
    ├── public/                     # 정적 에셋
    ├── Dockerfile
    ├── API_SPEC.md                 # 백엔드 Swagger 기반 API 명세 스냅샷
    ├── README.md                   # 앱 상세 실행·구현 문서
    └── package.json
```

## Current App Routes

| Route | 화면 역할 | 현재 데이터 소스 | 백엔드 연동 후보 |
| --- | --- | --- | --- |
| `/login` | Google/Web3Auth 로그인 | Web3Auth + MyApo auth client | `POST /api/v1/auth/signin`, `POST /api/v1/auth/logout` |
| `/persona-select` | 사용자 페르소나 선택 | local state / localStorage | 사용자 프로필 확장 API |
| `/home` | 주요 메뉴 대시보드 | mock + API 일부 | 문서/발급/이의 API 집계 |
| `/issue/select` | 발급할 문서 선택 | API + fallback | `GET /api/v1/documents/types` |
| `/issue/verify` | 본인 확인 입력 | local form | 본인확인 API 후보 |
| `/issue/success` | 발급 신청 완료 | route transition | `POST /api/v1/document-mvp` |
| `/issue-complete` | 발급 완료 안내 | route transition | 발급 완료 후 후속 UX 후보 |
| `/history` | 진행 중인 발급 목록 | API + mock fallback | `GET /api/v1/document-mvp` |
| `/history/[id]` | 발급 진행 상세 | API + mock fallback | `GET /api/v1/document-mvp/{documentCode}` |
| `/documents` | 지갑에 도착한 문서 목록 | mock 중심 | `GET /api/v1/credentials`, `GET /api/v1/documents` |
| `/documents/[id]` | 문서 상세, 제출, 재발급, 이의 신청 | mock 중심 | 문서 상세, 파일 다운로드, 제출 API |
| `/submission-request` | 기관 제출 요청 선택 | mock 중심 | `POST /api/v1/credentials/{credentialId}/submissions` |
| `/delivery` | 제출 진행 상태 | local constants | 제출 상태 조회 API 후보 |
| `/renewal` | 문서 재발급 안내 | mock 중심 | `POST /api/v1/documents` |
| `/disputes` | 이의 신청 목록 | mock 중심 | `GET /api/v1/disputes` |
| `/disputes/[id]` | 이의 신청 상세 | mock 중심 | `GET /api/v1/disputes/{id}` |
| `/disputes/new` | 이의 신청 작성 | local form | `POST /api/v1/disputes` |
| `/disputes/success` | 이의 신청 완료 | route transition | `POST /api/v1/disputes` 성공 후 이동 |

## Tech Stack

| Type | Tech | Version |
| --- | --- | --- |
| Language | TypeScript | `^5` |
| Web Framework | Next.js App Router | `16.2.6` |
| UI Library | React / React DOM | `18.3.1` |
| Runtime / Package Manager | Bun | `bun.lock` 기준 |
| Styling | Tailwind CSS | `^4` |
| Auth | Web3Auth Modal/Auth/XRPL Provider | `^9.7.0` |
| Blockchain | xrpl.js | `^4.6.0` |
| Icons | lucide-react | `^1.14.0` |
| Lint | ESLint / eslint-config-next | `^9` / `16.2.6` |
| Deploy | Docker + GitHub Actions self-hosted runner | - |

## XRPL Native Tech Stack

| Standards | Name | Frontend Status |
| --- | --- | --- |
| XLS-70 | Credentials | CredentialAccept / CredentialDelete 서명 플로우 연동 준비 |
| XLS-80 | Permissioned Domains | 구현 예정 |
| XLS-85 | Token Escrow | 구현 예정 |
| - | RLUSD | 검토중 |

## How to Start

> ⚠️ 이 프로젝트는 로컬 개발과 스크립트 실행에 **Bun만 사용합니다.** `npm`, `yarn`, `pnpm`을 섞어 쓰지 않습니다.

### Install & Build

```bash
cd app
bun install
bun run build
```

### Run

```bash
cd app

# dev
bun dev

# production
bun run start
```

### Check

```bash
cd app
bun run lint
bun run build
```

## Environment Variables

> ⚠️ 실행 전에 `.env` 파일이 필요합니다. `NEXT_PUBLIC_*` 값은 브라우저 번들에 포함되므로 민감한 서버 전용 secret을 넣지 마세요.

```env
NEXT_PUBLIC_WEB3AUTH_CLIENT_ID=""
NEXT_PUBLIC_WEB3AUTH_NETWORK="sapphire_devnet"
NEXT_PUBLIC_MYAPO_API_BASE_URL="https://api.myapo.xyz"
```

| Variable | Required | Description |
| --- | --- | --- |
| `NEXT_PUBLIC_WEB3AUTH_CLIENT_ID` | Yes | Web3Auth project client id |
| `NEXT_PUBLIC_WEB3AUTH_NETWORK` | No | Web3Auth network. Docker 기본값은 `sapphire_devnet` |
| `NEXT_PUBLIC_MYAPO_API_BASE_URL` | No | MyApo backend base URL. 기본값은 `https://api.myapo.xyz` |

## Docker

아래 명령은 레포 루트(`myapo-frontend/`) 기준입니다.

`NEXT_PUBLIC_*` 값은 `next build` 시점에 브라우저 번들로 inlining됩니다. 따라서 Docker 이미지를 만들 때 build arg로 전달해야 합니다.

```bash
docker build \
  --build-arg NEXT_PUBLIC_WEB3AUTH_CLIENT_ID="$NEXT_PUBLIC_WEB3AUTH_CLIENT_ID" \
  --build-arg NEXT_PUBLIC_WEB3AUTH_NETWORK="${NEXT_PUBLIC_WEB3AUTH_NETWORK:-sapphire_devnet}" \
  --build-arg NEXT_PUBLIC_MYAPO_API_BASE_URL="${NEXT_PUBLIC_MYAPO_API_BASE_URL:-https://api.myapo.xyz}" \
  -t myapo-frontend ./app

docker run --rm -p 10000:10000 myapo-frontend
```

## GitHub Actions Deployment

`main` 브랜치에 push하거나 `workflow_dispatch`로 실행하면 self-hosted runner에서 Docker 이미지를 빌드하고 `myapo-frontend` 컨테이너를 재시작합니다.

Server requirements:

- GitHub Actions self-hosted runner registered for this repository
- Docker installed
- Runner user can run `docker` without an interactive password
- Inbound port `10000` is open
- Repository secret `NEXT_PUBLIC_WEB3AUTH_CLIENT_ID` is set
- Optional repository variables: `NEXT_PUBLIC_WEB3AUTH_NETWORK`, `NEXT_PUBLIC_MYAPO_API_BASE_URL`

## Design System

`app/design-system/`은 MyApo 프론트엔드와 발표 자료에서 공통으로 쓰는 Toss-inspired 시각 언어입니다.

- Korean-first UI copy
- Toss Blue `#3182F6`
- Pretendard + Work Sans typography
- 20px radius card, pill button/chip
- 60·30·10 color rule
- slide deck / web page UI kit
- app / console / institution wireframes in [`app/design-system/wireframes/`](./app/design-system/wireframes/Readme.md)

자세한 내용은 [`app/design-system/README.md`](./app/design-system/README.md)를 확인하세요.

## Documentation Map

| Path | Purpose |
| --- | --- |
| [`app/README.md`](./app/README.md) | 앱 상세 소개, 라우트, 실행, 배포, 통합 메모 |
| [`app/API_SPEC.md`](./app/API_SPEC.md) | 백엔드 Swagger 기반 API 명세 스냅샷 |
| [`app/docs/HANDOFF_SPEC.md`](./app/docs/HANDOFF_SPEC.md) | UX, API 계약, 디자인 시스템 재사용을 위한 인수인계 명세 |
| [`app/docs/UI_CONSISTENCY_HARNESS.md`](./app/docs/UI_CONSISTENCY_HARNESS.md) | UI 일관성 점검 기준과 화면 품질 체크리스트 |
| [`app/docs/XRPL_SIGNED_TRANSACTION_BLOB.md`](./app/docs/XRPL_SIGNED_TRANSACTION_BLOB.md) | XRPL `signedTransactionBlob` 처리 명세 |
| [`app/design-system/README.md`](./app/design-system/README.md) | 디자인 토큰, 타이포그래피, 컴포넌트, 피치덱 UI kit 안내 |
| [`app/design-system/wireframes/Readme.md`](./app/design-system/wireframes/Readme.md) | 앱, 콘솔, 기관 화면 HTML 와이어프레임 링크 모음 |

## Integration Notes

- 프론트 로그인은 Web3Auth에서 외부 JWT를 받은 뒤 `POST /api/v1/auth/signin`으로 MyApo accessToken을 발급받습니다.
- 로그인 후 API 요청은 `Authorization: Bearer <accessToken>` 형태의 Internal JWT를 사용합니다.
- 현재 문서/분쟁/제출 화면 일부는 `app/lib/mock-data.ts` fallback을 사용합니다.
- API 연동 우선순위와 화면별 계약은 [`app/docs/HANDOFF_SPEC.md`](./app/docs/HANDOFF_SPEC.md)를 확인하세요.
- XRPL `signedTransactionBlob` 처리 전에는 [`app/docs/XRPL_SIGNED_TRANSACTION_BLOB.md`](./app/docs/XRPL_SIGNED_TRANSACTION_BLOB.md)를 먼저 확인하세요.
