import prisma from '@/lib/prisma';
import Link from 'next/link';
import { EquipoRow } from './EquipoRow';
import { EquipoFilter } from './EquipoFilter';
import type { Metadata } from 'next';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
    title: 'Equipos — Pino Fútbol Admin',
    robots: 'noindex, nofollow',
};

interface EquiposPageProps {
    searchParams: Promise<{ categoria?: string }>;
}

export default async function EquiposPage({ searchParams }: EquiposPageProps) {
    const { categoria } = await searchParams;

    const categorias = await prisma.category.findMany({
        orderBy: { name: 'asc' },
        select: { id: true, name: true },
    });

    const equipos = await prisma.team.findMany({
        where: categoria ? { categoryId: categoria } : undefined,
        orderBy: { name: 'asc' },
        include: {
            category: { select: { name: true } },
        },
    });

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between flex-wrap gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-white">Equipos</h1>
                    <p className="text-brand-secondary text-sm mt-1">Gestión de equipos del torneo</p>
                </div>
                <Link
                    href="/admin/equipos/nuevo"
                    className="px-4 py-2 bg-[var(--brand-primary)] text-black font-bold text-sm rounded-xl hover:bg-[var(--brand-primary)]/90 transition-all"
                >
                    + Nuevo equipo
                </Link>
            </div>

            {/* Filtro por categoría */}
            <EquipoFilter
                categorias={categorias}
                selectedCategoria={categoria || ''}
            />

            {/* Tabla */}
            <div className="bg-surface border border-surface-border rounded-2xl overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b border-surface-border">
                                <th className="text-left px-6 py-4 text-brand-secondary font-medium">Nombre</th>
                                <th className="text-left px-6 py-4 text-brand-secondary font-medium">Barrio</th>
                                <th className="text-left px-6 py-4 text-brand-secondary font-medium">Categoría</th>
                                <th className="text-right px-6 py-4 text-brand-secondary font-medium">Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {equipos.length === 0 ? (
                                <tr>
                                    <td colSpan={4} className="px-6 py-12 text-center text-brand-secondary">
                                        No hay equipos registrados
                                    </td>
                                </tr>
                            ) : (
                                equipos.map((equipo) => (
                                    <EquipoRow
                                        key={equipo.id}
                                        id={equipo.id}
                                        name={equipo.name}
                                        neighborhood={equipo.neighborhood}
                                        categoryName={equipo.category.name}
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
