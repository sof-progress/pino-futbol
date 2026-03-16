'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { crearCategoria, actualizarCategoria } from '../../actions/categorias';
import { FormMessage } from '../../components/FormMessage';
import Link from 'next/link';

interface CategoriaFormProps {
    categoriaId?: string;
    initialData?: {
        nombre: string;
        temporada: string;
    };
}

// Formulario compartido para crear y editar categorías
export function CategoriaForm({ categoriaId, initialData }: CategoriaFormProps) {
    const router = useRouter();
    const [isPending, startTransition] = useTransition();
    const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

    const isEditing = !!categoriaId;

    const handleSubmit = (formData: FormData) => {
        setMessage(null);

        startTransition(async () => {
            const result = isEditing
                ? await actualizarCategoria(categoriaId, formData)
                : await crearCategoria(formData);

            if (result.error) {
                setMessage({ type: 'error', text: result.error });
            } else if (result.success) {
                setMessage({ type: 'success', text: result.success });
                // Redirigir al listado después de un momento
                setTimeout(() => router.push('/admin/categorias'), 1000);
            }
        });
    };

    return (
        <form action={handleSubmit} className="bg-[#111] border border-zinc-800 rounded-2xl p-6 space-y-6 max-w-lg">
            {message && <FormMessage type={message.type} message={message.text} />}

            {/* Nombre */}
            <div className="space-y-2">
                <label htmlFor="nombre" className="block text-sm font-medium text-zinc-400">
                    Nombre <span className="text-red-400">*</span>
                </label>
                <input
                    id="nombre"
                    name="nombre"
                    type="text"
                    required
                    defaultValue={initialData?.nombre || ''}
                    placeholder="Ej: Primera División A"
                    className="w-full px-4 py-3 bg-[#0a0a0a] border border-zinc-800 rounded-xl text-white placeholder-zinc-600 focus:outline-none focus:ring-2 focus:ring-[#39ff14]/40 focus:border-[#39ff14]/40 transition-all"
                />
            </div>

            {/* Temporada */}
            <div className="space-y-2">
                <label htmlFor="temporada" className="block text-sm font-medium text-zinc-400">
                    Temporada
                </label>
                <input
                    id="temporada"
                    name="temporada"
                    type="text"
                    defaultValue={initialData?.temporada || ''}
                    placeholder="Ej: 2026"
                    className="w-full px-4 py-3 bg-[#0a0a0a] border border-zinc-800 rounded-xl text-white placeholder-zinc-600 focus:outline-none focus:ring-2 focus:ring-[#39ff14]/40 focus:border-[#39ff14]/40 transition-all"
                />
            </div>

            {/* Botones */}
            <div className="flex gap-3 pt-2">
                <button
                    type="submit"
                    disabled={isPending}
                    className="px-6 py-3 bg-[#39ff14] text-black font-bold text-sm rounded-xl hover:bg-[#39ff14]/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isPending ? 'Guardando...' : isEditing ? 'Actualizar categoría' : 'Crear categoría'}
                </button>
                <Link
                    href="/admin/categorias"
                    className="px-6 py-3 text-zinc-400 hover:text-white bg-zinc-800 hover:bg-zinc-700 text-sm rounded-xl transition-all flex items-center"
                >
                    Cancelar
                </Link>
            </div>
        </form>
    );
}
