import prisma from '@/lib/prisma';
import { EquipoForm } from '../components/EquipoForm';
import type { Metadata } from 'next';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
    title: 'Nuevo Equipo — Pino Fútbol Admin',
    robots: 'noindex, nofollow',
};

export default async function NuevoEquipoPage() {
    const categorias = await prisma.category.findMany({
        orderBy: { name: 'asc' },
        select: { id: true, name: true },
    });

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-white">Nuevo equipo</h1>
                <p className="text-brand-secondary text-sm mt-1">Registrar un nuevo equipo en el torneo</p>
            </div>
            <EquipoForm categorias={categorias} />
        </div>
    );
}
