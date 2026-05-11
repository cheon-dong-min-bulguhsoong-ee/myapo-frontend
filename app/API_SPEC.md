# MyApoBE API 명세서

> 원본 Swagger UI: https://api.myapo.xyz/docs#/
> OpenAPI JSON: https://api.myapo.xyz/docs-json
> 생성일: 2026-05-11

## 개요

- API 제목: MyApoBE API
- 버전: 0.0.1
- OpenAPI 버전: 3.0.0
- Base URL: `https://api.myapo.xyz`
- 총 엔드포인트: 29개

### 설명

Provides an API for domains managed by the 'MyApo' backend.

## 인증

| 이름 |타입 |방식/위치 |토큰/헤더명 |설명 |
| --- |--- |--- |--- |--- |
| `ExternalJwtBearer` |http |bearer |JWT |- |
| `InternalJwtBearer` |http |bearer |JWT |- |

## 엔드포인트 요약

| Method |Path |요약 |Tag |
| --- |--- |--- |--- |
| POST |`/api/v1/auth/signin` |통합 로그인/회원가입 (Sign-In) |Auth |
| POST |`/api/v1/auth/logout` |로그아웃 |Auth |
| GET |`/api/v1/users/me` |내 정보 조회 |Users |
| DELETE |`/api/v1/users/me` |회원 탈퇴 |Users |
| PATCH |`/api/v1/users/{id}/role` |사용자 권한 변경 (Admin 전용) |Users |
| POST |`/api/v1/credentials/issue-requests` |크리덴셜 발급 요청 생성 |Credentials |
| GET |`/api/v1/credentials/issue-requests/{issueRequestId}` |크리덴셜 발급 요청 조회 |Credentials |
| GET |`/api/v1/credentials` |내 크리덴셜 목록 조회 |Credentials |
| GET |`/api/v1/credentials/{credentialId}/submissions` |내 크리덴셜 제출 이력 조회 |Credentials |
| POST |`/api/v1/credentials/{credentialId}/submissions` |기관 요청에 크리덴셜 제출 |Credentials |
| GET |`/api/v1/credentials/{credentialId}` |내 크리덴셜 상세 조회 |Credentials |
| POST |`/api/v1/credentials/{credentialId}/xrpl/accept/prepare` |XRP Testnet CredentialAccept 서명 payload 생성 |Credentials |
| POST |`/api/v1/credentials/{credentialId}/xrpl/accept` |XRP Testnet CredentialAccept signed transaction 제출 |Credentials |
| POST |`/api/v1/credentials/{credentialId}/xrpl/delete/prepare` |XRP Testnet CredentialDelete 서명 payload 생성 |Credentials |
| POST |`/api/v1/credentials/{credentialId}/xrpl/delete` |XRP Testnet CredentialDelete signed transaction 제출 |Credentials |
| POST |`/api/v1/disputes` |이의제기(Dispute) 생성 |Disputes |
| GET |`/api/v1/disputes` |내 분쟁 목록 조회 |Disputes |
| GET |`/api/v1/disputes/{id}` |분쟁 상세 조회 |Disputes |
| PATCH |`/api/v1/disputes/{id}/assign` |운영자 배정 (Admin) |Disputes |
| PATCH |`/api/v1/disputes/{id}/status` |분쟁 상태 변경 (Operator) |Disputes |
| GET |`/api/v1/documents` |문서 관리 리스트 조회 (와이어프레임 console.html 의 docs 8컬럼) |Documents |
| POST |`/api/v1/documents` |문서 발급 신청 (Document 생성 + 5단계 파이프라인 시작) |Documents |
| POST |`/api/v1/documents/approvals` |문서 단계 승인 (사용자 크리덴셜 서명 결과 제출) |Documents |
| POST |`/api/v1/documents/stages/advance` |문서 단계 전이 (누적된 사용자 승인 기반 currentStage 진행) |Documents |
| POST |`/api/v1/documents/files/upload` |문서 첨부 파일 업로드 (일반 — 평문 그대로 저장) |Documents |
| POST |`/api/v1/documents/files/upload-encrypted` |문서 첨부 PDF 암호화 업로드 (open-password 부착 후 저장) |Documents |
| GET |`/api/v1/documents/types` |발급 가능한 문서 카탈로그 리스트 (서류 발급 신청 화면) |Documents |
| GET |`/api/v1/documents/{documentCode}/files/{stage}` |문서 첨부 파일 다운로드 (documentCode + stage 기반) |Documents |
| GET |`/api/v1/documents/{documentCode}` |문서 상세 조회 (행 펼침 — 5단계 파이프라인 + 사용자 승인 누적) |Documents |

## 엔드포인트 상세

### Auth

#### POST /api/v1/auth/signin

- 요약: 통합 로그인/회원가입 (Sign-In)
- 설명: Web3Auth 인증 토큰을 확인하여 로그인을 처리합니다. 시스템에 등록되지 않은 사용자인 경우, 요청 본문의 데이터를 사용하여 회원가입을 함께 수행합니다.
- Operation ID: `AuthController_signin`
- 인증: ExternalJwtBearer

##### Parameters

- 없음

##### Request Body

- Content-Type: application/json
- 필수 여부: 예

| 필드 |타입 |필수 |설명 |
| --- |--- |--- |--- |
| `name` |string |아니오 |- |
| `nationality` |string |아니오 |ISO 3166-1 alpha-2 |
| `xrplAddress` |string |아니오 |- |
| `publicKey` |string |아니오 |- |

```json
{
  "name": "홍길동",
  "nationality": "KR",
  "xrplAddress": "rHb9CJA...",
  "publicKey": "02..."
}
```

##### Responses

| 상태 코드 |설명 |응답 스키마 |
| --- |--- |--- |
| `200` |- |`CommonRes` + object |

응답 예시:

```json
{
  "success": true,
  "code": null,
  "message": null,
  "data": {
    "id": "string",
    "email": "string",
    "name": "string",
    "nationality": "string",
    "role": "USER",
    "createdAt": "string",
    "wallet": {
      "xrplAddress": "string"
    },
    "accessToken": "string"
  }
}
```

---

#### POST /api/v1/auth/logout

- 요약: 로그아웃
- 설명: 사용자 로그아웃 처리를 수행합니다. (현재는 성공 응답만 반환)
- Operation ID: `AuthController_logout`
- 인증: InternalJwtBearer

##### Parameters

- 없음

##### Request Body

- 없음

##### Responses

| 상태 코드 |설명 |응답 스키마 |
| --- |--- |--- |
| `200` |- |`CommonRes` + object |

응답 예시:

```json
{
  "success": true,
  "code": null,
  "message": null,
  "data": {}
}
```

---

### Users

#### GET /api/v1/users/me

- 요약: 내 정보 조회
- 설명: 현재 로그인한 사용자의 프로필 정보를 조회합니다.
- Operation ID: `UserController_getMe`
- 인증: InternalJwtBearer

##### Parameters

- 없음

##### Request Body

- 없음

##### Responses

| 상태 코드 |설명 |응답 스키마 |
| --- |--- |--- |
| `200` |- |`CommonRes` + object |

응답 예시:

```json
{
  "success": true,
  "code": null,
  "message": null,
  "data": {
    "id": "string",
    "email": "string",
    "name": "string",
    "nationality": "string",
    "role": "USER",
    "createdAt": "string",
    "wallet": {
      "xrplAddress": "string"
    }
  }
}
```

---

#### DELETE /api/v1/users/me

- 요약: 회원 탈퇴
- 설명: 사용자 계정을 Soft Delete 처리합니다.
- Operation ID: `UserController_deleteMe`
- 인증: InternalJwtBearer

##### Parameters

- 없음

##### Request Body

- 없음

##### Responses

| 상태 코드 |설명 |응답 스키마 |
| --- |--- |--- |
| `200` |- |`CommonRes` + object |

응답 예시:

```json
{
  "success": true,
  "code": null,
  "message": null,
  "data": {}
}
```

---

#### PATCH /api/v1/users/{id}/role

- 요약: 사용자 권한 변경 (Admin 전용)
- 설명: 특정 사용자의 권한을 변경합니다. 관리자(ADMIN) 권한이 필요합니다.
- Operation ID: `UserController_changeRole`
- 인증: InternalJwtBearer

##### Parameters

| 이름 |위치 |필수 |타입 |설명 |
| --- |--- |--- |--- |--- |
| `id` |path |예 |number |- |

##### Request Body

- Content-Type: application/json
- 필수 여부: 예

| 필드 |타입 |필수 |설명 |
| --- |--- |--- |--- |
| `role` |enum(USER, ADMIN, INSTITUTION) |예 |- |

```json
{
  "role": "USER"
}
```

