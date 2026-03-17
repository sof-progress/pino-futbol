import prisma from '@/lib/prisma';
import Link from 'next/link';
import { NoticiaRow } from './NoticiaRow';
import type { Metadata } from 'next';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
    title: 'Noticias — Pino Fútbol Admin',
    robots: 'noindex, nofollow',
};

export default async function NoticiasAdminPage() {
    const noticias = await prisma.news.findMany({
        orderBy: { date: 'desc' },
    });

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between flex-wrap gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-white">Noticias</h1>
                    <p className="text-zinc-500 text-sm mt-1">Gestión de noticias de la asociación</p>
                </div>
                <Link
                    href="/admin/noticias/nueva"
                    className="px-4 py-2 bg-[#39ff14] text-black font-bold text-sm rounded-xl hover:bg-[#39ff14]/90 transition-all"
                >
                    + Nueva noticia
                </Link>
            </div>

            <div className="bg-[#111] border border-zinc-800 rounded-2xl overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b border-zinc-800">
                                <th className="text-left px-6 py-4 text-zinc-500 font-medium">Título</th>
                                <th className="text-left px-6 py-4 text-zinc-500 font-medium">Fecha</th>
                                <th className="px-6 py-4 text-zinc-500 font-medium text-center">Estado</th>
                                <th className="text-right px-6 py-4 text-zinc-500 font-medium">Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {noticias.length === 0 ? (
                                <tr>
                                    <td colSpan={4} className="px-6 py-12 text-center text-zinc-600">
                                        No hay noticias registradas
                                    </td>
                                </tr>
                            ) : (
                                noticias.map((n) => (
                                    <NoticiaRow
                                        key={n.id}
                                        id={n.id}
                                        title={n.title}
                                        date={n.date}
                                        published={n.published}
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
