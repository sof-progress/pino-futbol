'use server';

import { revalidatePath } from 'next/cache';
import prisma from '@/lib/prisma';
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

// Crear un nuevo equipo
export async function crearEquipo(formData: FormData) {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
        throw new Error("No autorizado");
    }

    const nombre = formData.get('nombre') as string;
    const barrio = formData.get('barrio') as string;
    const categoriaId = formData.get('categoriaId') as string;
    const logoUrl = formData.get('logoUrl') as string;

    if (!nombre?.trim()) {
        return { error: 'El nombre del equipo es obligatorio' };
    }
    if (!barrio?.trim()) {
        return { error: 'El barrio es obligatorio' };
    }
    if (!categoriaId) {
        return { error: 'Debés seleccionar una categoría' };
    }

    try {
        const equipo = await prisma.team.create({
            data: {
                name: nombre.trim(),
                neighborhood: barrio.trim(),
                categoryId: categoriaId,
                logoUrl: logoUrl?.trim() || null,
            },
        });

        // Crear automáticamente el registro de Standing con todos los valores en 0
        await prisma.standing.create({
            data: {
                teamId: equipo.id,
                categoryId: categoriaId,
                played: 0,
                won: 0,
                drawn: 0,
                lost: 0,
                goalsFor: 0,
                goalsAgainst: 0,
                points: 0,
            },
        });

        revalidatePath('/admin/equipos');
        revalidatePath('/posiciones');
        return { success: 'Equipo creado correctamente' };
    } catch (error: unknown) {
        if (error instanceof Error && error.message.includes('Unique')) {
            return { error: 'Ya existe un equipo con ese nombre' };
        }
        console.error('Error al crear equipo:', error);
        return { error: 'Error al crear el equipo' };
    }
}

// Actualizar un equipo existente
export async function actualizarEquipo(id: string, formData: FormData) {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
        throw new Error("No autorizado");
    }

    const nombre = formData.get('nombre') as string;
    const barrio = formData.get('barrio') as string;
    const categoriaId = formData.get('categoriaId') as string;
    const logoUrl = formData.get('logoUrl') as string;

    if (!nombre?.trim()) {
        return { error: 'El nombre del equipo es obligatorio' };
    }
    if (!barrio?.trim()) {
        return { error: 'El barrio es obligatorio' };
    }
    if (!categoriaId) {
        return { error: 'Debés seleccionar una categoría' };
    }

    try {
        await prisma.team.update({
            where: { id },
            data: {
                name: nombre.trim(),
                neighborhood: barrio.trim(),
                categoryId: categoriaId,
                logoUrl: logoUrl?.trim() || null,
            },
        });

        revalidatePath('/admin/equipos');
        return { success: 'Equipo actualizado correctamente' };
    } catch (error: unknown) {
        if (error instanceof Error && error.message.includes('Unique')) {
            return { error: 'Ya existe un equipo con ese nombre' };
        }
        console.error('Error al actualizar equipo:', error);
        return { error: 'Error al actualizar el equipo' };
    }
}

// Eliminar un equipo (solo si no tiene partidos vinculados)
export async function eliminarEquipo(id: string) {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
        throw new Error("No autorizado");
    }

    try {
        const partidos = await prisma.match.count({
            where: { OR: [{ homeTeamId: id }, { awayTeamId: id }] },
        });
        if (partidos > 0) {
            return { error: `No se puede eliminar: tiene ${partidos} partido(s) vinculado(s)` };
        }

        // Eliminar standings asociados antes de eliminar el equipo
        await prisma.standing.deleteMany({ where: { teamId: id } });
        // Eliminar jugadores asociados
        await prisma.player.deleteMany({ where: { teamId: id } });

        await prisma.team.delete({ where: { id } });
        revalidatePath('/admin/equipos');
        return { success: 'Equipo eliminado correctamente' };
    } catch (error) {
        console.error('Error al eliminar equipo:', error);
        return { error: 'Error al eliminar el equipo' };
    }
}
