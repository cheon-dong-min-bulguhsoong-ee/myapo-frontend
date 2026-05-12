const DEFAULT_API_BASE_URL = 'https://api.myapo.xyz'

export const MYAPO_ACCESS_TOKEN_STORAGE_KEY = 'myapo_access_token'
export const MYAPO_PENDING_DOCUMENT_TYPE_STORAGE_KEY = 'myapo_pending_document_type_code'
export const MYAPO_LATEST_DOCUMENT_CODE_STORAGE_KEY = 'myapo_latest_document_code'

type CommonRes<T> = {
  success: boolean
  code: string | null
  message: string | null
  data: T
}

export type MyApoRole = 'USER' | 'ADMIN' | 'INSTITUTION'

export interface MyApoWalletRes {
  xrplAddress: string
}

export interface MyApoAuthRes {
  id: string
  email: string
  name: string
  nationality: string
  role: MyApoRole
  createdAt: string
  wallet: MyApoWalletRes
  accessToken: string
}

export interface SignInReq {
  name?: string
  nationality?: string
  xrplAddress?: string
  publicKey?: string
}

export type PersonaType = 'KOREAN' | 'FOREIGNER'

export interface DocumentTypeListItemRes {
  code: string
  name: string
  englishName: string | null
  useCase: string | null
  defaultTtlMonths: number
  personaType: PersonaType
  issuerCode: string
  issuerName: string
  issuerCountryCode: string
  issuerIconLabel: string
}

export interface DocumentTypeListRes {
  items: DocumentTypeListItemRes[]
  total: number
}

export type DocumentMvpStatus = 'IN_PIPELINE' | 'AWAITING_USER_APPROVAL' | 'VALID' | 'FAILED'

export type DocumentMvpStage =
  | 'USER_DOC_REQUESTED'
  | 'AUTHORITY_DOC_ISSUED'
  | 'TRANSLATOR_DOC_RECEIVED'
  | 'TRANSLATOR_DOC_NOTARIZED'
  | 'APOSTILLE_DOC_ISSUED'

export type DocumentMvpStepStatus = 'PENDING' | 'DONE' | 'FAILED' | null

export interface CreateDocumentMvpReq {
  documentTypeCode: string
}

export interface CreateDocumentMvpRes {
  documentCode: string
  documentTypeCode: string
  status: DocumentMvpStatus
  statusLabel: string
  currentStage: DocumentMvpStage
  currentStageLabel: string
  currentStep: number
  currentStepLabel: string
  totalSteps: number
  requestedAt: string
}

export interface DocumentMvpUiStepRes {
  step: number
  label: string
  status: DocumentMvpStepStatus
  statusLabel: string | null
  startedAt: string | null
  completedAt: string | null
}

export interface DocumentMvpStageDetailRes {
  stage: DocumentMvpStage
  stageLabel: string
  status: DocumentMvpStepStatus
  statusLabel: string | null
  startedAt: string | null
  completedAt: string | null
  failureReason: string | null
}

export interface DocumentMvpDetailRes {
  documentCode: string
  documentTypeCode: string
  documentTypeName: string
  issuerName: string
  issuerIconLabel: string
  issuerCountryCode: string
  status: DocumentMvpStatus
  statusLabel: string
  currentStage: DocumentMvpStage
  currentStageLabel: string
  requestedAt: string
  issuedAt: string | null
  isSuccess: boolean
  uiSteps: DocumentMvpUiStepRes[]
  stages: DocumentMvpStageDetailRes[]
}

export interface DocumentMvpListItemRes {
  documentCode: string
  documentTypeCode: string
  documentTypeName: string
  issuerName: string
  issuerIconLabel: string
  issuerCountryCode: string
  status: DocumentMvpStatus
  statusLabel: string
  currentStage: DocumentMvpStage
  currentStageLabel: string
  currentStep: number
  currentStepLabel: string
  totalSteps: number
  requestedAt: string
  issuedAt: string | null
  isSuccess: boolean
}

export interface DocumentMvpListRes {
  items: DocumentMvpListItemRes[]
  total: number
}

