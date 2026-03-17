import { NoticiaForm } from '../components/NoticiaForm';
import type { Metadata } from 'next';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
    title: 'Nueva Noticia — Pino Fútbol Admin',
    robots: 'noindex, nofollow',
};

export default function NuevaNoticiaPage() {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-white">Nueva noticia</h1>
                <p className="text-zinc-500 text-sm mt-1">Publicar una nueva noticia</p>
            </div>
            <NoticiaForm />
        </div>
    );
}
