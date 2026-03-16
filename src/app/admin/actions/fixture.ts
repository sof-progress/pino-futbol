'use server';

import { revalidatePath } from 'next/cache';
import prisma from '@/lib/prisma';
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

// Crear un nuevo partido
export async function crearPartido(formData: FormData) {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
        throw new Error("No autorizado");
    }

    const categoriaId = formData.get('categoriaId') as string;
    const equipoLocalId = formData.get('equipoLocalId') as string;
    const equipoVisitanteId = formData.get('equipoVisitanteId') as string;
    const fecha = formData.get('fecha') as string;
    const venueId = formData.get('venueId') as string;
    const canchaTextoLibre = formData.get('canchaTextoLibre') as string;
    const jornada = formData.get('jornada') as string;

    if (!categoriaId) return { error: 'Debés seleccionar una categoría' };
    if (!equipoLocalId) return { error: 'Debés seleccionar el equipo local' };
    if (!equipoVisitanteId) return { error: 'Debés seleccionar el equipo visitante' };
    if (equipoLocalId === equipoVisitanteId) return { error: 'El equipo local y visitante no pueden ser el mismo' };
    if (!fecha) return { error: 'La fecha y hora son obligatorias' };

    try {
        await prisma.match.create({
            data: {
                categoryId: categoriaId,
                homeTeamId: equipoLocalId,
                awayTeamId: equipoVisitanteId,
                date: new Date(fecha),
                venueId: venueId || null,
                field: canchaTextoLibre?.trim() || null,
                round: jornada ? parseInt(jornada, 10) : null,
                status: 'SCHEDULED',
            },
        });

        revalidatePath('/admin/fixture');
        return { success: 'Partido creado correctamente' };
    } catch (error) {
        console.error('Error al crear partido:', error);
        return { error: 'Error al crear el partido' };
    }
}

// Guardar resultado de un partido y recalcular posiciones de toda la categoría
export async function guardarResultado(matchId: string, formData: FormData) {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
        throw new Error("No autorizado");
    }

    const golesLocal = parseInt(formData.get('golesLocal') as string, 10);
    const golesVisitante = parseInt(formData.get('golesVisitante') as string, 10);

    if (isNaN(golesLocal) || golesLocal < 0) return { error: 'Los goles del local son inválidos' };
    if (isNaN(golesVisitante) || golesVisitante < 0) return { error: 'Los goles del visitante son inválidos' };

    try {
        // Actualizar el partido con el resultado
        const partido = await prisma.match.update({
            where: { id: matchId },
            data: {
                homeScore: golesLocal,
                awayScore: golesVisitante,
                status: 'FINISHED',
            },
        });

        // Recalcular TODA la tabla de posiciones de la categoría desde cero
        await recalcularPosiciones(partido.categoryId);

        revalidatePath('/admin/fixture');
        revalidatePath('/posiciones');
        return { success: 'Resultado guardado y posiciones actualizadas' };
    } catch (error) {
        console.error('Error al guardar resultado:', error);
        return { error: 'Error al guardar el resultado' };
    }
}

/**
 * Recalcula TODOS los standings de una categoría desde cero.
 * 1. Resetea todos los registros Standing de la categoría a cero.
 * 2. Itera todos los partidos FINISHED de la categoría.
 * 3. Acumula PJ, PG, PE, PP, GF, GC, DIF, Puntos.
 * 
 * Este enfoque evita inconsistencias al editar resultados previos.
 */
