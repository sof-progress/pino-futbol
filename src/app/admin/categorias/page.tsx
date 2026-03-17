import prisma from '@/lib/prisma';
import Link from 'next/link';
import { CategoriaRow } from './CategoriaRow';
import type { Metadata } from 'next';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
    title: 'Categorías — Pino Fútbol Admin',
    robots: 'noindex, nofollow',
};

export default async function CategoriasPage() {
    const categorias = await prisma.category.findMany({
        orderBy: { createdAt: 'asc' },
        include: {
            _count: {
                select: {
                    teams: true,
                    matches: true,
                },
            },
        },
    });

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-white">Categorías</h1>
                    <p className="text-zinc-500 text-sm mt-1">Gestión de categorías del torneo</p>
                </div>
                <Link
                    href="/admin/categorias/nueva"
                    className="px-4 py-2 bg-[#39ff14] text-black font-bold text-sm rounded-xl hover:bg-[#39ff14]/90 transition-all"
                >
                    + Nueva categoría
                </Link>
            </div>

            {/* Tabla */}
            <div className="bg-[#111] border border-zinc-800 rounded-2xl overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b border-zinc-800">
                                <th className="text-left px-6 py-4 text-zinc-500 font-medium">Nombre</th>
                                <th className="text-left px-6 py-4 text-zinc-500 font-medium">Temporada</th>
                                <th className="text-center px-6 py-4 text-zinc-500 font-medium">Equipos</th>
                                <th className="text-center px-6 py-4 text-zinc-500 font-medium">Partidos</th>
                                <th className="text-right px-6 py-4 text-zinc-500 font-medium">Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {categorias.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-12 text-center text-zinc-600">
                                        No hay categorías registradas
                                    </td>
                                </tr>
                            ) : (
                                categorias.map((cat) => (
                                    <CategoriaRow
                                        key={cat.id}
                                        id={cat.id}
                                        name={cat.name}
                                        season={cat.season}
                                        teamsCount={cat._count.teams}
                                        matchesCount={cat._count.matches}
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
