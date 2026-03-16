'use client';

import { useState, useTransition } from 'react';
import Link from 'next/link';
import { eliminarPartido } from '../actions/fixture';
import { ConfirmDialog } from '../components/ConfirmDialog';

interface FixtureRowProps {
    id: string;
    round: number | null;
    date: Date;
    homeTeamName: string;
    awayTeamName: string;
    homeScore: number;
    awayScore: number;
    status: string;
}

const statusLabels: Record<string, { label: string; className: string }> = {
    SCHEDULED: { label: 'Programado', className: 'bg-blue-500/10 text-blue-400' },
    LIVE: { label: 'En Vivo', className: 'bg-emerald-500/10 text-emerald-400' },
    FINISHED: { label: 'Finalizado', className: 'bg-zinc-800 text-zinc-400' },
    SUSPENDED: { label: 'Suspendido', className: 'bg-amber-500/10 text-amber-400' },
};

export function FixtureRow({ id, round, date, homeTeamName, awayTeamName, homeScore, awayScore, status }: FixtureRowProps) {
    const [showConfirm, setShowConfirm] = useState(false);
    const [isPending, startTransition] = useTransition();
    const [error, setError] = useState('');

    const handleDelete = () => {
        startTransition(async () => {
            const result = await eliminarPartido(id);
            if (result.error) {
                setError(result.error);
                setShowConfirm(false);
            }
        });
    };

    const statusInfo = statusLabels[status] || { label: status, className: 'bg-zinc-800 text-zinc-400' };

    return (
        <>
            <tr className="border-b border-zinc-800/50 hover:bg-zinc-900/30 transition-colors">
                <td className="px-6 py-4 text-zinc-400 text-center">{round || '—'}</td>
                <td className="px-6 py-4 text-zinc-400">
                    {new Date(date).toLocaleDateString('es-AR', { day: '2-digit', month: '2-digit', year: '2-digit' })}
                </td>
                <td className="px-6 py-4 text-white font-medium">
                    {homeTeamName} <span className="text-zinc-500">vs</span> {awayTeamName}
                </td>
                <td className="px-6 py-4 text-center text-white font-bold">
                    {status === 'FINISHED' ? `${homeScore} - ${awayScore}` : '— - —'}
                </td>
                <td className="px-6 py-4 text-center">
                    <span className={`inline-block px-2.5 py-1 text-xs font-medium rounded-full ${statusInfo.className}`}>
                        {statusInfo.label}
                    </span>
                </td>
                <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                        <Link
                            href={`/admin/fixture/${id}/editar`}
                            className="px-3 py-1.5 text-xs text-blue-400 bg-blue-500/10 hover:bg-blue-500/20 rounded-lg transition-all"
                        >
                            Editar
                        </Link>
                        {status !== 'FINISHED' && (
                            <Link
                                href={`/admin/fixture/${id}/resultado`}
                                className="px-3 py-1.5 text-xs text-[#39ff14] bg-[#39ff14]/10 hover:bg-[#39ff14]/20 rounded-lg transition-all"
                            >
                                Cargar resultado
                            </Link>
                        )}
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
                title="Eliminar partido"
                message={`¿Estás seguro de que querés eliminar ${homeTeamName} vs ${awayTeamName}? Si era un partido finalizado, se recalcularán las posiciones.`}
                onConfirm={handleDelete}
                onCancel={() => setShowConfirm(false)}
                loading={isPending}
            />
        </>
    );
}
