import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Login — Pino Fútbol Admin',
    robots: 'noindex, nofollow',
};

// Layout simple para la página de login (sin sidebar ni header admin)
export default function LoginLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}
