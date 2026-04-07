'use client';

import { useState, useTransition } from 'react';
import Link from 'next/link';
import { eliminarEquipo } from '../actions/equipos';
import { ConfirmDialog } from '../components/ConfirmDialog';

interface EquipoRowProps {
    id: string;
    name: string;
    neighborhood: string;
    categoryName: string;
}

export function EquipoRow({ id, name, neighborhood, categoryName }: EquipoRowProps) {
    const [showConfirm, setShowConfirm] = useState(false);
    const [isPending, startTransition] = useTransition();
    const [error, setError] = useState('');

    const handleDelete = () => {
        startTransition(async () => {
            const result = await eliminarEquipo(id);
            if (result.error) {
                setError(result.error);
                setShowConfirm(false);
            }
        });
    };

    return (
        <>
            <tr className="border-b border-surface-border/50 hover:bg-zinc-900/30 transition-colors">
                <td className="px-6 py-4 text-white font-medium">{name}</td>
                <td className="px-6 py-4 text-brand-secondary">{neighborhood}</td>
                <td className="px-6 py-4 text-brand-secondary">{categoryName}</td>
                <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                        <Link
                            href={`/admin/equipos/${id}/editar`}
                            className="px-3 py-1.5 text-xs text-brand-secondary hover:text-white bg-zinc-800 hover:bg-zinc-700 rounded-lg transition-all"
                        >
                            Editar
                        </Link>
                        <button
                            onClick={() => setShowConfirm(true)}
                            className="px-3 py-1.5 text-xs text-brand-secondary hover:text-red-400 bg-zinc-800 hover:bg-red-500/10 rounded-lg transition-all"
                        >
                            Eliminar
                        </button>
                    </div>
                    {error && <p className="text-xs text-red-400 mt-1">{error}</p>}
                </td>
            </tr>

            <ConfirmDialog
                open={showConfirm}
                title="Eliminar equipo"
                message={`¿Estás seguro de que querés eliminar el equipo "${name}"? Se eliminarán también sus jugadores y posiciones.`}
                onConfirm={handleDelete}
                onCancel={() => setShowConfirm(false)}
                loading={isPending}
            />
        </>
    );
}
