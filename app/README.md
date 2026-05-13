# MyApo Frontend

`MyApo Frontend`는 재한 외국인과 재외 한국인이 해외 금융·행정 절차에 필요한 공문서와 아포스티유를 신청, 확인, 제출, 추적할 수 있도록 만든 디지털 아포스티유 웹 프론트엔드입니다.

`MyApo Frontend` is the web frontend for a digital apostille platform that helps foreign residents in Korea and overseas Koreans request, verify, submit, and track official documents required for cross-border financial and administrative processes.

> 🚀 KFIP 2026 카테고리 기준으로 `MyApo`는 **디지털 신원**, **기타 금융/인프라**에 해당합니다.

> 🚀 Under the KFIP 2026 categories, `MyApo` fits **Digital Identity** and **Other Financial / Infrastructure**.

## Intro

`MyApo`는 발급 주체, 문서 단계, 검증 기록을 표준화해 해외 문서 제출 병목을 줄이는 compliance-first 디지털 아포스티유 플랫폼입니다.

`MyApo` is a compliance-first digital apostille platform that standardizes document issuers, document stages, and verification records to remove friction from overseas document submission.

프론트엔드는 사용자가 보는 모바일 웹앱을 중심으로 시작하지만, 전체 레포 문서는 향후 사용자 앱, 기관 제출 화면, 운영자 콘솔, 관리자 콘솔, 디자인 시스템, 데모/피치 웹페이지까지 포괄할 수 있도록 구성합니다.

The frontend currently starts with the user-facing mobile web app, but this repository README is structured to cover the broader frontend surface as the product expands: user app, institution submission web, operator console, admin console, design system, and demo/pitch pages.

## English Overview

MyApo turns a slow, paper-heavy apostille workflow into a digital flow where every participant can understand who issued a document, which stage it passed, and what verification evidence exists.

- **Problem:** Cross-border document submission often requires government issuance, translation notarization, apostille processing, and international delivery. The process can take about 8 weeks and cost more than KRW 300,000.
- **Solution:** MyApo connects the user, issuer, translator/notary, apostille processor, and receiving institution through one frontend experience backed by the MyApo API and XRPL verification records.
- **Privacy model:** Original documents and personal data are kept off-chain. XRPL is used for issuer identity, authority, staged verification records, and dispute traceability.
- **Frontend role:** This app provides login, document request, progress tracking, document detail, institution submission, renewal, dispute creation, and XRPL signing UX.

## Background & Problem

재한 외국인이 본국 금융기관, 학교, 행정기관에 한국 발급 서류를 제출하거나 재외 한국인이 해외 발급 서류를 한국 기관에 제출하려면 정부 발급, 번역공증, 아포스티유, 국제 송부를 직접 처리해야 합니다.

- 현재 이 과정은 평균 약 8주가 걸리고 종합 비용이 30만 원 이상 발생합니다.
- 문서 위조가 적발돼도 발급, 번역공증, 아포스티유, 송부 중 어느 단계에서 문제가 들어왔는지 입증하기 어렵습니다.
- 사용자는 진행 상태를 보기 어렵고, 기관은 제출된 문서의 발급 주체와 단계별 검증 기록을 일관된 방식으로 확인하기 어렵습니다.

Foreign residents in Korea and overseas Koreans often need to manually handle government document issuance, translation notarization, apostille processing, and international delivery before they can submit documents to financial institutions, schools, or administrative agencies.

- The current process takes about 8 weeks on average and can cost more than KRW 300,000.
- When document fraud is detected, it is hard to prove whether the issue entered during issuance, translation/notarization, apostille processing, or delivery.
- Users cannot easily track status, and institutions lack a consistent way to verify the issuer and staged verification history of submitted documents.

## Solution

MyApo Frontend는 이 네 단계를 사용자가 이해할 수 있는 하나의 디지털 플로우로 보여줍니다.

