'use client';

import { useState, useTransition } from 'react';
import Link from 'next/link';
import { eliminarNoticia, togglePublicacion } from '../actions/noticias';
import { ConfirmDialog } from '../components/ConfirmDialog';

interface NoticiaRowProps {
    id: string;
    title: string;
    date: Date;
    published: boolean;
}

export function NoticiaRow({ id, title, date, published }: NoticiaRowProps) {
    const [showConfirm, setShowConfirm] = useState(false);
    const [isPending, startTransition] = useTransition();
    const [error, setError] = useState('');

    const handleDelete = () => {
        startTransition(async () => {
            const result = await eliminarNoticia(id);
            if (result.error) {
                setError(result.error);
                setShowConfirm(false);
            }
        });
    };

    const handleToggle = () => {
        startTransition(async () => {
            const result = await togglePublicacion(id);
            if (result.error) {
                setError(result.error);
            }
        });
    };

    return (
        <>
            <tr className="border-b border-surface-border/50 hover:bg-zinc-900/30 transition-colors">
                <td className="px-6 py-4 text-white font-medium max-w-xs truncate">{title}</td>
                <td className="px-6 py-4 text-brand-secondary">
                    {new Date(date).toLocaleDateString('es-AR', { day: '2-digit', month: '2-digit', year: '2-digit' })}
                </td>
                <td className="px-6 py-4 text-center">
                    <button
                        onClick={handleToggle}
                        disabled={isPending}
                        className={`inline-block px-3 py-1 text-xs font-medium rounded-full transition-all cursor-pointer ${published
                                ? 'bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20'
                                : 'bg-zinc-800 text-brand-secondary hover:bg-zinc-700'
                            }`}
                    >
                        {published ? 'Publicada' : 'Borrador'}
                    </button>
                </td>
                <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                        <Link
                            href={`/admin/noticias/${id}/editar`}
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
                title="Eliminar noticia"
                message={`¿Estás seguro de que querés eliminar la noticia "${title}"?`}
                onConfirm={handleDelete}
                onCancel={() => setShowConfirm(false)}
                loading={isPending}
            />
        </>
    );
}
