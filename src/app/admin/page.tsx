import prisma from '@/lib/prisma';
import Link from 'next/link';
import type { Metadata } from 'next';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
    title: 'Dashboard — Pino Fútbol Admin',
    robots: 'noindex, nofollow',
};

// Tarjeta de resumen para el dashboard
function StatCard({
    title,
    value,
    icon,
    href,
    color,
}: {
    title: string;
    value: number;
    icon: React.ReactNode;
    href: string;
    color: string;
}) {
    return (
        <Link
            href={href}
            className="bg-[#111] border border-zinc-800 rounded-2xl p-6 hover:border-zinc-700 transition-all group"
        >
            <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${color}`}>
                    {icon}
                </div>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-zinc-700 group-hover:text-zinc-400 transition-colors">
                    <polyline points="9 18 15 12 9 6" />
                </svg>
            </div>
            <p className="text-3xl font-bold text-white mb-1">{value}</p>
            <p className="text-sm text-zinc-500">{title}</p>
        </Link>
    );
}

export default async function AdminDashboardPage() {
    // Obtener datos reales de Supabase para las tarjetas de resumen
    const [totalEquipos, partidosJugados, proximosPartidos, totalNoticias] = await Promise.all([
        prisma.team.count(),
        prisma.match.count({ where: { status: 'FINISHED' } }),
        prisma.match.count({ where: { status: 'SCHEDULED' } }),
        prisma.news.count({ where: { published: true } }),
    ]);

    return (
        <div className="space-y-8">
            {/* Título */}
            <div>
                <h1 className="text-2xl font-bold text-white">Dashboard</h1>
                <p className="text-zinc-500 text-sm mt-1">
                    Resumen general de la plataforma
                </p>
            </div>

            {/* Tarjetas de resumen */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
                <StatCard
                    title="Equipos registrados"
                    value={totalEquipos}
                    href="/admin/equipos"
                    color="bg-blue-500/10 text-blue-400"
                    icon={
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" />
                        </svg>
                    }
                />
                <StatCard
                    title="Partidos jugados"
                    value={partidosJugados}
                    href="/admin/fixture"
                    color="bg-emerald-500/10 text-emerald-400"
                    icon={
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
                        </svg>
                    }
                />
                <StatCard
                    title="Próximos partidos"
                    value={proximosPartidos}
                    href="/admin/fixture"
                    color="bg-amber-500/10 text-amber-400"
                    icon={
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" />
                        </svg>
                    }
                />
                <StatCard
                    title="Noticias publicadas"
                    value={totalNoticias}
                    href="/admin/noticias"
                    color="bg-purple-500/10 text-purple-400"
                    icon={
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" />
                        </svg>
                    }
                />
            </div>

            {/* Accesos directos */}
            <div>
                <h2 className="text-lg font-semibold text-white mb-4">Accesos rápidos</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {[
                        { label: 'Nueva categoría', href: '/admin/categorias/nueva', icon: '📁' },
                        { label: 'Nuevo equipo', href: '/admin/equipos/nuevo', icon: '⚽' },
                        { label: 'Nuevo partido', href: '/admin/fixture/nuevo', icon: '📅' },
                        { label: 'Nuevo jugador', href: '/admin/jugadores/nuevo', icon: '🏃' },
                        { label: 'Nueva noticia', href: '/admin/noticias/nueva', icon: '📝' },
                        { label: 'Ver posiciones', href: '/posiciones', icon: '🏆' },
                    ].map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            className="flex items-center gap-3 px-4 py-3 bg-[#111] border border-zinc-800 rounded-xl hover:border-zinc-700 hover:bg-zinc-900/50 transition-all text-sm text-zinc-300 hover:text-white"
                        >
                            <span className="text-lg">{item.icon}</span>
                            {item.label}
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
}
