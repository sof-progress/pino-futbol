import { notFound } from 'next/navigation';
import prisma from '@/lib/prisma';
import { JugadorForm } from '../../components/JugadorForm';
import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Editar Jugador — Pino Fútbol Admin',
    robots: 'noindex, nofollow',
};

interface EditarJugadorPageProps {
    params: Promise<{ id: string }>;
}

export default async function EditarJugadorPage({ params }: EditarJugadorPageProps) {
    const { id } = await params;

    const [jugador, equipos] = await Promise.all([
        prisma.player.findUnique({ where: { id } }),
        prisma.team.findMany({
            orderBy: { name: 'asc' },
            select: { id: true, name: true },
        }),
    ]);

    if (!jugador) {
        notFound();
    }

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-white">Editar jugador</h1>
                <p className="text-zinc-500 text-sm mt-1">
                    Modificar &ldquo;{[jugador.name, jugador.lastName].filter(Boolean).join(' ')}&rdquo;
                </p>
            </div>
            <JugadorForm
                jugadorId={jugador.id}
                equipos={equipos}
                initialData={{
                    nombre: jugador.name,
                    apellido: jugador.lastName || '',
                    dni: jugador.dni || '',
                    posicion: jugador.position || '',
                    equipoId: jugador.teamId,
                }}
            />
        </div>
    );
}
