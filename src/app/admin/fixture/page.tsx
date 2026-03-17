import prisma from '@/lib/prisma';
import Link from 'next/link';
import { FixtureRow } from './FixtureRow';
import { FixtureFilter } from './FixtureFilter';
import type { Metadata } from 'next';
import type { MatchStatus } from '@prisma/client';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
    title: 'Fixture — Pino Fútbol Admin',
    robots: 'noindex, nofollow',
};

interface FixturePageProps {
    searchParams: Promise<{ categoria?: string; estado?: string }>;
}

export default async function FixtureAdminPage({ searchParams }: FixturePageProps) {
    const { categoria, estado } = await searchParams;

    const categorias = await prisma.category.findMany({
        orderBy: { name: 'asc' },
        select: { id: true, name: true },
    });

    // Construir filtro dinámico
    const where: Record<string, unknown> = {};
    if (categoria) where.categoryId = categoria;
    if (estado) where.status = estado as MatchStatus;

    const partidos = await prisma.match.findMany({
        where,
        orderBy: [{ date: 'desc' }, { round: 'asc' }],
        include: {
            homeTeam: { select: { name: true } },
            awayTeam: { select: { name: true } },
        },
    });

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between flex-wrap gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-white">Fixture</h1>
                    <p className="text-zinc-500 text-sm mt-1">Gestión de partidos del torneo</p>
                </div>
                <Link
                    href="/admin/fixture/nuevo"
                    className="px-4 py-2 bg-[#39ff14] text-black font-bold text-sm rounded-xl hover:bg-[#39ff14]/90 transition-all"
                >
                    + Nuevo partido
                </Link>
            </div>

            <FixtureFilter
                categorias={categorias}
                selectedCategoria={categoria || ''}
                selectedEstado={estado || ''}
            />

            <div className="bg-[#111] border border-zinc-800 rounded-2xl overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b border-zinc-800">
                                <th className="px-6 py-4 text-zinc-500 font-medium text-center">Fecha #</th>
                                <th className="text-left px-6 py-4 text-zinc-500 font-medium">Día</th>
                                <th className="text-left px-6 py-4 text-zinc-500 font-medium">Partido</th>
                                <th className="px-6 py-4 text-zinc-500 font-medium text-center">Resultado</th>
                                <th className="px-6 py-4 text-zinc-500 font-medium text-center">Estado</th>
                                <th className="text-right px-6 py-4 text-zinc-500 font-medium">Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {partidos.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="px-6 py-12 text-center text-zinc-600">
                                        No hay partidos registrados
                                    </td>
                                </tr>
                            ) : (
                                partidos.map((p) => (
                                    <FixtureRow
                                        key={p.id}
                                        id={p.id}
                                        round={p.round}
                                        date={p.date}
                                        homeTeamName={p.homeTeam.name}
                                        awayTeamName={p.awayTeam.name}
                                        homeScore={p.homeScore}
                                        awayScore={p.awayScore}
                                        status={p.status}
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