##### Responses

| 상태 코드 |설명 |응답 스키마 |
| --- |--- |--- |
| `200` |- |`CommonRes` + object |

응답 예시:

```json
{
  "success": true,
  "code": null,
  "message": null,
  "data": {
    "id": "string",
    "email": "string",
    "name": "string",
    "nationality": "string",
    "role": "USER",
    "createdAt": "string",
    "wallet": {
      "xrplAddress": "string"
    }
  }
}
```

---

### Credentials

#### POST /api/v1/credentials/issue-requests

- 요약: 크리덴셜 발급 요청 생성
- 설명: Internal JWT 기반 사용자 발급 요청을 생성하고 XRP Testnet evidence 또는 MVP fallback Credential을 발급합니다.
- Operation ID: `CredentialController_createIssueRequest`
- 인증: InternalJwtBearer

##### Parameters

- 없음

##### Request Body

- Content-Type: application/json
- 필수 여부: 예

| 필드 |타입 |필수 |설명 |
| --- |--- |--- |--- |
| `documentTypeId` |string |예 |Credential 발급 대상 문서 카탈로그 ID |
| `documentId` |string |아니오 |원천 Document 참조 ID. 기존 Document 연동 시에만 사용한다. |
| `authEventId` |string |아니오 |Auth 소유 인증 이벤트 ID. Credential은 참조만 저장한다. |

```json
{
  "documentTypeId": "KR-NTS-TAX-PAYMENT",
  "documentId": "string",
  "authEventId": "string"
}
```

##### Responses

| 상태 코드 |설명 |응답 스키마 |
| --- |--- |--- |
| `200` |- |`CommonRes` + object |

응답 예시:

```json
{
  "success": true,
  "code": null,
  "message": null,
  "data": {
    "issueRequestId": "string",
    "status": "ISSUING",
    "pipeline": [
      {
        "stage": "RECEIVED",
        "label": "string",
        "status": "PENDING",
        "substep": {}
      }
    ],
    "currentStage": "RECEIVED",
    "currentSubstep": {},
    "authEventId": {}
  }
}
```

---

#### GET /api/v1/credentials/issue-requests/{issueRequestId}

- 요약: 크리덴셜 발급 요청 조회
- Operation ID: `CredentialController_getIssueRequest`
- 인증: InternalJwtBearer

##### Parameters

| 이름 |위치 |필수 |타입 |설명 |
| --- |--- |--- |--- |--- |
| `issueRequestId` |path |예 |string |- |

##### Request Body

- 없음

##### Responses

| 상태 코드 |설명 |응답 스키마 |
| --- |--- |--- |
| `200` |- |`CommonRes` + object |

응답 예시:

```json
{
  "success": true,
  "code": null,
  "message": null,
  "data": {
    "issueRequestId": "string",
    "status": "ISSUING",
    "pipeline": [
      {
        "stage": "RECEIVED",
        "label": "string",
        "status": "PENDING",
        "substep": {}
      }
    ],
    "currentStage": "RECEIVED",
    "currentSubstep": {},
    "authEventId": {},
    "credentialId": {},
    "submissionCount": 0
  }
}
```

---

#### GET /api/v1/credentials

- 요약: 내 크리덴셜 목록 조회
- Operation ID: `CredentialController_listCredentials`
- 인증: InternalJwtBearer

##### Parameters

| 이름 |위치 |필수 |타입 |설명 |
| --- |--- |--- |--- |--- |
| `status` |query |아니오 |string |- |

##### Request Body

- 없음

##### Responses

| 상태 코드 |설명 |응답 스키마 |
| --- |--- |--- |
| `200` |- |`CommonRes` + object |

응답 예시:

```json
{
  "success": true,
  "code": null,
  "message": null,
  "data": {
    "credentials": [
      {
        "credentialId": "string",
        "issueRequestId": "string",
        "documentTypeId": "string",
        "documentTypeName": "string",
        "issuerId": "string",
        "status": "ISSUED",
        "issuedAt": "string",
        "expiresAt": "string",
        "walletAddress": "string",
        "isMock": true,
        "xrplNetwork": {},
        "xrplTxHash": {},
        "xrplLedgerIndex": {},
        "xrplEngineResult": {},
        "xrplValidated": {},
        "xrplCredentialType": {}
      }
    ]
  }
}
```

---

#### GET /api/v1/credentials/{credentialId}/submissions

- 요약: 내 크리덴셜 제출 이력 조회
- Operation ID: `CredentialController_listSubmissions`
- 인증: InternalJwtBearer

##### Parameters

| 이름 |위치 |필수 |타입 |설명 |
| --- |--- |--- |--- |--- |
| `credentialId` |path |예 |string |- |

##### Request Body

- 없음

##### Responses

| 상태 코드 |설명 |응답 스키마 |
| --- |--- |--- |
| `200` |- |`CommonRes` + object |

응답 예시:

```json
{
  "success": true,
  "code": null,
  "message": null,
  "data": {
    "submissions": [
      {
        "submissionId": "string",
        "credentialId": "string",
        "recipientInstitutionId": "string",
        "recipientInstitutionName": "string",
        "status": "RECEIVED",
        "rejectionReason": {},
        "submittedAt": "string",
        "authEventId": {}
      }
    ]
  }
}
```

---

#### POST /api/v1/credentials/{credentialId}/submissions

- 요약: 기관 요청에 크리덴셜 제출
- Operation ID: `CredentialController_submitCredential`
- 인증: InternalJwtBearer

##### Parameters

| 이름 |위치 |필수 |타입 |설명 |
| --- |--- |--- |--- |--- |
| `credentialId` |path |예 |string |- |

##### Request Body

- Content-Type: application/json
- 필수 여부: 예

| 필드 |타입 |필수 |설명 |
| --- |--- |--- |--- |
| `submissionRequestId` |string |예 |기관 제출 요청 ID |
| `consentConfirmed` |boolean |예 |기관 제출에 대한 사용자 동의 여부 |
| `authEventId` |string |아니오 |Auth 소유 인증 이벤트 ID. Credential은 참조만 저장한다. |

```json
{
  "submissionRequestId": "SUB-REQ-001",
  "consentConfirmed": true,
  "authEventId": "string"
}
```

##### Responses

| 상태 코드 |설명 |응답 스키마 |
| --- |--- |--- |
| `200` |- |`CommonRes` + object |

응답 예시:

```json
{
  "success": true,
  "code": null,
  "message": null,
  "data": {
    "submissionId": "string",
    "credentialId": "string",
    "recipientInstitutionId": "string",
    "status": "RECEIVED",
    "submittedAt": "string",
    "authEventId": {}
  }
}
```

---

#### GET /api/v1/credentials/{credentialId}

- 요약: 내 크리덴셜 상세 조회
- Operation ID: `CredentialController_getCredentialDetail`
- 인증: InternalJwtBearer

##### Parameters

| 이름 |위치 |필수 |타입 |설명 |
| --- |--- |--- |--- |--- |
| `credentialId` |path |예 |string |- |

##### Request Body

- 없음

##### Responses

| 상태 코드 |설명 |응답 스키마 |
| --- |--- |--- |
| `200` |- |`CommonRes` + object |

응답 예시:

```json
{
  "success": true,
  "code": null,
  "message": null,
  "data": {
    "credentialId": "string",
    "issueRequestId": "string",
    "documentTypeId": "string",
    "documentTypeName": "string",
    "issuerId": "string",
    "status": "ISSUED",
    "issuedAt": "string",
    "expiresAt": "string",
    "walletAddress": "string",
    "isMock": true,
    "xrplNetwork": {},
    "xrplTxHash": {},
    "xrplLedgerIndex": {},
    "xrplEngineResult": {},
    "xrplValidated": {},
    "xrplCredentialType": {},
    "pipeline": [
      {
        "stage": "RECEIVED",
        "label": "string",
        "status": "PENDING",
        "substep": {}
      }
    ],
    "submissions": [
      {
        "submissionId": "string",
        "credentialId": "string",
        "recipientInstitutionId": "string",
        "recipientInstitutionName": "string",
        "status": "RECEIVED",
        "rejectionReason": {},
        "submittedAt": "string",
        "authEventId": {}
      }
    ],
    "sourceDocumentRef": {}
  }
}
```

---

#### POST /api/v1/credentials/{credentialId}/xrpl/accept/prepare

- 요약: XRP Testnet CredentialAccept 서명 payload 생성
- Operation ID: `CredentialController_prepareAcceptTestnetCredential`
- 인증: InternalJwtBearer

##### Parameters

| 이름 |위치 |필수 |타입 |설명 |
| --- |--- |--- |--- |--- |
| `credentialId` |path |예 |string |- |

