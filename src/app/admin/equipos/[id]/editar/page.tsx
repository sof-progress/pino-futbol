import { notFound } from 'next/navigation';
import prisma from '@/lib/prisma';
import { EquipoForm } from '../../components/EquipoForm';
import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Editar Equipo — Pino Fútbol Admin',
    robots: 'noindex, nofollow',
};

interface EditarEquipoPageProps {
    params: Promise<{ id: string }>;
}

export default async function EditarEquipoPage({ params }: EditarEquipoPageProps) {
    const { id } = await params;

    const [equipo, categorias] = await Promise.all([
        prisma.team.findUnique({ where: { id } }),
        prisma.category.findMany({
            orderBy: { name: 'asc' },
            select: { id: true, name: true },
        }),
    ]);

    if (!equipo) {
        notFound();
    }

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-white">Editar equipo</h1>
                <p className="text-zinc-500 text-sm mt-1">Modificar &ldquo;{equipo.name}&rdquo;</p>
            </div>
            <EquipoForm
                equipoId={equipo.id}
                categorias={categorias}
                initialData={{
                    nombre: equipo.name,
                    barrio: equipo.neighborhood,
                    categoriaId: equipo.categoryId,
                    logoUrl: equipo.logoUrl || '',
                }}
            />
        </div>
    );
}
