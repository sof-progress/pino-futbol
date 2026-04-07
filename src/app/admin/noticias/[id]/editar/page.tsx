import { notFound } from 'next/navigation';
import prisma from '@/lib/prisma';
import { NoticiaForm } from '../../components/NoticiaForm';
import type { Metadata } from 'next';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
    title: 'Editar Noticia — Pino Fútbol Admin',
    robots: 'noindex, nofollow',
};

interface EditarNoticiaPageProps {
    params: Promise<{ id: string }>;
}

export default async function EditarNoticiaPage({ params }: EditarNoticiaPageProps) {
    const { id } = await params;

    const noticia = await prisma.news.findUnique({
        where: { id },
    });

    if (!noticia) {
        notFound();
    }

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-white">Editar noticia</h1>
                <p className="text-brand-secondary text-sm mt-1">Modificar &ldquo;{noticia.title}&rdquo;</p>
            </div>
            <NoticiaForm
                noticiaId={noticia.id}
                initialData={{
                    titulo: noticia.title,
                    slug: noticia.slug || '',
                    contenido: noticia.content,
                    imageUrl: noticia.imageUrl || '',
                    publicada: noticia.published,
                }}
            />
        </div>
    );
}
