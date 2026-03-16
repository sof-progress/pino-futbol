'use client';

import { signOut, useSession } from 'next-auth/react';

interface AdminHeaderProps {
    onMenuToggle: () => void;
}

export function AdminHeader({ onMenuToggle }: AdminHeaderProps) {
    const { data: session } = useSession();

    return (
        <header className="h-16 bg-[#0d0d0d] border-b border-zinc-800 flex items-center justify-between px-4 lg:px-6">
            {/* Botón menú mobile */}
            <button
                onClick={onMenuToggle}
                className="lg:hidden p-2 text-zinc-400 hover:text-white transition-colors rounded-lg hover:bg-zinc-800"
                aria-label="Abrir menú"
            >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="18" x2="21" y2="18" />
                </svg>
            </button>

            {/* Spacer para desktop */}
            <div className="hidden lg:block" />

            {/* Info del usuario y botón cerrar sesión */}
            <div className="flex items-center gap-4">
                {session?.user?.email && (
                    <span className="text-sm text-zinc-400 hidden sm:block">
                        {session.user.email}
                    </span>
                )}
                <button
                    onClick={() => signOut({ callbackUrl: '/admin/login' })}
                    className="flex items-center gap-2 px-4 py-2 text-sm text-zinc-400 hover:text-red-400 hover:bg-red-500/10 rounded-xl transition-all border border-transparent hover:border-red-500/20"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" />
                    </svg>
                    Cerrar sesión
                </button>
            </div>
        </header>
    );
}