- 사용자는 Web3Auth 기반 로그인 후 문서 발급 신청, 진행 현황 확인, 문서 상세 확인, 기관 제출, 재발급, 이의 신청을 수행합니다.
- 정부 발급 주체, 번역공증사, 아포스티유 처리 기관, 최종 수령자는 백엔드 API와 XRPL 검증 기록을 통해 각자의 역할을 수행합니다.
- 원본 문서와 개인정보는 온체인이 아니라 오프체인 저장소와 백엔드에서 다루고, 프론트엔드는 XRPL Credential 흐름에 필요한 사용자 승인과 서명 경험을 제공합니다.

MyApo Frontend presents these four steps as one digital flow that users can understand and act on.

- After Web3Auth login, users can request document issuance, check progress, view document details, submit credentials to institutions, request renewal, and file disputes.
- Government issuers, translation/notary providers, apostille processors, and final recipients perform their roles through backend APIs and XRPL verification records.
- Original documents and personal data stay off-chain. The frontend provides the approval and signing experience needed for the XRPL Credential flow.

## Result

- 외국인과 재외 국민이 해외 금융 계좌 개설, 송금, 유학, 취업, 가족관계 증빙 등 cross-border 금융·행정 절차를 더 빠르게 진행할 수 있습니다.
- 사용자는 문서 발급부터 제출까지의 상태를 모바일 화면에서 추적할 수 있습니다.
- 기관과 운영자는 XLS-70 Credentials, XLS-80 Permissioned Domains, 단계별 검증 기록을 활용하는 규제 친화적 금융 인프라 UX를 확장할 수 있습니다.

- Foreign residents and overseas Koreans can move faster through cross-border finance and administration use cases such as overseas bank account opening, remittance, study abroad, employment, and family relationship verification.
- Users can track the full path from document request to final submission on mobile.
- Institutions and operators can expand this into a regulation-friendly financial infrastructure UX using XLS-70 Credentials, XLS-80 Permissioned Domains, and staged verification records.

---

> 🎯 여기서부터 `myapo-frontend`를 구현 및 실행하기 위해 필요한 정보를 제공합니다.

> 🎯 From here, this README describes the information needed to implement and run `myapo-frontend`.

## Frontend Scope

현재 레포는 `app/` 아래 단일 Next.js 앱으로 구성되어 있습니다. 다만 서비스 화면은 여러 웹/관리자 프로젝트로 확장될 수 있으므로 README에서는 아래처럼 전체 프론트엔드 영역을 포괄합니다.

This repository currently contains one Next.js app under `app/`. The service can grow into multiple web/admin projects, so this README describes the complete frontend surface area.

| Area | Status | Purpose |
| --- | --- | --- |
| User mobile web | Implemented / 구현됨 | Login, persona selection, document request, progress tracking, submission, disputes |
| Institution submission web | Candidate / 구현 후보 | Screen for receiving institutions to review submission requests and histories |
| Operator console | Candidate / 구현 후보 | Manage stage approvals, file uploads, translation/notary status, and apostille status |
| Admin console | Candidate / 구현 후보 | Manage user roles, institution accounts, dispute assignment, and operating metrics |
| Public landing/demo | Candidate / 구현 후보 | Service introduction, demo, and KFIP pitch pages |
| Design system | Documented / 문서·에셋 보유 | Toss-inspired visual language, UI kit, slide deck, typography, tokens |

## Current App Routes

