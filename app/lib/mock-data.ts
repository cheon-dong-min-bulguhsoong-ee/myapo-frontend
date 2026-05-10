export interface Document {
  id: string
  type: string
  issuedAt: string
  expiresAt: string
  status: 'available' | 'expired'
  credentialId: string
  isExpiringSoon?: boolean
}

export interface Application {
  id: string
  documentType: string
  stage: number
  totalStages: number
  stageName: string
  stages: { label: string; status: 'done' | 'active' | 'wait' | 'error' }[]
  createdAt: string
}

export interface Dispute {
  id: string
  documentType: string
  stage: string
  reason: string
  status: 'received' | 'reviewing' | 'closed'
  createdAt: string
  operatorResponse?: string
}

export interface Institution {
  id: string
  name: string
  country: string
  code: string
}

export const mockDocuments: Document[] = [
  {
    id: 'doc-1',
    type: '납세증명서',
    issuedAt: '2026-03-01',
    expiresAt: '2026-06-01',
    status: 'available',
    credentialId: 'XRPL-A1B2C3',
    isExpiringSoon: true,
  },
  {
    id: 'doc-2',
    type: '가족관계증명서',
    issuedAt: '2026-02-15',
    expiresAt: '2026-05-15',
    status: 'available',
    credentialId: 'XRPL-D4E5F6',
  },
  {
    id: 'doc-3',
    type: '주민등록등본',
    issuedAt: '2025-10-01',
    expiresAt: '2026-01-01',
    status: 'expired',
    credentialId: 'XRPL-G7H8I9',
  },
]

export const mockApplications: Application[] = [
  {
    id: 'app-1',
    documentType: '납세증명서',
    stage: 2,
    totalStages: 4,
    stageName: '번역·공증 진행중',
    stages: [
      { label: '발급 신청', status: 'done' },
      { label: '번역·공증', status: 'active' },
      { label: '아포스티유', status: 'wait' },
      { label: '발급 완료', status: 'wait' },
    ],
    createdAt: '2026-05-08',
  },
  {
    id: 'app-2',
    documentType: '가족관계증명서',
    stage: 1,
    totalStages: 4,
    stageName: '발급 신청 완료',
    stages: [
      { label: '발급 신청', status: 'done' },
      { label: '번역·공증', status: 'wait' },
      { label: '아포스티유', status: 'wait' },
      { label: '발급 완료', status: 'wait' },
    ],
    createdAt: '2026-05-09',
  },
]

export const mockDisputes: Dispute[] = [
  {
    id: 'disp-1',
    documentType: '납세증명서',
    stage: '번역·공증',
    reason: '번역 오류',
    status: 'reviewing',
    createdAt: '2026-05-05',
    operatorResponse: '담당자가 검토 중입니다. 영업일 기준 7일 내 답변드리겠습니다.',
  },
  {
    id: 'disp-2',
    documentType: '주민등록등본',
    stage: '아포스티유',
    reason: '서류 분실',
    status: 'closed',
    createdAt: '2026-04-20',
    operatorResponse: '검토 결과 처리가 완료되었습니다.',
  },
]

export const mockInstitutions: Institution[] = [
  { id: 'inst-1', name: 'US Embassy Seoul', country: 'US', code: 'US-EMB-SEO' },
  { id: 'inst-2', name: 'Australian Immigration', country: 'AU', code: 'AU-IMM-001' },
  { id: 'inst-3', name: 'Canada IRCC', country: 'CA', code: 'CA-IRCC-01' },
]

export const documentCategories = [
  {
    id: 'tax',
    label: '세금',
    items: ['납세증명서', '소득금액증명', '사업자등록증명'],
  },
  {
    id: 'family',
    label: '가족관계',
    items: ['가족관계증명서', '혼인관계증명서', '출생신고서'],
  },
  {
    id: 'residence',
    label: '주거',
    items: ['주민등록등본', '주민등록초본'],
  },
  {
    id: 'education',
    label: '학력',
    items: ['졸업증명서', '성적증명서', '재학증명서'],
  },
  {
    id: 'employment',
    label: '직장',
    items: ['재직증명서', '경력증명서', '퇴직증명서'],
  },
  {
    id: 'criminal',
    label: '범죄·신원',
    items: ['범죄경력회보서', '신원조회서'],
  },
]

// A-01 wireframe doc list — flat, with issuer monogram + use-case + issuer code.
// Used by /issue/select via <DocCard>.
export type IssuerCode =
  | 'KR-NTS' | 'KR-법원' | 'KR-MOIS' | 'KR-병무청' | 'KR-경찰청' | 'KR-학교' | 'KR-건보'

export interface IssuableDocument {
  id: string
  name: string
  englishName?: string
  use: string
  issuerCode: IssuerCode
  issuerIcon: string
}

export const documentTypeToIssuableId: Record<string, string> = {
  '납세증명서': 'tax',
  '가족관계증명서': 'fam',
  '주민등록등본': 'res',
  '소득금액증명원': 'income',
  '사업자등록증명원': 'biz',
  '부동산등기부등본': 'land',
  '병적증명서': 'mil',
  '운전경력증명서': 'drv',
  '학력증명서': 'edu',
  '건강보험료납부확인서': 'health',
}

export const mockIssuableDocuments: IssuableDocument[] = [
  { id: 'fam',    name: '가족관계증명서 (영문)',       englishName: 'Family Relationship Cert.', use: '미국 이민국 결혼 증빙',       issuerCode: 'KR-법원',    issuerIcon: '법원' },
  { id: 'res',    name: '주민등록등본 (영문)',         englishName: 'Residence Cert.',           use: '거주증명 · 비자 보조',       issuerCode: 'KR-MOIS',    issuerIcon: 'MOIS' },
  { id: 'tax',    name: '납세증명서 (영문)',           englishName: 'Tax Payment Cert.',         use: '미국 영사관 비자 재정증명',   issuerCode: 'KR-NTS',     issuerIcon: 'NTS' },
  { id: 'income', name: '소득금액증명원 (영문)',       englishName: 'Income Cert.',              use: '비자 · 이민',                 issuerCode: 'KR-NTS',     issuerIcon: 'NTS' },
  { id: 'biz',    name: '사업자등록증명원',             englishName: 'Business Reg. Cert.',       use: '해외 법인 설립',              issuerCode: 'KR-NTS',     issuerIcon: 'NTS' },
  { id: 'land',   name: '부동산등기부등본',             englishName: 'Property Reg. Extract',     use: '자산증명',                    issuerCode: 'KR-법원',    issuerIcon: '법원' },
  { id: 'mil',    name: '병적증명서',                   englishName: 'Military Service Record',   use: '비자 · 이민 보조',            issuerCode: 'KR-병무청',  issuerIcon: '병무' },
  { id: 'drv',    name: '운전경력증명서',               englishName: 'Driving History Cert.',     use: '해외 면허 변환',              issuerCode: 'KR-경찰청',  issuerIcon: '경찰' },
  { id: 'edu',    name: '학력증명서 (영문)',           englishName: 'Academic Cert.',            use: '해외 취업 · 유학',           issuerCode: 'KR-학교',    issuerIcon: '학교' },
  { id: 'health', name: '건강보험료납부확인서 (영문)', englishName: 'Health Insurance Cert.',    use: '해외 비자 · 건강보험 증빙',  issuerCode: 'KR-건보',    issuerIcon: '건보' },
]
