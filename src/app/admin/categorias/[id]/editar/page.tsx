import { notFound } from 'next/navigation';
import prisma from '@/lib/prisma';
import { CategoriaForm } from '../../components/CategoriaForm';
import type { Metadata } from 'next';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
    title: 'Editar Categoría — Pino Fútbol Admin',
    robots: 'noindex, nofollow',
};

interface EditarCategoriaPageProps {
    params: Promise<{ id: string }>;
}

export default async function EditarCategoriaPage({ params }: EditarCategoriaPageProps) {
    const { id } = await params;

    const categoria = await prisma.category.findUnique({
        where: { id },
    });

    if (!categoria) {
        notFound();
    }

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-white">Editar categoría</h1>
                <p className="text-brand-secondary text-sm mt-1">Modificar &ldquo;{categoria.name}&rdquo;</p>
            </div>
            <CategoriaForm
                categoriaId={categoria.id}
                initialData={{
                    nombre: categoria.name,
                    temporada: categoria.season || '',
                }}
            />
        </div>
    );
}