| Route | Screen Role | Current Data Source | Backend Integration Candidate |
| --- | --- | --- | --- |
| `/login` | Google/Web3Auth login | Web3Auth + MyApo auth client | `POST /api/v1/auth/signin`, `POST /api/v1/auth/logout` |
| `/persona-select` | User persona selection | local state / localStorage | Future user profile extension API |
| `/home` | Main menu dashboard | mock + partial API | Aggregated document/issue/dispute APIs |
| `/issue/select` | Select document to issue | API + fallback | `GET /api/v1/documents/types` |
| `/issue/verify` | Identity verification input | local form | Future identity verification API |
| `/issue/success` | Document request success | route transition | `POST /api/v1/document-mvp` |
| `/issue-complete` | Issuance completion notice | route transition | Follow-up UX after issuance completion |
| `/history` | In-progress issuance list | API + mock fallback | `GET /api/v1/document-mvp` |
| `/history/[id]` | Issuance progress detail | API + mock fallback | `GET /api/v1/document-mvp/{documentCode}` |
| `/documents` | Documents delivered to wallet | mock-focused | `GET /api/v1/credentials`, `GET /api/v1/documents` |
| `/documents/[id]` | Document detail, submission, renewal, dispute | mock-focused | Document detail, file download, submission APIs |
| `/submission-request` | Institution submission request selection | mock-focused | `POST /api/v1/credentials/{credentialId}/submissions` |
| `/delivery` | Submission delivery status | local constants | Future submission status API |
| `/renewal` | Document renewal guide | mock-focused | `POST /api/v1/documents` |
| `/disputes` | Dispute list | mock-focused | `GET /api/v1/disputes` |
| `/disputes/[id]` | Dispute detail | mock-focused | `GET /api/v1/disputes/{id}` |
| `/disputes/new` | Create dispute | local form | `POST /api/v1/disputes` |
| `/disputes/success` | Dispute creation success | route transition | Navigate after successful `POST /api/v1/disputes` |

## Repository Structure

```txt
myapo-frontend/
├── .github/workflows/deploy.yml   # Docker deployment on main push
└── app/
    ├── app/                       # Next.js App Router routes
    ├── components/ui/             # shared UI components
    ├── contexts/                  # auth/persona context
    ├── lib/                       # MyApo API client, XRPL signing, mock data
    ├── docs/                      # handoff, UI consistency, XRPL signing specs
    ├── design-system/             # design tokens, UI kit, slide deck, fonts
    ├── public/                    # static assets
    ├── Dockerfile
    ├── API_SPEC.md                # backend Swagger-based API snapshot
    └── package.json
```

## Demo & API

- ⭐️ Our demo: https://app.myapo.xyz
- Check API in Swagger: https://api.myapo.xyz/docs
- OpenAPI JSON: https://api.myapo.xyz/docs-json
- Local frontend: http://localhost:3000

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
| XLS-70 | Credentials | CredentialAccept / CredentialDelete signing flow ready for integration |
| XLS-80 | Permissioned Domains | Planned |
| XLS-85 | Token Escrow | Planned |
| - | RLUSD | Under review |

## Design System

`design-system/`은 MyApo 프론트엔드와 발표 자료에서 공통으로 쓰는 시각 언어입니다.

`design-system/` is the shared visual language for the MyApo frontend and presentation materials.

- Korean-first UI copy
- Toss Blue `#3182F6`
- Pretendard + Work Sans typography
- 20px radius card, pill button/chip
- 60·30·10 color rule
- slide deck / web page UI kit
- app / console / institution wireframes in [`design-system/wireframes/`](./design-system/wireframes/Readme.md)

자세한 내용은 [`design-system/README.md`](./design-system/README.md)를 확인하세요.

See [`design-system/README.md`](./design-system/README.md) for the full design system reference.

## How to Start myapo-frontend

### Install & Build

```bash
cd app
bun install
bun run build
```

> ⚠️ 이 프로젝트는 로컬 개발과 스크립트 실행에 **Bun만 사용합니다.** `npm`, `yarn`, `pnpm`을 섞어 쓰지 않습니다.
>
> ⚠️ This project uses **Bun only** for local development and scripts. Do not mix `npm`, `yarn`, or `pnpm` into this app.

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
>
> ⚠️ A `.env` file is required before running the app. `NEXT_PUBLIC_*` values are bundled into the browser build, so never put server-only secrets here.

