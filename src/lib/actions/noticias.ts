'use server';

import prisma from '@/lib/prisma';

/**
 * Trae todas las noticias publicadas, ordenadas por fecha descendente.
 */
export async function getNoticiasPublicadas() {
    try {
        return await prisma.news.findMany({
            where: { published: true },
            orderBy: { date: 'desc' },
            select: {
                id: true,
                title: true,
                slug: true,
                content: true,
                imageUrl: true,
                date: true,
            },
        });
    } catch (error) {
        console.error('Error fetching published news:', error);
        return [];
    }
}

/**
 * Busca una noticia publicada por su slug.
 * Devuelve null si no existe o no está publicada.
 */
export async function getNoticiaPorSlug(slug: string) {
    try {
        const noticia = await prisma.news.findFirst({
            where: { slug, published: true },
            select: {
                id: true,
                title: true,
                slug: true,
                content: true,
                imageUrl: true,
                date: true,
            },
        });
        return noticia;
    } catch (error) {
        console.error(`Error fetching news by slug "${slug}":`, error);
        return null;
    }
}
