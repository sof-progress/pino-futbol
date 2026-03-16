'use server';

import { revalidatePath } from 'next/cache';
import prisma from '@/lib/prisma';
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

// Crear una nueva categoría
export async function crearCategoria(formData: FormData) {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
        throw new Error("No autorizado");
    }

    const nombre = formData.get('nombre') as string;
    const temporada = formData.get('temporada') as string;

    if (!nombre?.trim()) {
        return { error: 'El nombre de la categoría es obligatorio' };
    }

    try {
        await prisma.category.create({
            data: {
                name: nombre.trim(),
                season: temporada?.trim() || null,
            },
        });

        revalidatePath('/admin/categorias');
        return { success: 'Categoría creada correctamente' };
    } catch (error: unknown) {
        // Verificar error de unicidad
        if (error instanceof Error && error.message.includes('Unique')) {
            return { error: 'Ya existe una categoría con ese nombre' };
        }
        console.error('Error al crear categoría:', error);
        return { error: 'Error al crear la categoría' };
    }
}

// Actualizar una categoría existente
export async function actualizarCategoria(id: string, formData: FormData) {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
        throw new Error("No autorizado");
    }

    const nombre = formData.get('nombre') as string;
    const temporada = formData.get('temporada') as string;

    if (!nombre?.trim()) {
        return { error: 'El nombre de la categoría es obligatorio' };
    }

    try {
        await prisma.category.update({
            where: { id },
            data: {
                name: nombre.trim(),
                season: temporada?.trim() || null,
            },
        });

        revalidatePath('/admin/categorias');
        return { success: 'Categoría actualizada correctamente' };
    } catch (error: unknown) {
        if (error instanceof Error && error.message.includes('Unique')) {
            return { error: 'Ya existe una categoría con ese nombre' };
        }
        console.error('Error al actualizar categoría:', error);
        return { error: 'Error al actualizar la categoría' };
    }
}

// Eliminar una categoría (solo si no tiene equipos/partidos vinculados)
export async function eliminarCategoria(id: string) {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
        throw new Error("No autorizado");
    }

    try {
        // Verificar que no tenga equipos vinculados
        const equipos = await prisma.team.count({ where: { categoryId: id } });
        if (equipos > 0) {
            return { error: `No se puede eliminar: tiene ${equipos} equipo(s) vinculado(s)` };
        }

        // Verificar que no tenga partidos vinculados
        const partidos = await prisma.match.count({ where: { categoryId: id } });
        if (partidos > 0) {
            return { error: `No se puede eliminar: tiene ${partidos} partido(s) vinculado(s)` };
        }

        await prisma.category.delete({ where: { id } });
        revalidatePath('/admin/categorias');
        return { success: 'Categoría eliminada correctamente' };
    } catch (error) {
        console.error('Error al eliminar categoría:', error);
        return { error: 'Error al eliminar la categoría' };
    }
}