##### Request Body

- 없음

##### Responses

| 상태 코드 |설명 |응답 스키마 |
| --- |--- |--- |
| `200` |- |`CommonRes` + object |

응답 예시:

```json
{
  "success": true,
  "code": null,
  "message": null,
  "data": {
    "transactionKind": "CREATE",
    "network": "string",
    "transaction": {}
  }
}
```

---

#### POST /api/v1/credentials/{credentialId}/xrpl/accept

- 요약: XRP Testnet CredentialAccept signed transaction 제출
- Operation ID: `CredentialController_acceptTestnetCredential`
- 인증: InternalJwtBearer

##### Parameters

| 이름 |위치 |필수 |타입 |설명 |
| --- |--- |--- |--- |--- |
| `credentialId` |path |예 |string |- |

##### Request Body

- Content-Type: application/json
- 필수 여부: 예

| 필드 |타입 |필수 |설명 |
| --- |--- |--- |--- |
| `signedTransactionBlob` |string |예 |XRPL signed transaction blob generated by the subject wallet from the prepared CredentialAccept transaction. |

```json
{
  "signedTransactionBlob": "12002F2280000000240000000168400000000000000C..."
}
```

##### Responses

| 상태 코드 |설명 |응답 스키마 |
| --- |--- |--- |
| `200` |- |`CommonRes` + object |

응답 예시:

```json
{
  "success": true,
  "code": null,
  "message": null,
  "data": {
    "transactionKind": "CREATE",
    "network": "string",
    "transactionHash": "string",
    "engineResult": "string",
    "ledgerIndex": {},
    "validated": true,
    "feeDrops": {},
    "account": "string",
    "issuer": {},
    "subject": {},
    "credentialType": "string",
    "flags": {},
    "objectSnapshot": {}
  }
}
```

---

#### POST /api/v1/credentials/{credentialId}/xrpl/delete/prepare

- 요약: XRP Testnet CredentialDelete 서명 payload 생성
- Operation ID: `CredentialController_prepareDeleteTestnetCredential`
- 인증: InternalJwtBearer

##### Parameters

| 이름 |위치 |필수 |타입 |설명 |
| --- |--- |--- |--- |--- |
| `credentialId` |path |예 |string |- |

##### Request Body

- Content-Type: application/json
- 필수 여부: 예

| 필드 |타입 |필수 |설명 |
| --- |--- |--- |--- |
| `submitterRole` |enum(SUBJECT, ISSUER) |예 |XLS-70 CredentialDelete signer role. SUBJECT signs with the credential holder wallet; ISSUER signs with the issuer wallet. |

```json
{
  "submitterRole": "SUBJECT"
}
```

##### Responses

| 상태 코드 |설명 |응답 스키마 |
| --- |--- |--- |
| `200` |- |`CommonRes` + object |

응답 예시:

```json
{
  "success": true,
  "code": null,
  "message": null,
  "data": {
    "transactionKind": "CREATE",
    "network": "string",
    "transaction": {}
  }
}
```

---

#### POST /api/v1/credentials/{credentialId}/xrpl/delete

- 요약: XRP Testnet CredentialDelete signed transaction 제출
- Operation ID: `CredentialController_deleteTestnetCredential`
- 인증: InternalJwtBearer

##### Parameters

| 이름 |위치 |필수 |타입 |설명 |
| --- |--- |--- |--- |--- |
| `credentialId` |path |예 |string |- |

##### Request Body

- Content-Type: application/json
- 필수 여부: 예

| 필드 |타입 |필수 |설명 |
| --- |--- |--- |--- |
| `submitterRole` |enum(SUBJECT, ISSUER) |예 |XLS-70 CredentialDelete submitter. SUBJECT signs as the credential holder, ISSUER signs as the issuer. |
| `signedTransactionBlob` |string |예 |XRPL signed transaction blob generated by the selected submitter wallet from the prepared CredentialDelete transaction. |

```json
{
  "submitterRole": "SUBJECT",
  "signedTransactionBlob": "1200302280000000240000000168400000000000000C..."
}
```

##### Responses

| 상태 코드 |설명 |응답 스키마 |
| --- |--- |--- |
| `200` |- |`CommonRes` + object |

응답 예시:

```json
{
  "success": true,
  "code": null,
  "message": null,
  "data": {
    "transactionKind": "CREATE",
    "network": "string",
    "transactionHash": "string",
    "engineResult": "string",
    "ledgerIndex": {},
    "validated": true,
    "feeDrops": {},
    "account": "string",
    "issuer": {},
    "subject": {},
    "credentialType": "string",
    "flags": {},
    "objectSnapshot": {}
  }
}
```

---

### Disputes

#### POST /api/v1/disputes

- 요약: 이의제기(Dispute) 생성
- 설명: 발급된 증명서에 대해 이의제기를 생성합니다.
- Operation ID: `DisputeController_createDispute`
- 인증: InternalJwtBearer

##### Parameters

- 없음

##### Request Body

- Content-Type: application/json
- 필수 여부: 예

| 필드 |타입 |필수 |설명 |
| --- |--- |--- |--- |
| `type` |enum(TYPO, IDENTITY_MISMATCH, DOCUMENT_INVALID, OTHER) |예 |- |
| `requestId` |string |예 |- |

```json
{
  "type": "TYPO",
  "requestId": "string"
}
```

##### Responses

| 상태 코드 |설명 |응답 스키마 |
| --- |--- |--- |
| `200` |- |`CommonRes` + object |

응답 예시:

```json
{
  "success": true,
  "code": null,
  "message": null,
  "data": {
    "id": "string",
    "status": "string",
    "type": "string",
    "requestId": "string",
    "requesterId": "string",
    "operatorId": {},
    "slaDeadline": "string",
    "isSlaPaused": true,
    "timeline": [
      {
        "id": "string",
        "status": "string",
        "note": {},
        "operatorId": {},
        "isInternal": true,
        "createdAt": "string"
      }
    ],
    "createdAt": "string"
  }
}
```

---

#### GET /api/v1/disputes

- 요약: 내 분쟁 목록 조회
- 설명: 현재 로그인한 사용자가 생성한 분쟁 목록을 조회합니다.
- Operation ID: `DisputeController_listDisputes`
- 인증: InternalJwtBearer

##### Parameters

- 없음

##### Request Body

- 없음

##### Responses

| 상태 코드 |설명 |응답 스키마 |
| --- |--- |--- |
| `200` |- |`CommonRes` + object |

응답 예시:

```json
{
  "success": true,
  "code": null,
  "message": null,
  "data": {
    "disputes": [
      {
        "id": "string",
        "status": "RECEIVED",
        "type": "TYPO",
        "requestId": "string",
        "operatorId": {},
        "slaDeadline": "string",
        "createdAt": "string"
      }
    ]
  }
}
```

---

#### GET /api/v1/disputes/{id}

- 요약: 분쟁 상세 조회
- 설명: 특정 분쟁의 상세 정보 및 타임라인을 조회합니다.
- Operation ID: `DisputeController_getDispute`
- 인증: InternalJwtBearer

##### Parameters

| 이름 |위치 |필수 |타입 |설명 |
| --- |--- |--- |--- |--- |
| `id` |path |예 |string |- |

##### Request Body

- 없음

##### Responses

| 상태 코드 |설명 |응답 스키마 |
| --- |--- |--- |
| `200` |- |`CommonRes` + object |

응답 예시:

```json
{
  "success": true,
  "code": null,
  "message": null,
  "data": {
    "id": "string",
    "status": "string",
    "type": "string",
    "requestId": "string",
    "requesterId": "string",
    "operatorId": {},
    "slaDeadline": "string",
    "isSlaPaused": true,
    "timeline": [
      {
        "id": "string",
        "status": "string",
        "note": {},
        "operatorId": {},
        "isInternal": true,
        "createdAt": "string"
      }
    ],
    "createdAt": "string"
  }
}
```

---

#### PATCH /api/v1/disputes/{id}/assign

- 요약: 운영자 배정 (Admin)
- 설명: 관리자가 분쟁 처리 운영자를 수동/자동 배정합니다.
- Operation ID: `DisputeController_assignOperator`
- 인증: InternalJwtBearer

##### Parameters

| 이름 |위치 |필수 |타입 |설명 |
| --- |--- |--- |--- |--- |
| `id` |path |예 |string |- |

##### Request Body

- 없음

##### Responses

| 상태 코드 |설명 |응답 스키마 |
| --- |--- |--- |
| `200` |- |`CommonRes` + object |

응답 예시:

