# XRPL `signedTransactionBlob` 가이드

> 목적: 향후 AI 에이전트가 MyApo의 XRPL CredentialAccept / CredentialDelete API를 붙일 때 `signedTransactionBlob`을 어디서, 어떻게 얻는지 바로 이해하도록 남기는 실행 가이드입니다.

## 결론

`signedTransactionBlob`은 백엔드가 직접 만들어 주는 값이 아닙니다.

1. 백엔드 `prepare` API에서 서명 전 XRPL transaction JSON을 받습니다.
2. 프론트가 Web3Auth/XRPL 지갑 private key로 그 transaction을 서명합니다.
3. `xrpl` 라이브러리의 `wallet.sign(transaction)` 결과 중 `tx_blob`을 꺼냅니다.
4. 그 `tx_blob` 문자열을 MyApo API 요청 필드명 `signedTransactionBlob`에 넣어 제출합니다.

```ts
const { tx_blob: signedTransactionBlob, hash } = wallet.sign(prepared.transaction)
```

즉, 이름만 다릅니다.

| 위치 | 필드명 |
| --- | --- |
| `xrpl` 서명 결과 | `tx_blob` |
| MyApo API 요청 body | `signedTransactionBlob` |

`hash`는 UI 표시나 디버그 로그에 쓸 수 있지만 MyApo 제출 API에 보내는 값은 아닙니다. 백엔드는 signed transaction binary blob을 원합니다.

## 관련 API

`API_SPEC.md` 기준으로 현재 signed blob이 필요한 API는 2개입니다.

### CredentialAccept

1. `POST /api/v1/credentials/{credentialId}/xrpl/accept/prepare`
   - `InternalJwtBearer` 필요
   - request body 없음
   - response `data.transaction`이 서명할 XRPL transaction JSON입니다.
2. 프론트에서 `data.transaction`을 subject wallet으로 서명합니다.
3. `POST /api/v1/credentials/{credentialId}/xrpl/accept`
   - body:

```json
{
  "signedTransactionBlob": "12002F2280000000240000000168400000000000000C..."
}
```

### CredentialDelete

1. `POST /api/v1/credentials/{credentialId}/xrpl/delete/prepare`
   - `InternalJwtBearer` 필요
   - body:

```json
{
  "submitterRole": "SUBJECT"
}
```

2. 프론트에서 `data.transaction`을 `submitterRole`에 맞는 지갑으로 서명합니다.
   - `SUBJECT`: credential holder wallet
   - `ISSUER`: issuer wallet
3. `POST /api/v1/credentials/{credentialId}/xrpl/delete`
   - body:

```json
{
  "submitterRole": "SUBJECT",
  "signedTransactionBlob": "1200302280000000240000000168400000000000000C..."
}
```

## 현재 프론트에서 지갑 정보가 있는 곳

현재 앱은 `contexts/auth-context.tsx`에서 Web3Auth XRPL provider를 초기화합니다.

주요 흐름:

- `XrplPrivateKeyProvider`를 생성합니다.
- `setupProvider(pk)`를 후킹해 Web3Auth가 넘기는 XRPL private key를 캡처합니다.
- `provider.request({ method: 'xrpl_getAccounts' })`로 XRPL account 주소를 읽습니다.
- private key만 있고 주소/공개키가 비어 있으면 `Wallet.fromEntropy(bytes)`로 `classicAddress`와 `publicKey`를 파생합니다.
- 로그인 성공 후 `useAuth()`가 아래 값을 노출합니다.

```ts
const { accessToken, wallet } = useAuth()

wallet.address     // XRPL classic address
wallet.publicKey   // XRPL public key
wallet.privateKey  // Web3Auth에서 캡처한 hex private key, 데모 전용
```

주의: `wallet.privateKey`는 현재 데모 편의를 위해 `myapo_wallet` localStorage에도 저장됩니다. 운영 서비스에서 private key를 localStorage에 저장하면 XSS 한 번에 지갑이 털립니다. 운영 구현에서는 Web3Auth provider 또는 안전한 signer 경로로 교체하세요.

