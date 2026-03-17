import { notFound } from 'next/navigation';
import prisma from '@/lib/prisma';
import { EditarPartidoForm } from './EditarPartidoForm';
import type { Metadata } from 'next';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
    title: 'Editar Partido — Pino Fútbol Admin',
    robots: 'noindex, nofollow',
};

interface EditarPageProps {
    params: Promise<{ id: string }>;
}

export default async function EditarPartidoPage({ params }: EditarPageProps) {
    const { id } = await params;

    const partido = await prisma.match.findUnique({
        where: { id },
        include: {
            homeTeam: { select: { id: true, name: true } },
            awayTeam: { select: { id: true, name: true } },
            category: { select: { id: true, name: true } },
            venue: { select: { id: true, name: true } },
        },
    });

    if (!partido) {
        notFound();
    }

    const categorias = await prisma.category.findMany({
        orderBy: { name: 'asc' },
        select: { id: true, name: true },
    });

    const equipos = await prisma.team.findMany({
        orderBy: { name: 'asc' },
        select: { id: true, name: true, categoryId: true },
    });

    const equiposPorCategoria: Record<string, { id: string; name: string }[]> = {};
    for (const equipo of equipos) {
        if (!equiposPorCategoria[equipo.categoryId]) {
            equiposPorCategoria[equipo.categoryId] = [];
        }
        equiposPorCategoria[equipo.categoryId].push({ id: equipo.id, name: equipo.name });
    }

    const canchas = await prisma.venue.findMany({
        orderBy: { name: 'asc' },
        select: { id: true, name: true },
    });

    // Formatear la fecha para datetime-local input (YYYY-MM-DDTHH:MM)
    const fechaLocal = new Date(partido.date);
    const fechaFormateada = fechaLocal.toISOString().slice(0, 16);

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-white">Editar partido</h1>
                <p className="text-zinc-500 text-sm mt-1">
                    {partido.homeTeam.name} vs {partido.awayTeam.name}
                </p>
            </div>
            <EditarPartidoForm
                matchId={partido.id}
                categorias={categorias}
                equiposPorCategoria={equiposPorCategoria}
                canchas={canchas}
                defaultValues={{
                    categoriaId: partido.categoryId,
                    equipoLocalId: partido.homeTeamId,
                    equipoVisitanteId: partido.awayTeamId,
                    fecha: fechaFormateada,
                    venueId: partido.venueId || '',
                    canchaTextoLibre: partido.field || '',
                    jornada: partido.round?.toString() || '',
                }}
            />
        </div>
    );
}
