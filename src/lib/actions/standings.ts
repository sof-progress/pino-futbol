'use server';

import prisma from '@/lib/prisma';

export async function getStandingsByCategory(categoryName: string) {
    try {
        // Obtenemos los registros de la tabla de posiciones filtrados por nombre de categoría
        const standings = await prisma.standing.findMany({
            where: {
                category: {
                    name: categoryName
                }
            },
            include: {
                team: {
                    select: {
                        name: true,
                        neighborhood: true,
                        logoUrl: true
                    }
                }
            },
            orderBy: [
                { points: 'desc' },            // 1. Mayor cantidad de puntos
                { goalsFor: 'desc' },          // 2. Mayor diferencia de gol (calculado abajo) o Goles a favor
                // Nota: Prisma no soporta ordenar por campos calculados directamente (GF - GC) 
                // pero como guardamos points, won, lost etc, cumplimos con el orden principal.
                // Refinaremos el orden de DIF en el componente si es necesario.
            ]
        });

        // Ordenamiento secundario por Diferencia de Gol (GF - GC)
        return standings.sort((a, b) => {
            if (b.points !== a.points) return b.points - a.points;
            const difB = b.goalsFor - b.goalsAgainst;
            const difA = a.goalsFor - a.goalsAgainst;
            if (difB !== difA) return difB - difA;
            return b.goalsFor - a.goalsFor;
        });
    } catch (error) {
        console.error(`Error fetching standings for ${categoryName}:`, error);
        return [];
    }
}

/**
 * Obtiene todas las categorías disponibles de forma dinámica
 */
export async function getCategories() {
    try {
        return await prisma.category.findMany({
            select: {
                id: true,
                name: true
            },
            orderBy: {
                createdAt: 'asc'
            }
        });
    } catch (error) {
        console.error('Error fetching categories:', error);
        return [];
    }
}
