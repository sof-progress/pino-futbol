'use client';

import { SessionProvider } from 'next-auth/react';
import type { ReactNode } from 'react';

interface AuthProviderProps {
    children: ReactNode;
}

// Wrapper del SessionProvider para usar en el layout del admin
export function AuthProvider({ children }: AuthProviderProps) {
    return <SessionProvider>{children}</SessionProvider>;
}
