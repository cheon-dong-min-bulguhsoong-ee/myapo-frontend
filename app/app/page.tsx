import Link from 'next/link';
import { ProductNav } from '@/components/product-nav';


const serviceCards = [
    {
        id: 'domestic-issuer',
        title: '국내발급기관',
        description:
            '정부·학교·공공기관이 문서 발급 주체와 상태를 표준화합니다.',
        meta: 'Issue · Verify',
        href: '/wireframes/institution-kr.html',
        cta: '발급기관 와이어프레임 열기',
        stats: [
            '7개 발급기관',
            '10개 문서 타입',
            'Pre-check',
        ],
        rows: [
            {
                label: 'KR-NTS',
                title: '납세증명서',
                status: '발급 가능',
            },
            {
                label: 'KR-법원',
                title: '가족관계증명서',
                status: '영문 지원',
            },
            {
                label: 'KR-MOIS',
                title: '주민등록등본',
                status: '신원 확인',
            },
        ],
    },
    {
        id: 'translator',
        title: '번역공증사',
        description:
            '번역·공증 단계의 담당자와 검증 기록을 한 흐름에 남깁니다.',
        meta: 'Translate · Notarize',
        href: '/wireframes/institution-translator.html',
        cta: '번역공증사 와이어프레임 열기',
        stats: ['접수', '공증', '서명 요청'],
        rows: [
            {
                label: 'STEP 2',
                title: '번역·공증 진행중',
                status: '담당자 처리',
            },
            {
                label: 'SIGN',
                title: '외교부 인증 전송 승인',
                status: '사용자 확인',
            },
            {
                label: 'LOG',
                title: '공증 기록 저장',
                status: '검증 완료',
            },
        ],
    },
    {
        id: 'apostille',
        title: '아포스티유',
        description:
            '외교부 인증 처리와 문서 단계 증빙을 사용자에게 투명하게 보여줍니다.',
        meta: 'Apostille · Track',
        href: '/wireframes/institution-apostille.html',
        cta: '아포스티유 와이어프레임 열기',
        stats: ['KR-MFA', 'Credential', '완료 대기'],
        rows: [
            {
                label: 'STEP 3',
                title: '외교부 인증 접수',
                status: '검토 중',
            },
            {
                label: 'VERIFY',
                title: '발급 주체·공증 이력 확인',
                status: '자동 검증',
            },
            {
                label: 'ISSUE',
                title: '내 지갑으로 발급',
                status: '대기',
            },
        ],
    },
    {
        id: 'overseas-receiver',
        title: '해외 수령기관',
        description:
            '해외 금융·행정기관은 제출된 증명 번들의 출처와 이력을 확인합니다.',
        meta: 'Receive · Review',
        href: '/wireframes/institution-overseas.html',
        cta: '수령기관 제출 보기',
        stats: ['기관 요청', '전송 상태', '접수 확인'],
        rows: [
            {
                label: 'REQ',
                title: '기관 제출 요청',
                status: '선택 필요',
            },
            {
                label: 'BUNDLE',
                title: '증명 번들 전송',
                status: '진행 중',
            },
            {
                label: 'RECEIPT',
                title: '기관 접수 확인',
                status: '완료',
            },
        ],
    },
];

export default function Root() {
    return (
        <main className="product-shell">
            <ProductNav active="app" />

            <section className="product-hero">
                <div className="product-kicker">
                    Digital apostille workflow
                </div>
                <h1>
                    국제 문서 신뢰 인프라,
                    <br />
                    <span>MyApo</span>
                </h1>
                <p>
                    XRPL 기반 검증 기록으로 문서 발급과 제출
                    과정을 투명하게 관리합니다.
                </p>
                <div className="product-actions">
                    <Link
                        href="/login?next=/home"
                        className="product-primary-action"
                    >
                        앱으로 이동
                    </Link>
                    <a
                        href="#domestic-issuer"
                        className="product-secondary-action"
                    >
                        참여기관 보기
                    </a>
                </div>
            </section>

            <section
                className="product-grid"
                aria-label="MyApo 참여자"
            >
                {serviceCards.map((card) => (
                    <article
                        key={card.id}
                        id={card.id}
                        className="product-card product-wireframe-card"
                    >
                        <div className="product-card-copy">
                            <span className="product-card-meta">
                                {card.meta}
                            </span>
                            <h2>{card.title}</h2>
                            <p>{card.description}</p>
                            <a
                                href={card.href}
                                className="product-card-link"
                            >
                                {card.cta}
                            </a>
                        </div>
                        <div
                            className="product-wireframe"
                            aria-label={`${card.title} 와이어프레임 미리보기`}
                        >
                            <div className="product-wireframe-bar">
                                <span />
                                <strong>
                                    {card.title}
                                </strong>
                                <em>{card.meta}</em>
                            </div>
                            <div className="product-wireframe-stats">
                                {card.stats.map((stat) => (
                                    <span key={stat}>
                                        {stat}
                                    </span>
                                ))}
                            </div>
                            <div className="product-wireframe-list">
                                {card.rows.map((row) => (
                                    <div
                                        key={`${row.label}-${row.title}`}
                                        className="product-wireframe-row"
                                    >
                                        <b>{row.label}</b>
                                        <span>
                                            {row.title}
                                        </span>
                                        <small>
                                            {row.status}
                                        </small>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </article>
                ))}
                <article
                    id="console"
                    className="product-card product-card-ink"
                >
                    <span className="product-card-meta">
                        Console · Operate
                    </span>
                    <h2>콘솔</h2>
                    <p>
                        운영자는 단계별 처리 현황, 제출
                        요청, 이의 신청을 한 화면에서 관리할
                        수 있습니다.
                    </p>
                    <a
                        href="/wireframes/console.html"
                        className="product-card-link product-card-link-dark"
                    >
                        콘솔 후보 화면 열기
                    </a>
                </article>
            </section>
        </main>
    );
}