## 공식 XRPL 근거

이 문서의 핵심 매핑은 xrpl.js 공식 구현 기준입니다.

- `Wallet.sign()`은 `{ tx_blob, hash }`를 반환합니다. MyApo의 `signedTransactionBlob`에는 여기서 나온 `tx_blob`을 넣습니다.  
  <https://github.com/XRPLF/xrpl.js/blob/d739d47dfa57dbdf42b01e53abe65b9860e55b3c/packages/xrpl/src/Wallet/index.ts#L364-L428>
- `submitAndWait()` 계열 helper도 내부적으로 `wallet.sign(tx).tx_blob`을 사용합니다.  
  <https://github.com/XRPLF/xrpl.js/blob/d739d47dfa57dbdf42b01e53abe65b9860e55b3c/packages/xrpl/src/sugar/submit.ts#L225-L258>
- XRPL submit API의 필드명은 `tx_blob`입니다. `signedTransactionBlob`은 MyApo 백엔드 DTO 이름입니다.  
  <https://github.com/XRPLF/xrpl-dev-portal/blob/03dae02593d703c0e09b021b76f7766ca019d37f/docs/references/http-websocket-apis/public-api-methods/transaction-methods/submit.md#L18-L26>
- seed/private key를 백엔드나 신뢰할 수 없는 서버에 보내지 마세요. 서명은 지갑이 있는 쪽에서 수행합니다.  
  <https://github.com/XRPLF/xrpl-dev-portal/blob/03dae02593d703c0e09b021b76f7766ca019d37f/docs/concepts/transactions/secure-signing.md#L29-L46>

## 구현 패턴

아래 코드는 현재 앱 구조에서 바로 붙일 때의 형태입니다. 실제 helper를 만들 때는 `lib/myapo-api.ts`의 `myApoRequest<T>()`와 `useAuth()`를 사용하세요.

```ts
import { Wallet } from 'xrpl'

type XrplCredentialTransactionRes = {
  transactionKind: 'CREATE' | 'ACCEPT' | 'DELETE'
  network: string
  transaction: Record<string, unknown>
}

function walletFromWeb3AuthPrivateKey(privateKey: string) {
  const hex = privateKey.startsWith('0x') ? privateKey.slice(2) : privateKey
  const bytes = new Uint8Array(hex.length / 2)

  for (let i = 0; i < bytes.length; i += 1) {
    bytes[i] = parseInt(hex.slice(i * 2, i * 2 + 2), 16)
  }

  return Wallet.fromEntropy(bytes)
}

async function getAcceptSignedTransactionBlob(params: {
  accessToken: string
  credentialId: string
  privateKey: string
}) {
  const prepared = await myApoRequest<XrplCredentialTransactionRes>(
    `/api/v1/credentials/${encodeURIComponent(params.credentialId)}/xrpl/accept/prepare`,
    { method: 'POST', token: params.accessToken },
  )

  const wallet = walletFromWeb3AuthPrivateKey(params.privateKey)
  const { tx_blob: signedTransactionBlob } = wallet.sign(prepared.transaction)

  return signedTransactionBlob
}
```

제출까지 한 번에 하면 이렇게 됩니다.

```ts
async function acceptCredentialOnXrpl(params: {
  accessToken: string
  credentialId: string
  privateKey: string
}) {
  const signedTransactionBlob = await getAcceptSignedTransactionBlob(params)

  return myApoRequest(
    `/api/v1/credentials/${encodeURIComponent(params.credentialId)}/xrpl/accept`,
    {
      method: 'POST',
      token: params.accessToken,
      body: JSON.stringify({ signedTransactionBlob }),
    },
  )
}
```

Delete는 `submitterRole`을 prepare와 submit에 모두 넣는 것만 다릅니다.