export type DisputeStatus = 'RECEIVED' | 'ASSIGNED' | 'IN_REVIEW' | 'INFO_REQUESTED' | 'RESOLVED' | 'REJECTED'

export interface DisputeSummaryRes {
  id: string
  status: DisputeStatus
  type: string
  requestId: string
  operatorId: string | null
  slaDeadline: string
  createdAt: string
}

export interface ListDisputesRes {
  disputes: DisputeSummaryRes[]
}

interface MyApoRequestOptions extends Omit<RequestInit, 'headers'> {
  headers?: HeadersInit
  token?: string | null
}

export class MyApoApiError extends Error {
  readonly status: number
  readonly code: string | null

  constructor(message: string, status: number, code: string | null) {
    super(message)
    this.name = 'MyApoApiError'
    this.status = status
    this.code = code
  }
}

export function getMyApoApiBaseUrl() {
  return process.env.NEXT_PUBLIC_MYAPO_API_BASE_URL ?? DEFAULT_API_BASE_URL
}

export function getStoredMyApoAccessToken() {
  if (typeof window === 'undefined') return null
  return localStorage.getItem(MYAPO_ACCESS_TOKEN_STORAGE_KEY)
}

export function persistMyApoAccessToken(accessToken: string) {
  if (typeof window === 'undefined') return
  localStorage.setItem(MYAPO_ACCESS_TOKEN_STORAGE_KEY, accessToken)
}

export function clearMyApoAccessToken() {
  if (typeof window === 'undefined') return
  localStorage.removeItem(MYAPO_ACCESS_TOKEN_STORAGE_KEY)
}

export async function myApoRequest<T>(path: string, options: MyApoRequestOptions = {}): Promise<T> {
  const { token, headers, body, ...init } = options
  const isFormData = body instanceof FormData
  const requestHeaders = new Headers(headers)

  if (!isFormData && body !== undefined && !requestHeaders.has('Content-Type')) {
    requestHeaders.set('Content-Type', 'application/json')
  }

  if (token) {
    requestHeaders.set('Authorization', `Bearer ${token}`)
  }

  const response = await fetch(`${getMyApoApiBaseUrl()}${path}`, {
    ...init,
    body,
    headers: requestHeaders,
  })

  const payload = (await response.json().catch(() => null)) as CommonRes<T> | null
  if (!payload) {
    throw new MyApoApiError(`MyApo API error: ${response.status}`, response.status, null)
  }

  if (!response.ok || !payload.success) {
    throw new MyApoApiError(
      payload.message ?? `MyApo API error: ${response.status}`,
      response.status,
      payload.code,
    )
  }

  return payload.data
}

export function signInWithExternalToken(externalToken: string, body: SignInReq) {
  return myApoRequest<MyApoAuthRes>('/api/v1/auth/signin', {
    method: 'POST',
    token: externalToken,
    body: JSON.stringify(body),
  })
}

export function logoutFromMyApo(accessToken: string) {
  return myApoRequest<Record<string, never>>('/api/v1/auth/logout', {
    method: 'POST',
    token: accessToken,
  })
}

export function listDocumentTypes(accessToken: string, personaType: PersonaType = 'KOREAN') {
  const params = new URLSearchParams({ personaType })
  return myApoRequest<DocumentTypeListRes>(`/api/v1/documents/types?${params.toString()}`, {
    token: accessToken,
  })
}

export function createDocumentMvp(accessToken: string, body: CreateDocumentMvpReq) {
  return myApoRequest<CreateDocumentMvpRes>('/api/v1/document-mvp', {
    method: 'POST',
    token: accessToken,
    body: JSON.stringify(body),
  })
}

export function listDocumentMvp(accessToken: string) {
  return myApoRequest<DocumentMvpListRes>('/api/v1/document-mvp', {
    token: accessToken,
  })
}

export function getDocumentMvp(accessToken: string, documentCode: string) {
  return myApoRequest<DocumentMvpDetailRes>(`/api/v1/document-mvp/${encodeURIComponent(documentCode)}`, {
    token: accessToken,
  })
}

export function listDisputes(accessToken: string) {
  return myApoRequest<ListDisputesRes>('/api/v1/disputes', {
    token: accessToken,
  })
}
