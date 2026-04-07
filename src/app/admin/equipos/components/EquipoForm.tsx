'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { crearEquipo, actualizarEquipo } from '../../actions/equipos';
import { FormMessage } from '../../components/FormMessage';
import Link from 'next/link';

interface EquipoFormProps {
    equipoId?: string;
    categorias: { id: string; name: string }[];
    initialData?: {
        nombre: string;
        barrio: string;
        categoriaId: string;
        logoUrl: string;
    };
}

// Formulario compartido para crear y editar equipos
export function EquipoForm({ equipoId, categorias, initialData }: EquipoFormProps) {
    const router = useRouter();
    const [isPending, startTransition] = useTransition();
    const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

    const isEditing = !!equipoId;

    const handleSubmit = (formData: FormData) => {
        setMessage(null);

        startTransition(async () => {
            const result = isEditing
                ? await actualizarEquipo(equipoId, formData)
                : await crearEquipo(formData);

            if (result.error) {
                setMessage({ type: 'error', text: result.error });
            } else if (result.success) {
                setMessage({ type: 'success', text: result.success });
                setTimeout(() => router.push('/admin/equipos'), 1000);
            }
        });
    };

    return (
        <form action={handleSubmit} className="bg-surface border border-surface-border rounded-2xl p-6 space-y-6 max-w-lg">
            {message && <FormMessage type={message.type} message={message.text} />}

            {/* Nombre */}
            <div className="space-y-2">
                <label htmlFor="nombre" className="block text-sm font-medium text-brand-secondary">
                    Nombre <span className="text-red-400">*</span>
                </label>
                <input
                    id="nombre"
                    name="nombre"
                    type="text"
                    required
                    defaultValue={initialData?.nombre || ''}
                    placeholder="Ej: Deportivo Km 3"
                    className="w-full px-4 py-3 bg-background border border-surface-border rounded-xl text-white placeholder-brand-secondary focus:outline-none focus:ring-2 focus:ring-[var(--brand-primary)]/40 focus:border-[var(--brand-primary)]/40 transition-all"
                />
            </div>

            {/* Barrio */}
            <div className="space-y-2">
                <label htmlFor="barrio" className="block text-sm font-medium text-brand-secondary">
                    Barrio <span className="text-red-400">*</span>
                </label>
                <input
                    id="barrio"
                    name="barrio"
                    type="text"
                    required
                    defaultValue={initialData?.barrio || ''}
                    placeholder="Ej: Kilómetro 3"
                    className="w-full px-4 py-3 bg-background border border-surface-border rounded-xl text-white placeholder-brand-secondary focus:outline-none focus:ring-2 focus:ring-[var(--brand-primary)]/40 focus:border-[var(--brand-primary)]/40 transition-all"
                />
            </div>

            {/* Categoría */}
            <div className="space-y-2">
                <label htmlFor="categoriaId" className="block text-sm font-medium text-brand-secondary">
                    Categoría <span className="text-red-400">*</span>
                </label>
                <select
                    id="categoriaId"
                    name="categoriaId"
                    required
                    defaultValue={initialData?.categoriaId || ''}
                    className="w-full px-4 py-3 bg-background border border-surface-border rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-[var(--brand-primary)]/40 focus:border-[var(--brand-primary)]/40 transition-all"
                >
                    <option value="">Seleccionar categoría</option>
                    {categorias.map((cat) => (
                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                </select>
            </div>

            {/* URL del Logo */}
            <div className="space-y-2">
                <label htmlFor="logoUrl" className="block text-sm font-medium text-brand-secondary">
                    URL del escudo
                </label>
                <input
                    id="logoUrl"
                    name="logoUrl"
                    type="text"
                    defaultValue={initialData?.logoUrl || ''}
                    placeholder="/escudos/nombre-del-club.png"
                    className="w-full px-4 py-3 bg-background border border-surface-border rounded-xl text-white placeholder-brand-secondary focus:outline-none focus:ring-2 focus:ring-[var(--brand-primary)]/40 focus:border-[var(--brand-primary)]/40 transition-all"
                />
            </div>

            {/* Botones */}
            <div className="flex gap-3 pt-2">
                <button
                    type="submit"
                    disabled={isPending}
                    className="px-6 py-3 bg-[var(--brand-primary)] text-black font-bold text-sm rounded-xl hover:bg-[var(--brand-primary)]/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isPending ? 'Guardando...' : isEditing ? 'Actualizar equipo' : 'Crear equipo'}
                </button>
                <Link
                    href="/admin/equipos"
                    className="px-6 py-3 text-brand-secondary hover:text-white bg-zinc-800 hover:bg-zinc-700 text-sm rounded-xl transition-all flex items-center"
                >
                    Cancelar
                </Link>
            </div>
        </form>
    );
}
