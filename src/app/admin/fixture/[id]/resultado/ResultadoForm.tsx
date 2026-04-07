'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { guardarResultado } from '../../../actions/fixture';
import { FormMessage } from '../../../components/FormMessage';
import Link from 'next/link';

interface ResultadoFormProps {
    matchId: string;
    homeTeamName: string;
    awayTeamName: string;
    currentHomeScore: number;
    currentAwayScore: number;
}

// Formulario para cargar resultado de un partido
export function ResultadoForm({ matchId, homeTeamName, awayTeamName, currentHomeScore, currentAwayScore }: ResultadoFormProps) {
    const router = useRouter();
    const [isPending, startTransition] = useTransition();
    const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

    const handleSubmit = (formData: FormData) => {
        setMessage(null);
        startTransition(async () => {
            const result = await guardarResultado(matchId, formData);
            if (result.error) {
                setMessage({ type: 'error', text: result.error });
            } else if (result.success) {
                setMessage({ type: 'success', text: result.success });
                setTimeout(() => router.push('/admin/fixture'), 1500);
            }
        });
    };

    return (
        <form action={handleSubmit} className="bg-surface border border-surface-border rounded-2xl p-6 space-y-6 max-w-md">
            {message && <FormMessage type={message.type} message={message.text} />}

            {/* Visual del partido */}
            <div className="text-center py-4">
                <div className="flex items-center justify-center gap-6">
                    <div className="text-right flex-1">
                        <p className="text-white font-bold text-lg">{homeTeamName}</p>
                        <p className="text-xs text-brand-secondary">Local</p>
                    </div>
                    <span className="text-zinc-600 text-2xl font-bold">VS</span>
                    <div className="text-left flex-1">
                        <p className="text-white font-bold text-lg">{awayTeamName}</p>
                        <p className="text-xs text-brand-secondary">Visitante</p>
                    </div>
                </div>
            </div>

            {/* Goles */}
            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <label htmlFor="golesLocal" className="block text-sm font-medium text-brand-secondary text-center">
                        Goles {homeTeamName}
                    </label>
                    <input
                        id="golesLocal"
                        name="golesLocal"
                        type="number"
                        min="0"
                        required
                        defaultValue={currentHomeScore}
                        className="w-full px-4 py-3 bg-background border border-surface-border rounded-xl text-white text-center text-2xl font-bold focus:outline-none focus:ring-2 focus:ring-brand-primary/40 transition-all"
                    />
                </div>
                <div className="space-y-2">
                    <label htmlFor="golesVisitante" className="block text-sm font-medium text-brand-secondary text-center">
                        Goles {awayTeamName}
                    </label>
                    <input
                        id="golesVisitante"
                        name="golesVisitante"
                        type="number"
                        min="0"
                        required
                        defaultValue={currentAwayScore}
                        className="w-full px-4 py-3 bg-background border border-surface-border rounded-xl text-white text-center text-2xl font-bold focus:outline-none focus:ring-2 focus:ring-brand-primary/40 transition-all"
                    />
                </div>
            </div>

            <p className="text-xs text-zinc-600 text-center">
                Al guardar, el partido se marcará como FINALIZADO y se recalculará la tabla de posiciones.
            </p>

            {/* Botones */}
            <div className="flex gap-3 pt-2">
                <button
                    type="submit"
                    disabled={isPending}
                    className="flex-1 px-6 py-3 bg-brand-primary text-black font-bold text-sm rounded-xl hover:bg-brand-primary/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isPending ? 'Guardando...' : 'Guardar resultado'}
                </button>
                <Link
                    href="/admin/fixture"
                    className="px-6 py-3 text-brand-secondary hover:text-white bg-zinc-800 hover:bg-zinc-700 text-sm rounded-xl transition-all flex items-center"
                >
                    Cancelar
                </Link>
            </div>
        </form>
    );
}
