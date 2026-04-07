import prisma from '@/lib/prisma';
import Link from 'next/link';
import { JugadorRow } from './JugadorRow';
import { JugadorFilter } from './JugadorFilter';
import type { Metadata } from 'next';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
    title: 'Jugadores — Pino Fútbol Admin',
    robots: 'noindex, nofollow',
};

interface JugadoresPageProps {
    searchParams: Promise<{ equipo?: string }>;
}

export default async function JugadoresPage({ searchParams }: JugadoresPageProps) {
    const { equipo } = await searchParams;

    const equipos = await prisma.team.findMany({
        orderBy: { name: 'asc' },
        select: { id: true, name: true },
    });

    const jugadores = await prisma.player.findMany({
        where: equipo ? { teamId: equipo } : undefined,
        orderBy: [{ lastName: 'asc' }, { name: 'asc' }],
        include: {
            team: { select: { name: true } },
        },
    });

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between flex-wrap gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-white">Jugadores</h1>
                    <p className="text-brand-secondary text-sm mt-1">Gestión de jugadores</p>
                </div>
                <Link
                    href="/admin/jugadores/nuevo"
                    className="px-4 py-2 bg-[var(--brand-primary)] text-black font-bold text-sm rounded-xl hover:bg-[var(--brand-primary)]/90 transition-all"
                >
                    + Nuevo jugador
                </Link>
            </div>

            <JugadorFilter equipos={equipos} selectedEquipo={equipo || ''} />

            <div className="bg-surface border border-surface-border rounded-2xl overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b border-surface-border">
                                <th className="text-left px-6 py-4 text-brand-secondary font-medium">Nombre completo</th>
                                <th className="text-left px-6 py-4 text-brand-secondary font-medium">Posición</th>
                                <th className="text-left px-6 py-4 text-brand-secondary font-medium">Equipo</th>
                                <th className="text-right px-6 py-4 text-brand-secondary font-medium">Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {jugadores.length === 0 ? (
                                <tr>
                                    <td colSpan={4} className="px-6 py-12 text-center text-brand-secondary">
                                        No hay jugadores registrados
                                    </td>
                                </tr>
                            ) : (
                                jugadores.map((j) => (
                                    <JugadorRow
                                        key={j.id}
                                        id={j.id}
                                        name={j.name}
                                        lastName={j.lastName}
                                        position={j.position}
                                        teamName={j.team.name}
                                    />
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
