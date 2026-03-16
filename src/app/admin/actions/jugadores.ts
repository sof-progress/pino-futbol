'use server';

import { revalidatePath } from 'next/cache';
import prisma from '@/lib/prisma';
import type { PlayerPosition } from '@prisma/client';
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

const VALID_POSITIONS: PlayerPosition[] = ['GOALKEEPER', 'DEFENDER', 'MIDFIELDER', 'FORWARD'];

// Crear un nuevo jugador
export async function crearJugador(formData: FormData) {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
        throw new Error("No autorizado");
    }

    const nombre = formData.get('nombre') as string;
    const apellido = formData.get('apellido') as string;
    const dni = formData.get('dni') as string;
    const posicion = formData.get('posicion') as string;
    const equipoId = formData.get('equipoId') as string;

    if (!nombre?.trim()) return { error: 'El nombre es obligatorio' };
    if (!equipoId) return { error: 'Debés seleccionar un equipo' };

    // Validar posición si fue seleccionada
    if (posicion && !VALID_POSITIONS.includes(posicion as PlayerPosition)) {
        return { error: 'Posición inválida' };
    }

    try {
        // Obtener la categoría del equipo para asociarla al jugador
        const equipo = await prisma.team.findUnique({
            where: { id: equipoId },
            select: { categoryId: true },
        });

        if (!equipo) return { error: 'Equipo no encontrado' };

        await prisma.player.create({
            data: {
                name: nombre.trim(),
                lastName: apellido?.trim() || null,
                dni: dni?.trim() || null,
                position: posicion ? (posicion as PlayerPosition) : null,
                teamId: equipoId,
                categoryId: equipo.categoryId,
            },
        });

        revalidatePath('/admin/jugadores');
        return { success: 'Jugador creado correctamente' };
    } catch (error) {
        console.error('Error al crear jugador:', error);
        return { error: 'Error al crear el jugador' };
    }
}

// Actualizar un jugador existente
export async function actualizarJugador(id: string, formData: FormData) {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
        throw new Error("No autorizado");
    }

    const nombre = formData.get('nombre') as string;
    const apellido = formData.get('apellido') as string;
    const dni = formData.get('dni') as string;
    const posicion = formData.get('posicion') as string;
    const equipoId = formData.get('equipoId') as string;

    if (!nombre?.trim()) return { error: 'El nombre es obligatorio' };
    if (!equipoId) return { error: 'Debés seleccionar un equipo' };

    if (posicion && !VALID_POSITIONS.includes(posicion as PlayerPosition)) {
        return { error: 'Posición inválida' };
    }

    try {
        const equipo = await prisma.team.findUnique({
            where: { id: equipoId },
            select: { categoryId: true },
        });

        if (!equipo) return { error: 'Equipo no encontrado' };

        await prisma.player.update({
            where: { id },
            data: {
                name: nombre.trim(),
                lastName: apellido?.trim() || null,
                dni: dni?.trim() || null,
                position: posicion ? (posicion as PlayerPosition) : null,
                teamId: equipoId,
                categoryId: equipo.categoryId,
            },
        });

        revalidatePath('/admin/jugadores');
        return { success: 'Jugador actualizado correctamente' };
    } catch (error) {
        console.error('Error al actualizar jugador:', error);
        return { error: 'Error al actualizar el jugador' };
    }
}

// Eliminar un jugador
export async function eliminarJugador(id: string) {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
        throw new Error("No autorizado");
    }

    try {
        await prisma.player.delete({ where: { id } });
        revalidatePath('/admin/jugadores');
        return { success: 'Jugador eliminado correctamente' };
    } catch (error) {
        console.error('Error al eliminar jugador:', error);
        return { error: 'Error al eliminar el jugador' };
    }
}
