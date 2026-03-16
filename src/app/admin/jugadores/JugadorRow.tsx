'use client';

import { useState, useTransition } from 'react';
import Link from 'next/link';
import { eliminarJugador } from '../actions/jugadores';
import { ConfirmDialog } from '../components/ConfirmDialog';

const positionLabels: Record<string, string> = {
    GOALKEEPER: 'Arquero',
    DEFENDER: 'Defensor',
    MIDFIELDER: 'Mediocampista',
    FORWARD: 'Delantero',
};

interface JugadorRowProps {
    id: string;
    name: string;
    lastName: string | null;
    position: string | null;
    teamName: string;
}

export function JugadorRow({ id, name, lastName, position, teamName }: JugadorRowProps) {
    const [showConfirm, setShowConfirm] = useState(false);
    const [isPending, startTransition] = useTransition();
    const [error, setError] = useState('');

    const fullName = [name, lastName].filter(Boolean).join(' ');

    const handleDelete = () => {
        startTransition(async () => {
            const result = await eliminarJugador(id);
            if (result.error) {
                setError(result.error);
                setShowConfirm(false);
            }
        });
    };

    return (
        <>
            <tr className="border-b border-zinc-800/50 hover:bg-zinc-900/30 transition-colors">
                <td className="px-6 py-4 text-white font-medium">{fullName}</td>
                <td className="px-6 py-4 text-zinc-400">
                    {position ? positionLabels[position] || position : '—'}
                </td>
                <td className="px-6 py-4 text-zinc-400">{teamName}</td>
                <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                        <Link
                            href={`/admin/jugadores/${id}/editar`}
                            className="px-3 py-1.5 text-xs text-zinc-400 hover:text-white bg-zinc-800 hover:bg-zinc-700 rounded-lg transition-all"
                        >
                            Editar
                        </Link>
                        <button
                            onClick={() => setShowConfirm(true)}
                            className="px-3 py-1.5 text-xs text-zinc-400 hover:text-red-400 bg-zinc-800 hover:bg-red-500/10 rounded-lg transition-all"
                        >
                            Eliminar
                        </button>
                    </div>
                    {error && <p className="text-xs text-red-400 mt-1">{error}</p>}
                </td>
            </tr>

            <ConfirmDialog
                open={showConfirm}
                title="Eliminar jugador"
                message={`¿Estás seguro de que querés eliminar a "${fullName}"?`}
                onConfirm={handleDelete}
                onCancel={() => setShowConfirm(false)}
                loading={isPending}
            />
        </>
    );
}
