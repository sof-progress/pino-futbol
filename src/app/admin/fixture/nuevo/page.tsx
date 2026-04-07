import prisma from '@/lib/prisma';
import { NuevoPartidoForm } from '../components/NuevoPartidoForm';
import type { Metadata } from 'next';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
    title: 'Nuevo Partido — Pino Fútbol Admin',
    robots: 'noindex, nofollow',
};

export default async function NuevoPartidoPage() {
    const categorias = await prisma.category.findMany({
        orderBy: { name: 'asc' },
        select: { id: true, name: true },
    });

    // Cargar todos los equipos agrupados por categoría para los selects dinámicos
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

    // Cargar canchas
    const canchas = await prisma.venue.findMany({
        orderBy: { name: 'asc' },
        select: { id: true, name: true },
    });

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-white">Nuevo partido</h1>
                <p className="text-brand-secondary text-sm mt-1">Programar un nuevo encuentro</p>
            </div>
            <NuevoPartidoForm
                categorias={categorias}
                equiposPorCategoria={equiposPorCategoria}
                canchas={canchas}
            />
        </div>
    );
}
