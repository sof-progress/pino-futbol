import prisma from '@/lib/prisma';
import { JugadorForm } from '../components/JugadorForm';
import type { Metadata } from 'next';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
    title: 'Nuevo Jugador — Pino Fútbol Admin',
    robots: 'noindex, nofollow',
};

export default async function NuevoJugadorPage() {
    const equipos = await prisma.team.findMany({
        orderBy: { name: 'asc' },
        select: { id: true, name: true },
    });

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-white">Nuevo jugador</h1>
                <p className="text-brand-secondary text-sm mt-1">Registrar un nuevo jugador</p>
            </div>
            <JugadorForm equipos={equipos} />
        </div>
    );
}
