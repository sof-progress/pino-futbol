'use server';

import { revalidatePath } from 'next/cache';
import prisma from '@/lib/prisma';
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

// Generar slug desde un título (URL amigable)
function generarSlug(titulo: string): string {
    return titulo
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '') // Quitar acentos
        .replace(/[^a-z0-9\s-]/g, '')   // Solo alfanuméricos
        .replace(/\s+/g, '-')           // Espacios → guiones
        .replace(/-+/g, '-')            // Guiones múltiples → uno solo
        .replace(/^-|-$/g, '');         // Quitar guiones al inicio/final
}

// Crear una nueva noticia
export async function crearNoticia(formData: FormData) {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
        throw new Error("No autorizado");
    }

    const titulo = formData.get('titulo') as string;
    const contenido = formData.get('contenido') as string;
    const imageUrl = formData.get('imageUrl') as string;
    const publicada = formData.get('publicada') === 'on';

    if (!titulo?.trim()) return { error: 'El título es obligatorio' };
    if (!contenido?.trim()) return { error: 'El contenido es obligatorio' };

    const slug = generarSlug(titulo);

    try {
        await prisma.news.create({
            data: {
                title: titulo.trim(),
                slug: slug || null,
                content: contenido.trim(),
                imageUrl: imageUrl?.trim() || null,
                published: publicada,
                date: new Date(),
            },
        });

        revalidatePath('/admin/noticias');
        revalidatePath('/noticias');
        return { success: 'Noticia creada correctamente' };
    } catch (error: unknown) {
        if (error instanceof Error && error.message.includes('Unique')) {
            return { error: 'Ya existe una noticia con un slug similar. Cambiá ligeramente el título.' };
        }
        console.error('Error al crear noticia:', error);
        return { error: 'Error al crear la noticia' };
    }
}

// Actualizar una noticia existente
export async function actualizarNoticia(id: string, formData: FormData) {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
        throw new Error("No autorizado");
    }

    const titulo = formData.get('titulo') as string;
    const slugInput = formData.get('slug') as string;
    const contenido = formData.get('contenido') as string;
    const imageUrl = formData.get('imageUrl') as string;
    const publicada = formData.get('publicada') === 'on';

    if (!titulo?.trim()) return { error: 'El título es obligatorio' };
    if (!contenido?.trim()) return { error: 'El contenido es obligatorio' };

    // Usar el slug del input si fue modificado, o generarlo desde el título
    const slug = slugInput?.trim() || generarSlug(titulo);

    try {
        await prisma.news.update({
            where: { id },
            data: {
                title: titulo.trim(),
                slug: slug || null,
                content: contenido.trim(),
                imageUrl: imageUrl?.trim() || null,
                published: publicada,
            },
        });

        revalidatePath('/admin/noticias');
        revalidatePath('/noticias');
        return { success: 'Noticia actualizada correctamente' };
    } catch (error: unknown) {
        if (error instanceof Error && error.message.includes('Unique')) {
            return { error: 'Ya existe una noticia con ese slug. Modificá el título o el slug.' };
        }
        console.error('Error al actualizar noticia:', error);
        return { error: 'Error al actualizar la noticia' };
    }
}

// Eliminar una noticia
export async function eliminarNoticia(id: string) {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
        throw new Error("No autorizado");
    }

    try {
        await prisma.news.delete({ where: { id } });
        revalidatePath('/admin/noticias');
        revalidatePath('/noticias');
        return { success: 'Noticia eliminada correctamente' };
    } catch (error) {
        console.error('Error al eliminar noticia:', error);
        return { error: 'Error al eliminar la noticia' };
    }
}

// Toggle publicar/despublicar desde la tabla
export async function togglePublicacion(id: string) {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
        throw new Error("No autorizado");
    }

    try {
        const noticia = await prisma.news.findUnique({ where: { id } });
        if (!noticia) return { error: 'Noticia no encontrada' };

        await prisma.news.update({
            where: { id },
            data: { published: !noticia.published },
        });

        revalidatePath('/admin/noticias');
        revalidatePath('/noticias');
        return { success: noticia.published ? 'Noticia despublicada' : 'Noticia publicada' };
    } catch (error) {
        console.error('Error al cambiar publicación:', error);
        return { error: 'Error al cambiar el estado de publicación' };
    }
}
