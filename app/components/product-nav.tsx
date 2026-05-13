import Link from 'next/link';

type ProductNavKey =
    | 'app'
    | 'domestic-issuer'
    | 'translator'
    | 'apostille'
    | 'overseas-receiver'
    | 'console';

const navItems: Array<{ key: ProductNavKey; label: string; href: string }> = [
    { key: 'app', label: '앱', href: '/login?next=/home' },
    { key: 'domestic-issuer', label: '국내발급기관', href: '/wireframes/institution-kr.html' },
    { key: 'translator', label: '번역공증사', href: '/wireframes/institution-translator.html' },
    { key: 'apostille', label: '아포스티유', href: '/wireframes/institution-apostille.html' },
    { key: 'overseas-receiver', label: '해외 수령기관', href: '/wireframes/institution-overseas.html' },
    { key: 'console', label: '콘솔', href: '/wireframes/console.html' },
];

interface ProductNavProps {
    active?: ProductNavKey;
}

export function ProductNav({ active = 'app' }: ProductNavProps) {
    return (
        <nav className="product-nav" aria-label="MyApo 페이지 네비게이션">
            <Link href="/" className="product-brand" aria-label="MyApo 홈">
                <span className="product-brand-mark" aria-hidden />
                <span>MyApo</span>
            </Link>
            <div className="product-tabs" role="list">
                {navItems.map((item) => {
                    const isActive = item.key === active;

                    if (isActive) {
                        return (
                            <Link
                                key={item.key}
                                href={item.href}
                                className="product-tab active"
                                aria-current="page"
                            >
                                {item.label}
                            </Link>
                        );
                    }

                    return (
                        <a key={item.key} href={item.href} className="product-tab">
                            {item.label}
                        </a>
                    );
                })}
            </div>
        </nav>
    );
}
