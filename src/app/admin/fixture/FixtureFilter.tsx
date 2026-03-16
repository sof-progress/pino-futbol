'use client';

import { useRouter } from 'next/navigation';

interface FixtureFilterProps {
    categorias: { id: string; name: string }[];
    selectedCategoria: string;
    selectedEstado: string;
}

export function FixtureFilter({ categorias, selectedCategoria, selectedEstado }: FixtureFilterProps) {
    const router = useRouter();

    const buildUrl = (cat: string, estado: string) => {
        const params = new URLSearchParams();
        if (cat) params.set('categoria', cat);
        if (estado) params.set('estado', estado);
        const qs = params.toString();
        return `/admin/fixture${qs ? `?${qs}` : ''}`;
    };

    return (
        <div className="flex items-center gap-4 flex-wrap">
            <div className="flex items-center gap-2">
                <label className="text-sm text-zinc-400">Categoría:</label>
                <select
                    value={selectedCategoria}
                    onChange={(e) => router.push(buildUrl(e.target.value, selectedEstado))}
                    className="px-4 py-2 bg-[#0a0a0a] border border-zinc-800 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-[#39ff14]/40"
                >
                    <option value="">Todas</option>
                    {categorias.map((cat) => (
                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                </select>
            </div>
            <div className="flex items-center gap-2">
                <label className="text-sm text-zinc-400">Estado:</label>
                <select
                    value={selectedEstado}
                    onChange={(e) => router.push(buildUrl(selectedCategoria, e.target.value))}
                    className="px-4 py-2 bg-[#0a0a0a] border border-zinc-800 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-[#39ff14]/40"
                >
                    <option value="">Todos</option>
                    <option value="SCHEDULED">Programado</option>
                    <option value="LIVE">En Vivo</option>
                    <option value="FINISHED">Finalizado</option>
                    <option value="SUSPENDED">Suspendido</option>
                </select>
            </div>
        </div>
    );
}