```json
{
  "success": true,
  "code": null,
  "message": null,
  "data": {
    "id": "string",
    "status": "string",
    "type": "string",
    "requestId": "string",
    "requesterId": "string",
    "operatorId": {},
    "slaDeadline": "string",
    "isSlaPaused": true,
    "timeline": [
      {
        "id": "string",
        "status": "string",
        "note": {},
        "operatorId": {},
        "isInternal": true,
        "createdAt": "string"
      }
    ],
    "createdAt": "string"
  }
}
```

---

#### PATCH /api/v1/disputes/{id}/status

- 요약: 분쟁 상태 변경 (Operator)
- 설명: 운영자가 분쟁의 처리 상태를 변경합니다.
- Operation ID: `DisputeController_changeStatus`
- 인증: InternalJwtBearer

##### Parameters

| 이름 |위치 |필수 |타입 |설명 |
| --- |--- |--- |--- |--- |
| `id` |path |예 |string |- |

##### Request Body

- Content-Type: application/json
- 필수 여부: 예

| 필드 |타입 |필수 |설명 |
| --- |--- |--- |--- |
| `newStatus` |enum(RECEIVED, ASSIGNED, IN_REVIEW, INFO_REQUESTED, RESOLVED, REJECTED) |예 |- |
| `note` |string |아니오 |- |
| `isInternal` |boolean |예 |- |
| `credentialCode` |string |아니오 |RESOLVED 시 필수 |

```json
{
  "newStatus": "RECEIVED",
  "note": "string",
  "isInternal": false,
  "credentialCode": "string"
}
```

##### Responses

| 상태 코드 |설명 |응답 스키마 |
| --- |--- |--- |
| `200` |- |`CommonRes` + object |

응답 예시:

```json
{
  "success": true,
  "code": null,
  "message": null,
  "data": {
    "id": "string",
    "status": "string",
    "type": "string",
    "requestId": "string",
    "requesterId": "string",
    "operatorId": {},
    "slaDeadline": "string",
    "isSlaPaused": true,
    "timeline": [
      {
        "id": "string",
        "status": "string",
        "note": {},
        "operatorId": {},
        "isInternal": true,
        "createdAt": "string"
      }
    ],
    "createdAt": "string"
  }
}
```

---

### Documents

#### GET /api/v1/documents

- 요약: 문서 관리 리스트 조회 (와이어프레임 console.html 의 docs 8컬럼)
- 설명: 문서 관리 페이지의 리스트 뷰를 위한 페이지네이션 조회. 컬럼: 요청번호 / 회원번호 / 요청자 / 이메일 / 문서 유형 / 국가 / 요청 시각 / 상태.

필터 (모두 optional, 미지정 = 전체):
- `status` (DocumentStatus) — 와이어프레임 탭(progress/valid/expired/revoked/failed) 1:1 대응
- `documentTypeCode` — 문서 카탈로그 코드
- `countryCode` — 발급기관 국가 (ISO 3166-1 alpha-2)
- `q` — documentCode / 요청자 이름 / 이메일 부분일치 (대소문자 무시)

정렬은 `requestedAt DESC` 고정. *콘솔 운영자 뷰* 라서 본인 소유 필터링은 적용하지 않는다.

*인증*: `Authorization: Bearer <accessToken>` 필수.
- Operation ID: `DocumentController_findList`
- 인증: InternalJwtBearer

##### Parameters

| 이름 |위치 |필수 |타입 |설명 |
| --- |--- |--- |--- |--- |
| `status` |query |아니오 |enum(PROGRESS, AWAITING_APPROVAL, VALID, EXPIRED, REVOKED, FAILED) |문서 상태 필터 — 와이어프레임 탭(progress/valid/expired/revoked/failed) 과 매핑. |
| `documentTypeCode` |query |아니오 |string |문서 카탈로그 코드 필터. |
| `countryCode` |query |아니오 |string |국가 코드 필터 (ISO 3166-1 alpha-2). 발급기관 국가 기준. |
| `q` |query |아니오 |string |검색어. documentCode · 요청자 이름 · 이메일 부분일치. |
| `page` |query |아니오 |number |페이지 번호 (1-based). |
| `limit` |query |아니오 |number |페이지 크기. |

##### Request Body

- 없음

##### Responses

| 상태 코드 |설명 |응답 스키마 |
| --- |--- |--- |
| `200` |- |`CommonRes` + object |

응답 예시:

```json
{
  "success": true,
  "code": null,
  "message": null,
  "data": {
    "items": [
      {
        "documentCode": "9f2b1a3c-4d5e-6f7a-8b9c-0d1e2f3a4b5c",
        "memberCode": "1",
        "requesterName": "홍길동",
        "requesterEmail": "hong@example.com",
        "documentTypeCode": "KR-NTS-TAX-PAYMENT",
        "documentTypeName": "납세증명서",
        "countryCode": "KR",
        "requestedAt": "2026-05-06T03:00:00.000Z",
        "status": "AWAITING_APPROVAL",
        "currentStage": "AUTHORITY_ISSUED"
      }
    ],
    "total": 142,
    "page": 1,
    "limit": 20
  }
}
```

---

#### POST /api/v1/documents

- 요약: 문서 발급 신청 (Document 생성 + 5단계 파이프라인 시작)
- 설명: 사용자가 문서 카탈로그에서 한 종류를 선택해 발급을 신청한다. 한 트랜잭션으로 Document(status=PROGRESS, currentStage=AUTHORITY_ISSUED) 행과 첫 DocumentStage 이벤트(stage=AUTHORITY_ISSUED, status=PENDING) 가 함께 INSERT 된다. 이후 단계는 별도 워커가 순차적으로 처리한다.

*인증*: `Authorization: Bearer <accessToken>` 필수 (JwtAuthGuard).
- Operation ID: `DocumentController_create`
- 인증: InternalJwtBearer

##### Parameters

- 없음

##### Request Body

- Content-Type: application/json
- 필수 여부: 예

| 필드 |타입 |필수 |설명 |
| --- |--- |--- |--- |
| `documentTypeCode` |string |예 |문서 카탈로그 코드 (DocumentType.code). 시드 예: KR-NTS-TAX-PAYMENT |

```json
{
  "documentTypeCode": "KR-NTS-TAX-PAYMENT"
}
```

##### Responses

| 상태 코드 |설명 |응답 스키마 |
| --- |--- |--- |
| `200` |- |`CommonRes` + object |

응답 예시:

```json
{
  "success": true,
  "code": null,
  "message": null,
  "data": {
    "documentCode": "9f2b1a3c-4d5e-6f7a-8b9c-0d1e2f3a4b5c",
    "documentTypeCode": "KR-NTS-TAX-PAYMENT",
    "status": "PROGRESS",
    "currentStage": "AUTHORITY_ISSUED",
    "requestedAt": "2026-05-06T03:00:00.000Z"
  }
}
```

---

#### POST /api/v1/documents/approvals

- 요약: 문서 단계 승인 (사용자 크리덴셜 서명 결과 제출)
- 설명: 사용자가 현재 stage 의 크리덴셜에 자기 seed 로 서명한 XRPL TX 해시를 제출한다. 서버는 documents.current_stage 를 보고 다음 stage 를 계산해 document_approvals 테이블에 1행 INSERT 한다 (stage = 통과시킨 다음 stage).

*제약*: (1) 본인이 신청한 문서만 승인 가능. (2) 이미 마지막 단계(WALLET_STORED) 에 도달한 문서는 거부. (3) 같은 단계 중복 승인은 (document_id, stage) UNIQUE 제약으로 차단.

*인증*: `Authorization: Bearer <accessToken>` 필수.
- Operation ID: `DocumentController_approve`
- 인증: InternalJwtBearer

##### Parameters

- 없음

##### Request Body

- Content-Type: application/json
- 필수 여부: 예

| 필드 |타입 |필수 |설명 |
| --- |--- |--- |--- |
| `documentCode` |string |예 |발급 신청 시 서버가 발급한 문서 외부 코드 (UUID). documents.document_code 와 동일. |
| `xrplTxHash` |string |예 |사용자가 서명한 XRPL 트랜잭션 해시 · 64자 hex (대문자). document_approvals.xrpl_tx_hash 컬럼과 동일 형식. |

```json
{
  "documentCode": "9f2b1a3c-4d5e-6f7a-8b9c-0d1e2f3a4b5c",
  "xrplTxHash": "A5111111111111111111111111111111111111111111111111111111111111AA"
}
```

##### Responses

| 상태 코드 |설명 |응답 스키마 |
| --- |--- |--- |
| `200` |- |`CommonRes` + object |

응답 예시:

