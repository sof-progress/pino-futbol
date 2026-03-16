'use client';

import { usePathname } from 'next/navigation';
import { Header } from './Header';
import { Footer } from './Footer';

// Renderiza Header y Footer solo en las páginas públicas (no en /admin)
export function PublicLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const isAdmin = pathname.startsWith('/admin');

    if (isAdmin) {
        return <>{children}</>;
    }

    return (
        <>
            <Header />
            <main className="flex-1">{children}</main>
            <Footer />
        </>
    );
}
