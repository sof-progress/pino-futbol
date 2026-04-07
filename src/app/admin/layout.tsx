'use client';

import { useState } from 'react';
import { usePathname } from 'next/navigation';
import { AuthProvider } from '@/lib/auth-provider';
import { AdminSidebar } from './components/AdminSidebar';
import { AdminHeader } from './components/AdminHeader';

export const dynamic = 'force-dynamic';

// Layout del panel de administración — completamente independiente de la web pública
export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const pathname = usePathname();

    // La página de login tiene su propio layout sin sidebar ni header
    const isLoginPage = pathname === '/admin/login';

    if (isLoginPage) {
        return (
            <AuthProvider>
                <div className="min-h-screen bg-background">
                    {children}
                </div>
            </AuthProvider>
        );
    }

    return (
        <AuthProvider>
            <div className="min-h-screen bg-background text-white">
                <AdminSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

                {/* Contenido principal con offset del sidebar */}
                <div className="lg:ml-64 flex flex-col min-h-screen">
                    <AdminHeader onMenuToggle={() => setSidebarOpen(!sidebarOpen)} />
                    <main className="flex-1 p-4 lg:p-6">
                        {children}
                    </main>
                </div>
            </div>
        </AuthProvider>
    );
}