```json
{
  "success": true,
  "code": null,
  "message": null,
  "data": {
    "documentCode": "9f2b1a3c-4d5e-6f7a-8b9c-0d1e2f3a4b5c",
    "approvedStage": "DOCUMENT_ARRIVED",
    "xrplTxHash": "A5111111111111111111111111111111111111111111111111111111111111AA",
    "approvedAt": "2026-05-06T03:00:00.000Z"
  }
}
```

---

#### POST /api/v1/documents/stages/advance

- 요약: 문서 단계 전이 (누적된 사용자 승인 기반 currentStage 진행)
- 설명: `POST /documents/approvals` 로 누적된 사용자 승인을 바탕으로 documents.current_stage 를 다음 stage 로 1단계 전진시킨다.

서버 처리:
1) documents.current_stage 의 미완료 DocumentStage 이벤트를 DONE 으로 마감
2) documents.current_stage 를 다음 stage 로 갱신 (WALLET_STORED 도달 시 status=VALID, issuedAt=now)
3) 다음 stage 의 DocumentStage 이벤트 신규 INSERT (WALLET_STORED 는 종착지이므로 즉시 DONE)

*제약*: (1) 본인이 신청한 문서만 전이 가능. (2) 이미 마지막 단계(WALLET_STORED) 에 도달한 문서는 거부. (3) 다음 stage 에 대한 DocumentApproval 행이 없으면 거부 (승인 없이 전이 불가).

*인증*: `Authorization: Bearer <accessToken>` 필수.
- Operation ID: `DocumentController_advanceStage`
- 인증: InternalJwtBearer

##### Parameters

- 없음

##### Request Body

- Content-Type: application/json
- 필수 여부: 예

| 필드 |타입 |필수 |설명 |
| --- |--- |--- |--- |
| `documentCode` |string |예 |발급 신청 시 서버가 발급한 문서 외부 코드 (UUID). documents.document_code 와 동일. |

```json
{
  "documentCode": "9f2b1a3c-4d5e-6f7a-8b9c-0d1e2f3a4b5c"
}
```

##### Responses

| 상태 코드 |설명 |응답 스키마 |
| --- |--- |--- |
| `200` |- |`CommonRes` + object |

응답 예시:

```json
{
  "success": true,
  "code": null,
  "message": null,
  "data": {
    "documentCode": "9f2b1a3c-4d5e-6f7a-8b9c-0d1e2f3a4b5c",
    "currentStage": "DOCUMENT_ARRIVED",
    "status": "AWAITING_APPROVAL",
    "issuedAt": null
  }
}
```

---

#### POST /api/v1/documents/files/upload

- 요약: 문서 첨부 파일 업로드 (일반 — 평문 그대로 저장)
- 설명: `multipart/form-data` 로 임의 바이너리 1개를 받아 객체 스토리지(R2)에 저장한다. 응답의 `downloadUri` 는 백엔드 프록시 다운로드 경로 — 버킷은 private 유지.

*제약*: (1) 단일 파일 필드명 `file`. (2) 최대 50 MiB. (3) 빈 파일 거부.

*인증*: `Authorization: Bearer <accessToken>` 필수.
- Operation ID: `DocumentController_uploadFile`
- 인증: InternalJwtBearer

##### Parameters

- 없음

##### Request Body

- Content-Type: multipart/form-data
- 필수 여부: 예

| 필드 |타입 |필수 |설명 |
| --- |--- |--- |--- |
| `file` |string(binary) |예 |업로드할 파일(최대 50 MiB) |
| `documentCode` |string(uuid) |예 |대상 Document 의 외부 노출 코드 (UUID). |
| `stage` |enum(AUTHORITY_ISSUED, DOCUMENT_ARRIVED, TRANSLATED_NOTARIZED, APOSTILLE_ISSUED, WALLET_STORED) |예 |5단계 파이프라인 stage. `document_stages.s3_object_key` 룩업 키. |

```json
{
  "file": "string",
  "documentCode": "9f2b1a3c-4d5e-6f7a-8b9c-0d1e2f3a4b5c",
  "stage": "DOCUMENT_ARRIVED"
}
```

##### Responses

| 상태 코드 |설명 |응답 스키마 |
| --- |--- |--- |
| `200` |- |`CommonRes` + object |

응답 예시:

```json
{
  "success": true,
  "code": null,
  "message": null,
  "data": {
    "fileKey": "documents/2026/05/9f2b1a3c-4d5e-6f7a-8b9c-0d1e2f3a4b5c.pdf",
    "originalFileName": "tax-invoice.pdf",
    "contentType": "application/pdf",
    "size": 38291,
    "downloadUri": "/api/v1/documents/9f2b1a3c-4d5e-6f7a-8b9c-0d1e2f3a4b5c/files/DOCUMENT_ARRIVED",
    "encrypted": false,
    "uploadedAt": "2026-05-10T05:21:00.000Z"
  }
}
```

---

#### POST /api/v1/documents/files/upload-encrypted

- 요약: 문서 첨부 PDF 암호화 업로드 (open-password 부착 후 저장)
- 설명: `multipart/form-data` 로 PDF 1개 + `userPassword` 텍스트 필드를 받아 AES-256 open-password 가 걸린 PDF 로 변환해 객체 스토리지에 저장한다. 뷰어가 다운받아도 비밀번호 없이는 열람 불가. 내부적으로 owner password 도 동일 값으로 설정 — 외부에는 단일 비밀번호 개념만 노출.

*검증*: (1) Content-Type 또는 확장자가 PDF. (2) 매직 바이트 `%PDF-` 가 일치해야 함(위조 방지). (3) `userPassword` 4~64자.

*인증*: `Authorization: Bearer <accessToken>` 필수.
- Operation ID: `DocumentController_uploadEncryptedPdf`
- 인증: InternalJwtBearer

##### Parameters

- 없음

##### Request Body

- Content-Type: multipart/form-data
- 필수 여부: 예

| 필드 |타입 |필수 |설명 |
| --- |--- |--- |--- |
| `file` |string(binary) |예 |업로드할 PDF (최대 50 MiB). |
| `documentCode` |string(uuid) |예 |대상 Document 의 외부 노출 코드 (UUID). |
| `stage` |enum(AUTHORITY_ISSUED, DOCUMENT_ARRIVED, TRANSLATED_NOTARIZED, APOSTILLE_ISSUED, WALLET_STORED) |예 |5단계 파이프라인 stage. `document_stages.s3_object_key` 룩업 키. |
| `userPassword` |string |예 |PDF 열람 비밀번호. owner password 도 동일 값으로 내부 설정. |

```json
{
  "file": "string",
  "documentCode": "9f2b1a3c-4d5e-6f7a-8b9c-0d1e2f3a4b5c",
  "stage": "DOCUMENT_ARRIVED",
  "userPassword": "A1b2!c3d4"
}
```

##### Responses

| 상태 코드 |설명 |응답 스키마 |
| --- |--- |--- |
| `200` |- |`CommonRes` + object |

응답 예시:

```json
{
  "success": true,
  "code": null,
  "message": null,
  "data": {
    "fileKey": "documents/2026/05/9f2b1a3c-4d5e-6f7a-8b9c-0d1e2f3a4b5c.pdf",
    "originalFileName": "tax-invoice.pdf",
    "contentType": "application/pdf",
    "size": 38291,
    "downloadUri": "/api/v1/documents/9f2b1a3c-4d5e-6f7a-8b9c-0d1e2f3a4b5c/files/DOCUMENT_ARRIVED",
    "encrypted": false,
    "uploadedAt": "2026-05-10T05:21:00.000Z"
  }
}
```

---

#### GET /api/v1/documents/types

- 요약: 발급 가능한 문서 카탈로그 리스트 (서류 발급 신청 화면)
- 설명: 사용자 페르소나별로 발급 가능한 문서 타입 목록을 조회합니다.
- Operation ID: `DocumentController_listTypes`
- 인증: InternalJwtBearer

##### Parameters

| 이름 |위치 |필수 |타입 |설명 |
| --- |--- |--- |--- |--- |
| `personaType` |query |아니오 |enum(KOREAN, FOREIGNER) |사용자 페르소나 필터 |

##### Request Body

- 없음

##### Responses

| 상태 코드 |설명 |응답 스키마 |
| --- |--- |--- |
| `200` |- |`CommonRes` + object |

응답 예시:

```json
{
  "success": true,
  "code": null,
  "message": null,
  "data": {
    "items": [
      {
        "code": "KR-NTS-TAX-PAYMENT",
        "name": "납세증명서",
        "englishName": {},
        "useCase": {},
        "defaultTtlMonths": 12,
        "personaType": "KOREAN",
        "issuerCode": "KR-NTS",
        "issuerName": "국세청",
        "issuerCountryCode": "KR",
        "issuerIconLabel": "NTS"
      }
    ],
    "total": 1
  }
}
```

---

