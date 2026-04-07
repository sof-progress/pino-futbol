'use client';

import { useState, useTransition } from 'react';
import Link from 'next/link';
import { eliminarCategoria } from '../actions/categorias';
import { ConfirmDialog } from '../components/ConfirmDialog';

interface CategoriaRowProps {
    id: string;
    name: string;
    season: string | null;
    teamsCount: number;
    matchesCount: number;
}

export function CategoriaRow({ id, name, season, teamsCount, matchesCount }: CategoriaRowProps) {
    const [showConfirm, setShowConfirm] = useState(false);
    const [isPending, startTransition] = useTransition();
    const [error, setError] = useState('');

    const handleDelete = () => {
        startTransition(async () => {
            const result = await eliminarCategoria(id);
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
                <td className="px-6 py-4 text-brand-secondary">{season || '—'}</td>
                <td className="px-6 py-4 text-center text-brand-secondary">{teamsCount}</td>
                <td className="px-6 py-4 text-center text-brand-secondary">{matchesCount}</td>
                <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                        <Link
                            href={`/admin/categorias/${id}/editar`}
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
                title="Eliminar categoría"
                message={`¿Estás seguro de que querés eliminar la categoría "${name}"? Esta acción no se puede deshacer.`}
                onConfirm={handleDelete}
                onCancel={() => setShowConfirm(false)}
                loading={isPending}
            />
        </>
    );
}
