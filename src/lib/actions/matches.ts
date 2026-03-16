'use server';

import prisma from '@/lib/prisma';

/**
 * Trae todos los partidos de una categoría específica,
 * ordenados por fecha y agrupados por jornada
 */
export async function getMatchesByCategory(categoryName: string) {
    try {
        const matches = await prisma.match.findMany({
            where: {
                category: {
                    name: categoryName
                }
            },
            include: {
                // Incluimos los datos del equipo local
                homeTeam: {
                    select: {
                        name: true,
                        logoUrl: true
                    }
                },
                // Incluimos los datos del equipo visitante
                awayTeam: {
                    select: {
                        name: true,
                        logoUrl: true
                    }
                },
                // Incluimos la sede/cancha seleccionada
                venue: true
            },
            orderBy: [
                { round: 'asc' },      // Primero ordenamos por número de fecha
                { date: 'asc' }    // Dentro de cada fecha, por hora de inicio
            ]
        });

        return matches;

    } catch (error) {
        console.error(`Error fetching matches for ${categoryName}:`, error);
        return [];
    }
}