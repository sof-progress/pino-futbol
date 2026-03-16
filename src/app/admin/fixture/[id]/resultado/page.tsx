import { notFound } from 'next/navigation';
import prisma from '@/lib/prisma';
import { ResultadoForm } from './ResultadoForm';
import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Cargar Resultado — Pino Fútbol Admin',
    robots: 'noindex, nofollow',
};

interface ResultadoPageProps {
    params: Promise<{ id: string }>;
}

export default async function ResultadoPage({ params }: ResultadoPageProps) {
    const { id } = await params;

    const partido = await prisma.match.findUnique({
        where: { id },
        include: {
            homeTeam: { select: { name: true } },
            awayTeam: { select: { name: true } },
            venue: { select: { name: true } },
        },
    });

    if (!partido) {
        notFound();
    }

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-white">Cargar resultado</h1>
                <p className="text-zinc-500 text-sm mt-1">
                    Jornada {partido.round || '—'} — {new Date(partido.date).toLocaleDateString('es-AR')}
                    {(partido.venue?.name || partido.field) && (
                        <> — {partido.venue?.name || partido.field}</>
                    )}
                </p>
            </div>
            <ResultadoForm
                matchId={partido.id}
                homeTeamName={partido.homeTeam.name}
                awayTeamName={partido.awayTeam.name}
                currentHomeScore={partido.homeScore}
                currentAwayScore={partido.awayScore}
            />
        </div>
    );
}