```env
NEXT_PUBLIC_WEB3AUTH_CLIENT_ID=""
NEXT_PUBLIC_WEB3AUTH_NETWORK="sapphire_devnet"
NEXT_PUBLIC_MYAPO_API_BASE_URL="https://api.myapo.xyz"
```

| Variable | Required | Description |
| --- | --- | --- |
| `NEXT_PUBLIC_WEB3AUTH_CLIENT_ID` | Yes | Web3Auth project client id |
| `NEXT_PUBLIC_WEB3AUTH_NETWORK` | No | Web3Auth network. Docker default is `sapphire_devnet` |
| `NEXT_PUBLIC_MYAPO_API_BASE_URL` | No | MyApo backend base URL. Default is `https://api.myapo.xyz` |

## Docker

아래 명령은 레포 루트(`myapo-frontend/`) 기준입니다.

Run the following commands from the repository root, `myapo-frontend/`.

`NEXT_PUBLIC_*` 값은 `next build` 시점에 브라우저 번들로 inlining됩니다. 따라서 Docker 이미지를 만들 때 build arg로 전달해야 합니다.

`NEXT_PUBLIC_*` values are inlined into the browser bundle during `next build`, so they must be passed as build args when building the Docker image.

```bash
docker build \
  --build-arg NEXT_PUBLIC_WEB3AUTH_CLIENT_ID="$NEXT_PUBLIC_WEB3AUTH_CLIENT_ID" \
  --build-arg NEXT_PUBLIC_WEB3AUTH_NETWORK="${NEXT_PUBLIC_WEB3AUTH_NETWORK:-sapphire_devnet}" \
  --build-arg NEXT_PUBLIC_MYAPO_API_BASE_URL="${NEXT_PUBLIC_MYAPO_API_BASE_URL:-https://api.myapo.xyz}" \
  -t myapo-frontend ./app

docker run --rm -p 10000:10000 myapo-frontend
```

## GitHub Actions Deployment

`main` 브랜치에 push하면 self-hosted runner에서 Docker 이미지를 빌드하고 `myapo-frontend` 컨테이너를 재시작합니다.

Pushing to the `main` branch builds the Docker image on the self-hosted runner and restarts the `myapo-frontend` container.

Server requirements:

- GitHub Actions self-hosted runner registered for this repository
- Docker installed
- Runner user can run `docker` without an interactive password
- Inbound port `10000` is open
- Repository secret `NEXT_PUBLIC_WEB3AUTH_CLIENT_ID` is set
- Optional repository variables: `NEXT_PUBLIC_WEB3AUTH_NETWORK`, `NEXT_PUBLIC_MYAPO_API_BASE_URL`

## Integration Notes

- 프론트 로그인은 Web3Auth에서 외부 JWT를 받은 뒤 `POST /api/v1/auth/signin`으로 MyApo accessToken을 발급받습니다.
- 로그인 후 API 요청은 `Authorization: Bearer <accessToken>` 형태의 Internal JWT를 사용합니다.
- 현재 문서/분쟁/제출 화면 일부는 `lib/mock-data.ts` fallback을 사용합니다.
- API 연동 우선순위와 화면별 계약은 `docs/HANDOFF_SPEC.md`를 확인하세요.
- XRPL `signedTransactionBlob` 처리 전에는 `docs/XRPL_SIGNED_TRANSACTION_BLOB.md`를 먼저 확인하세요.

- Frontend login receives an external JWT from Web3Auth, then calls `POST /api/v1/auth/signin` to receive a MyApo accessToken.
- After login, API requests use the Internal JWT format: `Authorization: Bearer <accessToken>`.
- Some document, dispute, and submission screens still use `lib/mock-data.ts` as fallback data.
- For API integration priority and screen-level contracts, see `docs/HANDOFF_SPEC.md`.
- Before implementing XRPL `signedTransactionBlob` handling, read `docs/XRPL_SIGNED_TRANSACTION_BLOB.md`.