#### GET /api/v1/documents/{documentCode}/files/{stage}

- 요약: 문서 첨부 파일 다운로드 (documentCode + stage 기반)
- 설명: 본인 소유 Document 의 특정 stage 에 첨부된 파일을 다운로드한다. 서버가 `document_stages.s3_object_key` 를 룩업해 R2 에서 객체를 그대로 스트리밍한다. 암호화 PDF 는 다운로드는 받을 수 있지만 PDF 뷰어에서 비밀번호 입력이 필요하다.

*제약*: (1) 본인이 신청한 Document 만 다운로드 가능. (2) 해당 stage 에 업로드된 파일이 없으면 `ERR_DOCUMENT_FILE_NOT_FOUND`.

*인증*: `Authorization: Bearer <accessToken>` 필수.
- Operation ID: `DocumentController_download`
- 인증: InternalJwtBearer

##### Parameters

| 이름 |위치 |필수 |타입 |설명 |
| --- |--- |--- |--- |--- |
| `documentCode` |path |예 |string |대상 Document 의 외부 노출 코드 (UUID). |
| `stage` |path |예 |enum(AUTHORITY_ISSUED, DOCUMENT_ARRIVED, TRANSLATED_NOTARIZED, APOSTILLE_ISSUED, WALLET_STORED) |5단계 파이프라인 stage 중 하나. |

##### Request Body

- 없음

##### Responses

| 상태 코드 |설명 |응답 스키마 |
| --- |--- |--- |
| `200` |파일 바이너리 스트림. |string(binary) |

응답 예시:

```json
"string"
```

---

#### GET /api/v1/documents/{documentCode}

- 요약: 문서 상세 조회 (행 펼침 — 5단계 파이프라인 + 사용자 승인 누적)
- 설명: 문서 관리 리스트 행을 클릭했을 때 펼침 영역에 표시할 상세.

리턴되는 핵심 필드:
- `currentStage` — 현재 stage (5단계 중 어디인지)
- `currentSubstep` — 진행 중인 sub-step (`CREDENTIAL_GENERATING` / `AWAITING_USER_APPROVAL` / null)
- `stages[]` — 5개 stage 의 이벤트 스냅샷 (`status: null` = 미시작)
- `approvals[]` — 사용자가 서명한 DocumentApproval 누적 (stage = "이 승인이 통과시킨 다음 stage")

클라이언트는 `approvals` 에 stage=X 가 있으면 "X 단계로의 사용자 승인이 완료" 로, `stages[i].status` 가 채워져 있으면 "i 단계 크리덴셜 이벤트가 시작/진행/완료/실패" 로 와이어프레임 substep 표시(✓ / 진행 중 / 미진행) 매핑하면 된다.

*인증*: `Authorization: Bearer <accessToken>` 필수.
- Operation ID: `DocumentController_findDetail`
- 인증: InternalJwtBearer

##### Parameters

| 이름 |위치 |필수 |타입 |설명 |
| --- |--- |--- |--- |--- |
| `documentCode` |path |예 |string |발급 문서 외부 노출 코드 (UUID). |

##### Request Body

- 없음

##### Responses

| 상태 코드 |설명 |응답 스키마 |
| --- |--- |--- |
| `200` |- |`CommonRes` + object |

응답 예시:

```json
{
  "success": true,
  "code": null,
  "message": null,
  "data": {
    "documentCode": "9f2b1a3c-4d5e-6f7a-8b9c-0d1e2f3a4b5c",
    "memberCode": "1",
    "requesterName": "홍길동",
    "requesterEmail": "hong@example.com",
    "documentTypeCode": "KR-NTS-TAX-PAYMENT",
    "documentTypeName": "납세증명서",
    "countryCode": "KR",
    "requestedAt": "2026-05-06T03:00:00.000Z",
    "issuedAt": "string",
    "status": "PROGRESS",
    "currentStage": "AUTHORITY_ISSUED",
    "currentSubstep": "CREDENTIAL_GENERATING",
    "stages": [
      {
        "stage": "AUTHORITY_ISSUED",
        "status": "PENDING",
        "startedAt": "string",
        "completedAt": "string",
        "failureReason": "string"
      }
    ],
    "approvals": [
      {
        "stage": "AUTHORITY_ISSUED",
        "xrplTxHash": "A5111111111111111111111111111111111111111111111111111111111111AA",
        "approvedAt": "2026-05-06T03:00:00.000Z"
      }
    ]
  }
}
```

---

## 데이터 스키마

### CommonRes

| 필드 |타입 |필수 |설명 |
| --- |--- |--- |--- |
| `success` |boolean |예 |- |
| `code` |object |예 |- |
| `message` |object |예 |- |
| `data` |object |예 |- |

### UserWalletRes

| 필드 |타입 |필수 |설명 |
| --- |--- |--- |--- |
| `xrplAddress` |string |예 |- |

### AuthRes

| 필드 |타입 |필수 |설명 |
| --- |--- |--- |--- |
| `id` |string |예 |- |
| `email` |string |예 |- |
| `name` |string |예 |- |
| `nationality` |string |예 |- |
| `role` |enum(USER, ADMIN, INSTITUTION) |예 |- |
| `createdAt` |string |예 |- |
| `wallet` |UserWalletRes |예 |- |
| `accessToken` |string |예 |- |

### SignInReq

| 필드 |타입 |필수 |설명 |
| --- |--- |--- |--- |
| `name` |string |아니오 |- |
| `nationality` |string |아니오 |ISO 3166-1 alpha-2 |
| `xrplAddress` |string |아니오 |- |
| `publicKey` |string |아니오 |- |

### Object

- 없음

### UserRes

| 필드 |타입 |필수 |설명 |
| --- |--- |--- |--- |
| `id` |string |예 |- |
| `email` |string |예 |- |
| `name` |string |예 |- |
| `nationality` |string |예 |- |
| `role` |enum(USER, ADMIN, INSTITUTION) |예 |- |
| `createdAt` |string |예 |- |
| `wallet` |UserWalletRes |예 |- |

### ChangeUserRoleReq

| 필드 |타입 |필수 |설명 |
| --- |--- |--- |--- |
| `role` |enum(USER, ADMIN, INSTITUTION) |예 |- |

### IssuePipelineStageItemRes

| 필드 |타입 |필수 |설명 |
| --- |--- |--- |--- |
| `stage` |enum(RECEIVED, PRE_REVIEW, TRANSLATION_REVIEW, NOTARY_SIGNATURE, ISSUED) |예 |- |
| `label` |string |예 |- |
| `status` |enum(PENDING, ACTIVE, DONE, FAILED) |예 |- |
| `substep` |object |예 |- |

### CreateCredentialIssueRequestRes

| 필드 |타입 |필수 |설명 |
| --- |--- |--- |--- |
| `issueRequestId` |string |예 |- |
| `status` |enum(ISSUING, USER_APPROVAL_REQUIRED, ISSUED, FAILED, REVOKED) |예 |- |
| `pipeline` |IssuePipelineStageItemRes[] |예 |- |
| `currentStage` |enum(RECEIVED, PRE_REVIEW, TRANSLATION_REVIEW, NOTARY_SIGNATURE, ISSUED) |예 |- |
| `currentSubstep` |object |예 |- |
| `authEventId` |object |예 |- |

### CreateCredentialIssueRequestReq

| 필드 |타입 |필수 |설명 |
| --- |--- |--- |--- |
| `documentTypeId` |string |예 |Credential 발급 대상 문서 카탈로그 ID |
| `documentId` |string |아니오 |원천 Document 참조 ID. 기존 Document 연동 시에만 사용한다. |
| `authEventId` |string |아니오 |Auth 소유 인증 이벤트 ID. Credential은 참조만 저장한다. |

### CredentialIssueRequestRes

| 필드 |타입 |필수 |설명 |
| --- |--- |--- |--- |
| `issueRequestId` |string |예 |- |
| `status` |enum(ISSUING, USER_APPROVAL_REQUIRED, ISSUED, FAILED, REVOKED) |예 |- |
| `pipeline` |IssuePipelineStageItemRes[] |예 |- |
| `currentStage` |enum(RECEIVED, PRE_REVIEW, TRANSLATION_REVIEW, NOTARY_SIGNATURE, ISSUED) |예 |- |
| `currentSubstep` |object |예 |- |
| `authEventId` |object |예 |- |
| `credentialId` |object |예 |- |
| `submissionCount` |number |예 |- |

### CredentialSummaryRes

