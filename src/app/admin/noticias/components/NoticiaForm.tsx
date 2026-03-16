'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { crearNoticia, actualizarNoticia } from '../../actions/noticias';
import { FormMessage } from '../../components/FormMessage';
import Link from 'next/link';

interface NoticiaFormProps {
    noticiaId?: string;
    initialData?: {
        titulo: string;
        slug: string;
        contenido: string;
        imageUrl: string;
        publicada: boolean;
    };
}

// Genera slug desde un título
function generarSlug(titulo: string): string {
    return titulo
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .replace(/^-|-$/g, '');
}

export function NoticiaForm({ noticiaId, initialData }: NoticiaFormProps) {
    const router = useRouter();
    const [isPending, startTransition] = useTransition();
    const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
    const [slug, setSlug] = useState(initialData?.slug || '');

    const isEditing = !!noticiaId;

    const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        // Auto-generar slug desde el título solo si no está editando
        if (!isEditing || !initialData?.slug) {
            setSlug(generarSlug(e.target.value));
        }
    };

    const handleSubmit = (formData: FormData) => {
        setMessage(null);
        startTransition(async () => {
            const result = isEditing
                ? await actualizarNoticia(noticiaId, formData)
                : await crearNoticia(formData);

            if (result.error) {
                setMessage({ type: 'error', text: result.error });
            } else if (result.success) {
                setMessage({ type: 'success', text: result.success });
                setTimeout(() => router.push('/admin/noticias'), 1000);
            }
        });
    };

    return (
        <form action={handleSubmit} className="bg-[#111] border border-zinc-800 rounded-2xl p-6 space-y-6 max-w-2xl">
            {message && <FormMessage type={message.type} message={message.text} />}

            {/* Título */}
            <div className="space-y-2">
                <label htmlFor="titulo" className="block text-sm font-medium text-zinc-400">
                    Título <span className="text-red-400">*</span>
                </label>
                <input
                    id="titulo"
                    name="titulo"
                    type="text"
                    required
                    defaultValue={initialData?.titulo || ''}
                    onChange={handleTitleChange}
                    placeholder="Ej: Gran victoria de Deportivo en la fecha 5"
                    className="w-full px-4 py-3 bg-[#0a0a0a] border border-zinc-800 rounded-xl text-white placeholder-zinc-600 focus:outline-none focus:ring-2 focus:ring-[#39ff14]/40 transition-all"
                />
            </div>

            {/* Slug */}
            <div className="space-y-2">
                <label htmlFor="slug" className="block text-sm font-medium text-zinc-400">
                    Slug (URL amigable)
                </label>
                <input
                    id="slug"
                    name="slug"
                    type="text"
                    value={slug}
                    onChange={(e) => setSlug(e.target.value)}
                    placeholder="se-genera-automaticamente"
                    className="w-full px-4 py-3 bg-[#0a0a0a] border border-zinc-800 rounded-xl text-zinc-500 placeholder-zinc-600 focus:outline-none focus:ring-2 focus:ring-[#39ff14]/40 transition-all font-mono text-sm"
                />
                <p className="text-xs text-zinc-600">Se genera automáticamente desde el título</p>
            </div>

            {/* Contenido */}
            <div className="space-y-2">
                <label htmlFor="contenido" className="block text-sm font-medium text-zinc-400">
                    Contenido <span className="text-red-400">*</span>
                </label>
                <textarea
                    id="contenido"
                    name="contenido"
                    required
                    rows={8}
                    defaultValue={initialData?.contenido || ''}
                    placeholder="Escribí el contenido de la noticia..."
                    className="w-full px-4 py-3 bg-[#0a0a0a] border border-zinc-800 rounded-xl text-white placeholder-zinc-600 focus:outline-none focus:ring-2 focus:ring-[#39ff14]/40 transition-all resize-y"
                />
            </div>

            {/* URL de imagen */}
            <div className="space-y-2">
                <label htmlFor="imageUrl" className="block text-sm font-medium text-zinc-400">
                    URL de imagen
                </label>
                <input
                    id="imageUrl"
                    name="imageUrl"
                    type="url"
                    defaultValue={initialData?.imageUrl || ''}
                    placeholder="https://ejemplo.com/imagen.jpg"
                    className="w-full px-4 py-3 bg-[#0a0a0a] border border-zinc-800 rounded-xl text-white placeholder-zinc-600 focus:outline-none focus:ring-2 focus:ring-[#39ff14]/40 transition-all"
                />
            </div>

            {/* Publicada */}
            <div className="flex items-center gap-3">
                <input
                    id="publicada"
                    name="publicada"
                    type="checkbox"
                    defaultChecked={initialData?.publicada ?? true}
                    className="w-4 h-4 rounded border-zinc-700 bg-[#0a0a0a] text-[#39ff14] focus:ring-[#39ff14]/40 accent-[#39ff14]"
                />
                <label htmlFor="publicada" className="text-sm text-zinc-400">
                    Publicar inmediatamente
                </label>
            </div>

            {/* Botones */}
            <div className="flex gap-3 pt-2">
                <button
                    type="submit"
                    disabled={isPending}
                    className="px-6 py-3 bg-[#39ff14] text-black font-bold text-sm rounded-xl hover:bg-[#39ff14]/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isPending ? 'Guardando...' : isEditing ? 'Actualizar noticia' : 'Crear noticia'}
                </button>
                <Link
                    href="/admin/noticias"
                    className="px-6 py-3 text-zinc-400 hover:text-white bg-zinc-800 hover:bg-zinc-700 text-sm rounded-xl transition-all flex items-center"
                >
                    Cancelar
                </Link>
            </div>
        </form>
    );
}