async function recalcularPosiciones(categoryId: string) {
    // Obtener todos los equipos de la categoría
    const equipos = await prisma.team.findMany({
        where: { categoryId },
        select: { id: true },
    });

    // Inicializar mapa de estadísticas en cero para cada equipo
    const stats = new Map<string, {
        played: number;
        won: number;
        drawn: number;
        lost: number;
        goalsFor: number;
        goalsAgainst: number;
        points: number;
    }>();

    for (const equipo of equipos) {
        stats.set(equipo.id, {
            played: 0,
            won: 0,
            drawn: 0,
            lost: 0,
            goalsFor: 0,
            goalsAgainst: 0,
            points: 0,
        });
    }

    // Obtener todos los partidos FINISHED de la categoría
    const partidos = await prisma.match.findMany({
        where: {
            categoryId,
            status: 'FINISHED',
        },
    });

    // Iterar cada partido y acumular estadísticas
    for (const partido of partidos) {
        const homeStats = stats.get(partido.homeTeamId);
        const awayStats = stats.get(partido.awayTeamId);

        if (!homeStats || !awayStats) continue;

        // Ambos jugaron
        homeStats.played++;
        awayStats.played++;

        // Goles
        homeStats.goalsFor += partido.homeScore;
        homeStats.goalsAgainst += partido.awayScore;
        awayStats.goalsFor += partido.awayScore;
        awayStats.goalsAgainst += partido.homeScore;

        // Resultado: victoria, empate o derrota
        if (partido.homeScore > partido.awayScore) {
            // Ganó el local
            homeStats.won++;
            homeStats.points += 3;
            awayStats.lost++;
        } else if (partido.homeScore < partido.awayScore) {
            // Ganó el visitante
            awayStats.won++;
            awayStats.points += 3;
            homeStats.lost++;
        } else {
            // Empate
            homeStats.drawn++;
            homeStats.points += 1;
            awayStats.drawn++;
            awayStats.points += 1;
        }
    }

    // Actualizar (upsert) cada registro Standing en la base de datos
    for (const [teamId, teamStats] of stats) {
        await prisma.standing.upsert({
            where: {
                categoryId_teamId: { categoryId, teamId },
            },
            create: {
                categoryId,
                teamId,
                ...teamStats,
            },
            update: teamStats,
        });
    }
}

// Editar un partido existente
export async function editarPartido(matchId: string, formData: FormData) {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
        throw new Error("No autorizado");
    }

    const categoriaId = formData.get('categoriaId') as string;
    const equipoLocalId = formData.get('equipoLocalId') as string;
    const equipoVisitanteId = formData.get('equipoVisitanteId') as string;
    const fecha = formData.get('fecha') as string;
    const venueId = formData.get('venueId') as string;
    const canchaTextoLibre = formData.get('canchaTextoLibre') as string;
    const jornada = formData.get('jornada') as string;

    if (!categoriaId) return { error: 'Debés seleccionar una categoría' };
    if (!equipoLocalId) return { error: 'Debés seleccionar el equipo local' };
    if (!equipoVisitanteId) return { error: 'Debés seleccionar el equipo visitante' };
    if (equipoLocalId === equipoVisitanteId) return { error: 'El equipo local y visitante no pueden ser el mismo' };
    if (!fecha) return { error: 'La fecha y hora son obligatorias' };

    try {
        await prisma.match.update({
            where: { id: matchId },
            data: {
                categoryId: categoriaId,
                homeTeamId: equipoLocalId,
                awayTeamId: equipoVisitanteId,
                date: new Date(fecha),
                venueId: venueId || null,
                field: canchaTextoLibre?.trim() || null,
                round: jornada ? parseInt(jornada, 10) : null,
            },
        });

        revalidatePath('/admin/fixture');
        revalidatePath('/fixture');
        return { success: 'Partido actualizado correctamente' };
    } catch (error) {
        console.error('Error al editar partido:', error);
        return { error: 'Error al actualizar el partido' };
    }
}

// Eliminar un partido
export async function eliminarPartido(id: string) {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
        throw new Error("No autorizado");
    }

    try {
        const partido = await prisma.match.findUnique({ where: { id } });
        if (!partido) return { error: 'Partido no encontrado' };

        const categoryId = partido.categoryId;
        await prisma.match.delete({ where: { id } });

        // Si el partido estaba FINISHED, recalcular posiciones
        if (partido.status === 'FINISHED') {
            await recalcularPosiciones(categoryId);
        }

        revalidatePath('/admin/fixture');
        revalidatePath('/posiciones');
        return { success: 'Partido eliminado correctamente' };
    } catch (error) {
        console.error('Error al eliminar partido:', error);
        return { error: 'Error al eliminar el partido' };
    }
}