| 필드 |타입 |필수 |설명 |
| --- |--- |--- |--- |
| `credentialId` |string |예 |- |
| `issueRequestId` |string |예 |- |
| `documentTypeId` |string |예 |- |
| `documentTypeName` |string |예 |- |
| `issuerId` |string |예 |- |
| `status` |enum(ISSUED, EXPIRED, REVOKED, FAILED) |예 |- |
| `issuedAt` |string |예 |- |
| `expiresAt` |string |예 |- |
| `walletAddress` |string |예 |- |
| `isMock` |boolean |예 |- |
| `xrplNetwork` |object |예 |- |
| `xrplTxHash` |object |예 |- |
| `xrplLedgerIndex` |object |예 |- |
| `xrplEngineResult` |object |예 |- |
| `xrplValidated` |object |예 |- |
| `xrplCredentialType` |object |예 |- |

### ListCredentialsRes

| 필드 |타입 |필수 |설명 |
| --- |--- |--- |--- |
| `credentials` |CredentialSummaryRes[] |예 |- |

### CredentialSubmissionItemRes

| 필드 |타입 |필수 |설명 |
| --- |--- |--- |--- |
| `submissionId` |string |예 |- |
| `credentialId` |string |예 |- |
| `recipientInstitutionId` |string |예 |- |
| `recipientInstitutionName` |string |예 |- |
| `status` |enum(RECEIVED, VERIFYING, REJECTED) |예 |- |
| `rejectionReason` |object |예 |- |
| `submittedAt` |string |예 |- |
| `authEventId` |object |예 |- |

### ListCredentialSubmissionsRes

| 필드 |타입 |필수 |설명 |
| --- |--- |--- |--- |
| `submissions` |CredentialSubmissionItemRes[] |예 |- |

### CredentialDetailRes

| 필드 |타입 |필수 |설명 |
| --- |--- |--- |--- |
| `credentialId` |string |예 |- |
| `issueRequestId` |string |예 |- |
| `documentTypeId` |string |예 |- |
| `documentTypeName` |string |예 |- |
| `issuerId` |string |예 |- |
| `status` |enum(ISSUED, EXPIRED, REVOKED, FAILED) |예 |- |
| `issuedAt` |string |예 |- |
| `expiresAt` |string |예 |- |
| `walletAddress` |string |예 |- |
| `isMock` |boolean |예 |- |
| `xrplNetwork` |object |예 |- |
| `xrplTxHash` |object |예 |- |
| `xrplLedgerIndex` |object |예 |- |
| `xrplEngineResult` |object |예 |- |
| `xrplValidated` |object |예 |- |
| `xrplCredentialType` |object |예 |- |
| `pipeline` |IssuePipelineStageItemRes[] |예 |- |
| `submissions` |CredentialSubmissionItemRes[] |예 |- |
| `sourceDocumentRef` |object |예 |- |

### XrplCredentialTransactionRes

| 필드 |타입 |필수 |설명 |
| --- |--- |--- |--- |
| `transactionKind` |enum(CREATE, ACCEPT, DELETE) |예 |- |
| `network` |string |예 |- |
| `transaction` |object |예 |- |

### XrplCredentialEvidenceRes

| 필드 |타입 |필수 |설명 |
| --- |--- |--- |--- |
| `transactionKind` |enum(CREATE, ACCEPT, DELETE) |예 |- |
| `network` |string |예 |- |
| `transactionHash` |string |예 |- |
| `engineResult` |string |예 |- |
| `ledgerIndex` |object |예 |- |
| `validated` |boolean |예 |- |
| `feeDrops` |object |예 |- |
| `account` |string |예 |- |
| `issuer` |object |예 |- |
| `subject` |object |예 |- |
| `credentialType` |string |예 |- |
| `flags` |object |예 |- |
| `objectSnapshot` |object |예 |- |

### AcceptTestnetCredentialReq

| 필드 |타입 |필수 |설명 |
| --- |--- |--- |--- |
| `signedTransactionBlob` |string |예 |XRPL signed transaction blob generated by the subject wallet from the prepared CredentialAccept transaction. |

### PrepareDeleteTestnetCredentialReq

| 필드 |타입 |필수 |설명 |
| --- |--- |--- |--- |
| `submitterRole` |enum(SUBJECT, ISSUER) |예 |XLS-70 CredentialDelete signer role. SUBJECT signs with the credential holder wallet; ISSUER signs with the issuer wallet. |

### DeleteTestnetCredentialReq

| 필드 |타입 |필수 |설명 |
| --- |--- |--- |--- |
| `submitterRole` |enum(SUBJECT, ISSUER) |예 |XLS-70 CredentialDelete submitter. SUBJECT signs as the credential holder, ISSUER signs as the issuer. |
| `signedTransactionBlob` |string |예 |XRPL signed transaction blob generated by the selected submitter wallet from the prepared CredentialDelete transaction. |

### SubmitCredentialRes

| 필드 |타입 |필수 |설명 |
| --- |--- |--- |--- |
| `submissionId` |string |예 |- |
| `credentialId` |string |예 |- |
| `recipientInstitutionId` |string |예 |- |
| `status` |enum(RECEIVED, VERIFYING, REJECTED) |예 |- |
| `submittedAt` |string |예 |- |
| `authEventId` |object |예 |- |

### SubmitCredentialReq

| 필드 |타입 |필수 |설명 |
| --- |--- |--- |--- |
| `submissionRequestId` |string |예 |기관 제출 요청 ID |
| `consentConfirmed` |boolean |예 |기관 제출에 대한 사용자 동의 여부 |
| `authEventId` |string |아니오 |Auth 소유 인증 이벤트 ID. Credential은 참조만 저장한다. |

### TimelineEntryRes

| 필드 |타입 |필수 |설명 |
| --- |--- |--- |--- |
| `id` |string |예 |- |
| `status` |string |예 |- |
| `note` |object |아니오 |- |
| `operatorId` |object |아니오 |- |
| `isInternal` |boolean |예 |- |
| `createdAt` |string |예 |- |

### DisputeRes

| 필드 |타입 |필수 |설명 |
| --- |--- |--- |--- |
| `id` |string |예 |- |
| `status` |string |예 |- |
| `type` |string |예 |- |
| `requestId` |string |예 |- |
| `requesterId` |string |예 |- |
| `operatorId` |object |아니오 |- |
| `slaDeadline` |string |예 |- |
| `isSlaPaused` |boolean |예 |- |
| `timeline` |TimelineEntryRes[] |예 |- |
| `createdAt` |string |예 |- |

### CreateDisputeReq

| 필드 |타입 |필수 |설명 |
| --- |--- |--- |--- |
| `type` |enum(TYPO, IDENTITY_MISMATCH, DOCUMENT_INVALID, OTHER) |예 |- |
| `requestId` |string |예 |- |

### ChangeDisputeStatusReq

| 필드 |타입 |필수 |설명 |
| --- |--- |--- |--- |
| `newStatus` |enum(RECEIVED, ASSIGNED, IN_REVIEW, INFO_REQUESTED, RESOLVED, REJECTED) |예 |- |
| `note` |string |아니오 |- |
| `isInternal` |boolean |예 |- |
| `credentialCode` |string |아니오 |RESOLVED 시 필수 |

### CreateDocumentRes

| 필드 |타입 |필수 |설명 |
| --- |--- |--- |--- |
| `documentCode` |string |예 |발급 문서 외부 노출 코드 (UUID). 이후 상세 조회·SSE 키로 사용 |
| `documentTypeCode` |string |예 |신청한 문서 카탈로그 코드 |
| `status` |enum(PROGRESS, AWAITING_APPROVAL, VALID, EXPIRED, REVOKED, FAILED) |예 |신규 생성 직후이므로 항상 PROGRESS |
| `currentStage` |enum(AUTHORITY_ISSUED, DOCUMENT_ARRIVED, TRANSLATED_NOTARIZED, APOSTILLE_ISSUED, WALLET_STORED) |예 |신규 생성 직후이므로 항상 AUTHORITY_ISSUED |
| `requestedAt` |string |예 |발급 요청 시각 (ISO 8601, UTC) |

### CreateDocumentReq

| 필드 |타입 |필수 |설명 |
| --- |--- |--- |--- |
| `documentTypeCode` |string |예 |문서 카탈로그 코드 (DocumentType.code). 시드 예: KR-NTS-TAX-PAYMENT |

### ApproveDocumentRes

| 필드 |타입 |필수 |설명 |
| --- |--- |--- |--- |
| `documentCode` |string |예 |승인 처리된 문서의 외부 노출 코드 (UUID). |
| `approvedStage` |enum(AUTHORITY_ISSUED, DOCUMENT_ARRIVED, TRANSLATED_NOTARIZED, APOSTILLE_ISSUED, WALLET_STORED) |예 |이 승인이 통과시킨 다음 stage. AUTHORITY_ISSUED → DOCUMENT_ARRIVED, …, APOSTILLE_ISSUED → WALLET_STORED. |
| `xrplTxHash` |string |예 |사용자가 서명한 XRPL 트랜잭션 해시 (64자 hex). |
| `approvedAt` |string |예 |서명 컨펌 시각 (ISO 8601, UTC). |

