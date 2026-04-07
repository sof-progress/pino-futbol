'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function AdminLoginPage() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        // Validación básica del formulario
        if (!email.trim() || !password.trim()) {
            setError('Email y contraseña son obligatorios');
            setLoading(false);
            return;
        }

        try {
            const result = await signIn('credentials', {
                email,
                password,
                redirect: false,
            });

            if (result?.error) {
                setError('Credenciales inválidas. Verificá tu email y contraseña.');
            } else {
                router.push('/admin');
                router.refresh();
            }
        } catch {
            setError('Error de conexión. Intentá nuevamente.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-background px-4">
            <div className="w-full max-w-md">
                {/* Logo / Cabecera */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-[var(--brand-primary)]/10 border border-[var(--brand-primary)]/20 mb-4">
                        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--brand-primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                        </svg>
                    </div>
                    <h1 className="text-2xl font-bold text-white font-[var(--font-display)]">
                        Panel de Administración
                    </h1>
                    <p className="text-brand-secondary mt-1 text-sm">
                        Pino Fútbol — AIFB Río Gallegos
                    </p>
                </div>

                {/* Formulario de Login */}
                <form onSubmit={handleSubmit} className="bg-surface border border-surface-border rounded-2xl p-8 space-y-6 shadow-2xl">
                    {/* Mensaje de error */}
                    {error && (
                        <div className="bg-red-500/10 border border-red-500/30 rounded-xl px-4 py-3 text-red-400 text-sm flex items-center gap-2">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <circle cx="12" cy="12" r="10" />
                                <line x1="12" y1="8" x2="12" y2="12" />
                                <line x1="12" y1="16" x2="12.01" y2="16" />
                            </svg>
                            {error}
                        </div>
                    )}

                    {/* Email */}
                    <div className="space-y-2">
                        <label htmlFor="email" className="block text-sm font-medium text-brand-secondary">
                            Email
                        </label>
                        <input
                            id="email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="admin@aifb.com"
                            required
                            className="w-full px-4 py-3 bg-background border border-surface-border rounded-xl text-white placeholder-brand-secondary focus:outline-none focus:ring-2 focus:ring-[var(--brand-primary)]/40 focus:border-[var(--brand-primary)]/40 transition-all"
                        />
                    </div>

                    {/* Contraseña */}
                    <div className="space-y-2">
                        <label htmlFor="password" className="block text-sm font-medium text-brand-secondary">
                            Contraseña
                        </label>
                        <input
                            id="password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="••••••••"
                            required
                            className="w-full px-4 py-3 bg-background border border-surface-border rounded-xl text-white placeholder-brand-secondary focus:outline-none focus:ring-2 focus:ring-[var(--brand-primary)]/40 focus:border-[var(--brand-primary)]/40 transition-all"
                        />
                    </div>

                    {/* Botón de envío */}
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-3 px-4 bg-[var(--brand-primary)] text-black font-bold rounded-xl hover:bg-[var(--brand-primary)]/90 focus:outline-none focus:ring-2 focus:ring-[var(--brand-primary)]/50 focus:ring-offset-2 focus:ring-offset-[#111] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? (
                            <span className="flex items-center justify-center gap-2">
                                <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                </svg>
                                Ingresando...
                            </span>
                        ) : (
                            'Ingresar'
                        )}
                    </button>
                </form>

                <p className="text-center text-zinc-700 text-xs mt-6">
                    Solo administradores autorizados
                </p>
            </div>
        </div>
    );
}
