'use client';

import { useRouter } from 'next/navigation';

interface EquipoFilterProps {
    categorias: { id: string; name: string }[];
    selectedCategoria: string;
}

export function EquipoFilter({ categorias, selectedCategoria }: EquipoFilterProps) {
    const router = useRouter();

    const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const value = e.target.value;
        if (value) {
            router.push(`/admin/equipos?categoria=${value}`);
        } else {
            router.push('/admin/equipos');
        }
    };

    return (
        <div className="flex items-center gap-3">
            <label className="text-sm text-brand-secondary">Filtrar por categoría:</label>
            <select
                value={selectedCategoria}
                onChange={handleChange}
                className="px-4 py-2 bg-background border border-surface-border rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-[var(--brand-primary)]/40"
            >
                <option value="">Todas</option>
                {categorias.map((cat) => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
            </select>
        </div>
    );
}