```ts
async function deleteCredentialOnXrpl(params: {
  accessToken: string
  credentialId: string
  privateKey: string
  submitterRole: 'SUBJECT' | 'ISSUER'
}) {
  const prepared = await myApoRequest<XrplCredentialTransactionRes>(
    `/api/v1/credentials/${encodeURIComponent(params.credentialId)}/xrpl/delete/prepare`,
    {
      method: 'POST',
      token: params.accessToken,
      body: JSON.stringify({ submitterRole: params.submitterRole }),
    },
  )

  const wallet = walletFromWeb3AuthPrivateKey(params.privateKey)
  const { tx_blob: signedTransactionBlob } = wallet.sign(prepared.transaction)

  return myApoRequest(
    `/api/v1/credentials/${encodeURIComponent(params.credentialId)}/xrpl/delete`,
    {
      method: 'POST',
      token: params.accessToken,
      body: JSON.stringify({
        submitterRole: params.submitterRole,
        signedTransactionBlob,
      }),
    },
  )
}
```

## AI 에이전트용 체크리스트

`signedTransactionBlob` 연동을 구현할 때는 이 순서로 진행하세요.

1. 로그인 상태에서 `useAuth()`로 `accessToken`과 `wallet.privateKey`가 있는지 확인합니다.
2. `wallet.address`와 prepare 응답의 `transaction.Account`가 같은 signer인지 확인합니다.
3. accept면 `/accept/prepare`, delete면 `/delete/prepare`를 호출합니다.
4. prepare 응답의 `data.transaction`을 그대로 `wallet.sign(transaction)`에 넣습니다.
5. `signed.tx_blob`을 `signedTransactionBlob` 변수에 담습니다. `signed.hash`가 아닙니다.
6. accept면 `/accept`, delete면 `/delete`에 `signedTransactionBlob`을 제출합니다.
7. 응답 `XrplCredentialEvidenceRes`의 `transactionHash`, `engineResult`, `validated`를 화면/로그에 저장합니다.

## 자주 하는 실수

- `signedTransactionBlob`을 prepare 응답에서 찾으려고 하지 마세요. prepare 응답은 서명 전 transaction입니다.
- `signed.hash`를 보내지 마세요. 백엔드가 요구하는 값은 hash가 아니라 `tx_blob`입니다.
- Web3Auth private key나 XRPL seed를 MyApo 백엔드에 보내지 마세요. 백엔드는 서명된 blob만 받아야 합니다.
- prepare 받은 transaction의 `Account`, `Fee`, `Sequence`, `LastLedgerSequence`를 프론트에서 임의로 바꾸지 마세요. 바꾸면 백엔드가 만든 payload와 사용자가 서명한 payload가 달라집니다.
- `delete`에서 `submitterRole`을 prepare와 submit에 다르게 보내지 마세요.
- private key를 새 기능에서 추가로 localStorage에 저장하지 마세요. 현재 저장은 데모 레거시입니다.

## 검증 방법

최소 검증:

```ts
const signed = wallet.sign(prepared.transaction)

if (!signed.tx_blob || typeof signed.tx_blob !== 'string') {
  throw new Error('XRPL signed tx_blob was not generated')
}
```

권장 검증:

- `prepared.network`가 XRPL Testnet인지 확인합니다.
- `prepared.transactionKind`가 호출한 prepare API와 맞는지 확인합니다.
- `prepared.transaction.Account`가 signer 지갑 주소와 맞는지 확인합니다.
- submit 응답의 `validated === true` 또는 `engineResult` 성공 값을 확인합니다.

## 관련 파일

| 파일 | 읽어야 하는 이유 |
| --- | --- |
| `API_SPEC.md` | accept/delete prepare 및 submit API의 정확한 request/response 계약 |
| `docs/HANDOFF_SPEC.md` | 현재 앱의 인증, Web3Auth, XRPL 설정 요약 |
| `contexts/auth-context.tsx` | `useAuth()`가 노출하는 `wallet.privateKey`, `wallet.address`, `accessToken` 생성 흐름 |
| `lib/myapo-api.ts` | MyApo API 요청 wrapper, access token 저장 규칙 |
| `package.json` | `xrpl` 패키지 버전 확인 |