### ApproveDocumentReq

| 필드 |타입 |필수 |설명 |
| --- |--- |--- |--- |
| `documentCode` |string |예 |발급 신청 시 서버가 발급한 문서 외부 코드 (UUID). documents.document_code 와 동일. |
| `xrplTxHash` |string |예 |사용자가 서명한 XRPL 트랜잭션 해시 · 64자 hex (대문자). document_approvals.xrpl_tx_hash 컬럼과 동일 형식. |

### AdvanceDocumentStageRes

| 필드 |타입 |필수 |설명 |
| --- |--- |--- |--- |
| `documentCode` |string |예 |전이 처리된 문서의 외부 노출 코드 (UUID). |
| `currentStage` |enum(AUTHORITY_ISSUED, DOCUMENT_ARRIVED, TRANSLATED_NOTARIZED, APOSTILLE_ISSUED, WALLET_STORED) |예 |전이 후 currentStage. AUTHORITY_ISSUED → DOCUMENT_ARRIVED → TRANSLATED_NOTARIZED → APOSTILLE_ISSUED → WALLET_STORED 순서로 1단계 전진. |
| `status` |enum(PROGRESS, AWAITING_APPROVAL, VALID, EXPIRED, REVOKED, FAILED) |예 |전이 후 status. WALLET_STORED 도달 시 VALID, 그 외에는 AWAITING_APPROVAL 유지. |
| `issuedAt` |object |예 |문서 발급 완료 시각 (ISO 8601, UTC). WALLET_STORED 도달 시점에만 채워진다. |

### AdvanceDocumentStageReq

| 필드 |타입 |필수 |설명 |
| --- |--- |--- |--- |
| `documentCode` |string |예 |발급 신청 시 서버가 발급한 문서 외부 코드 (UUID). documents.document_code 와 동일. |

### DocumentListItemRes

| 필드 |타입 |필수 |설명 |
| --- |--- |--- |--- |
| `documentCode` |string |예 |발급 문서 외부 코드 (UUID). 와이어프레임 컬럼 "요청번호". |
| `memberCode` |string |예 |요청한 사용자의 내부 회원 식별자 (User.id 문자열). 와이어프레임 컬럼 "회원번호". |
| `requesterName` |string |예 |요청자 이름. |
| `requesterEmail` |string |예 |요청자 이메일. |
| `documentTypeCode` |string |예 |문서 카탈로그 코드. |
| `documentTypeName` |string |예 |문서 카탈로그 표시명 (한국어). |
| `countryCode` |string |예 |발급기관 국가 코드 (ISO 3166-1 alpha-2). |
| `requestedAt` |string |예 |발급 요청 시각 (ISO 8601, UTC). |
| `status` |enum(PROGRESS, AWAITING_APPROVAL, VALID, EXPIRED, REVOKED, FAILED) |예 |문서 상태. |
| `currentStage` |enum(AUTHORITY_ISSUED, DOCUMENT_ARRIVED, TRANSLATED_NOTARIZED, APOSTILLE_ISSUED, WALLET_STORED) |예 |현재 stage. |

### DocumentListRes

| 필드 |타입 |필수 |설명 |
| --- |--- |--- |--- |
| `items` |DocumentListItemRes[] |예 |현재 페이지의 행 목록. |
| `total` |number |예 |필터 조건에 해당하는 전체 건수. |
| `page` |number |예 |현재 페이지 번호 (1-based). |
| `limit` |number |예 |페이지 크기. |

### UploadFileRes

| 필드 |타입 |필수 |설명 |
| --- |--- |--- |--- |
| `fileKey` |string |예 |버킷 내 객체 키. 향후 메타데이터 조회·삭제 API 식별자로 사용 가능. |
| `originalFileName` |string |예 |업로드 시 클라이언트가 보낸 원본 파일 이름(경로 구분자/제어 문자 sanitize 적용). |
| `contentType` |string |예 |저장된 객체의 Content-Type. 암호화 PDF 는 `application/pdf` 로 고정. |
| `size` |number |예 |저장된 객체 크기(byte). 암호화 PDF 는 원본보다 약간 커질 수 있다. |
| `downloadUri` |string |예 |백엔드 프록시 다운로드 URI — `/<documentCode>/files/<stage>` 형태. 이 값을 그대로 `Authorization: Bearer …` 와 함께 GET 호출하면 R2 객체가 스트리밍된다. |
| `encrypted` |boolean |예 |true 면 PDF open-password 가 걸려있어 다운로드 후 비밀번호 입력이 필요. |
| `uploadedAt` |string |예 |업로드 완료 시각 (ISO 8601, UTC). |

### DocumentStageDetailRes

| 필드 |타입 |필수 |설명 |
| --- |--- |--- |--- |
| `stage` |enum(AUTHORITY_ISSUED, DOCUMENT_ARRIVED, TRANSLATED_NOTARIZED, APOSTILLE_ISSUED, WALLET_STORED) |예 |단계 식별자. |
| `status` |enum(PENDING, IN_PROGRESS, DONE, FAILED) |예 |단계 진행 상태. null = 아직 시작 안 됨 (DocumentStage 이벤트 행 없음). |
| `startedAt` |string |예 |단계 시작 시각 (ISO 8601, UTC). |
| `completedAt` |string |예 |단계 완료 시각 (ISO 8601, UTC). |
| `failureReason` |string |예 |단계 실패 사유. |

### DocumentApprovalDetailRes

| 필드 |타입 |필수 |설명 |
| --- |--- |--- |--- |
| `stage` |enum(AUTHORITY_ISSUED, DOCUMENT_ARRIVED, TRANSLATED_NOTARIZED, APOSTILLE_ISSUED, WALLET_STORED) |예 |이 승인이 통과시킨 다음 stage. |
| `xrplTxHash` |string |예 |XRPL 트랜잭션 해시. |
| `approvedAt` |string |예 |서명 컨펌 시각 (ISO 8601, UTC). |

### DocumentDetailRes

| 필드 |타입 |필수 |설명 |
| --- |--- |--- |--- |
| `documentCode` |string |예 |발급 문서 외부 코드. |
| `memberCode` |string |예 |내부 회원 식별자 (User.id 문자열). |
| `requesterName` |string |예 |요청자 이름. |
| `requesterEmail` |string |예 |요청자 이메일. |
| `documentTypeCode` |string |예 |문서 카탈로그 코드. |
| `documentTypeName` |string |예 |문서 카탈로그 표시명. |
| `countryCode` |string |예 |발급기관 국가 코드. |
| `requestedAt` |string |예 |발급 요청 시각 (ISO 8601, UTC). |
| `issuedAt` |string |예 |발급 완료 시각 (WALLET_STORED 도달 시점). |
| `status` |enum(PROGRESS, AWAITING_APPROVAL, VALID, EXPIRED, REVOKED, FAILED) |예 |문서 상태. |
| `currentStage` |enum(AUTHORITY_ISSUED, DOCUMENT_ARRIVED, TRANSLATED_NOTARIZED, APOSTILLE_ISSUED, WALLET_STORED) |예 |현재 stage. |
| `currentSubstep` |enum(CREDENTIAL_GENERATING, AWAITING_USER_APPROVAL) |예 |진행 중인 sub-step. CREDENTIAL_GENERATING = 서버가 다음 stage 크리덴셜 준비 중 / AWAITING_USER_APPROVAL = 사용자 서명 대기 / null = sub-step 진행 없음 (terminal 또는 stage 막 전이된 직후). |
| `stages` |DocumentStageDetailRes[] |예 |5개 stage 의 이벤트 스냅샷 (AUTHORITY_ISSUED 부터 WALLET_STORED 순서로 항상 5건). status=null 인 항목은 아직 시작되지 않은 단계. |
| `approvals` |DocumentApprovalDetailRes[] |예 |사용자 승인 누적 (최대 4건). 여기에 stage=X 인 행이 있다면 "X 단계로의 전이를 사용자가 승인 완료" 라는 의미. |

## 참고 사항

- 이 문서는 OpenAPI 명세를 기준으로 자동 정리한 API 레퍼런스입니다.
- 실제 서버 동작, 인증 토큰 발급 방식, 비즈니스 규칙은 백엔드 구현/운영 정책에 따라 추가 확인이 필요할 수 있습니다.
- Swagger 문서가 갱신되면 이 파일도 다시 생성해야 최신 상태를 유지할 수 있습니다.
