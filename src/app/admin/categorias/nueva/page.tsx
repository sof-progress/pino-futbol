import { CategoriaForm } from '../components/CategoriaForm';
import type { Metadata } from 'next';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
    title: 'Nueva Categoría — Pino Fútbol Admin',
    robots: 'noindex, nofollow',
};

export default function NuevaCategoriaPage() {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-white">Nueva categoría</h1>
                <p className="text-zinc-500 text-sm mt-1">Crear una nueva categoría de torneo</p>
            </div>
            <CategoriaForm />
        </div>
    );
}
