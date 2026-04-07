'use client';

import { useRouter } from 'next/navigation';

interface JugadorFilterProps {
    equipos: { id: string; name: string }[];
    selectedEquipo: string;
}

export function JugadorFilter({ equipos, selectedEquipo }: JugadorFilterProps) {
    const router = useRouter();

    const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const value = e.target.value;
        if (value) {
            router.push(`/admin/jugadores?equipo=${value}`);
        } else {
            router.push('/admin/jugadores');
        }
    };

    return (
        <div className="flex items-center gap-3">
            <label className="text-sm text-brand-secondary">Filtrar por equipo:</label>
            <select
                value={selectedEquipo}
                onChange={handleChange}
                className="px-4 py-2 bg-background border border-surface-border rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-[var(--brand-primary)]/40"
            >
                <option value="">Todos</option>
                {equipos.map((eq) => (
                    <option key={eq.id} value={eq.id}>{eq.name}</option>
                ))}
            </select>
        </div>
    );
}
