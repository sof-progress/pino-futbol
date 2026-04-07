import { notFound } from 'next/navigation';
import { getNoticiaPorSlug } from '@/lib/actions/noticias';
import Image from 'next/image';
import Link from 'next/link';
import type { Metadata } from 'next';

type Props = {
    params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { slug } = await params;
    const noticia = await getNoticiaPorSlug(slug);

    if (!noticia) {
        return { title: 'Noticia no encontrada — Pino Fútbol' };
    }

    return {
        title: `${noticia.title} — Pino Fútbol`,
        description: noticia.content?.slice(0, 160),
    };
}

export default async function NoticiaDetallePage({ params }: Props) {
    const { slug } = await params;
    const noticia = await getNoticiaPorSlug(slug);

    if (!noticia) {
        notFound();
    }

    const fechaFormateada = new Date(noticia.date).toLocaleDateString('es-AR', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
    });

    return (
        <div className="container mx-auto px-4 py-12 min-h-screen max-w-3xl">
            {/* Botón volver */}
            <Link
                href="/noticias"
                className="inline-flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-brand-neon/70 hover:text-brand-neon transition-colors mb-8 group"
            >
                <span className="group-hover:-translate-x-1 transition-transform">←</span>
                Volver a noticias
            </Link>

            <article>
                {/* Imagen destacada */}
                {noticia.imageUrl && (
                    <div className="relative w-full aspect-video rounded-2xl overflow-hidden mb-8 border border-surface-border">
                        <Image
                            src={noticia.imageUrl}
                            alt={noticia.title}
                            fill
                            className="object-cover"
                            sizes="(max-width: 768px) 100vw, 768px"
                            priority
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-zinc-900/60 to-transparent" />
                    </div>
                )}

                {/* Fecha */}
                <time className="text-[11px] font-bold uppercase tracking-widest text-brand-neon/60 block mb-3">
                    {fechaFormateada}
                </time>

                {/* Título */}
                <h1 className="text-3xl md:text-4xl font-black text-white uppercase tracking-tight leading-tight mb-8">
                    {noticia.title}
                </h1>

                {/* Separador */}
                <div className="w-16 h-1 bg-brand-neon rounded-full mb-8" />

                {/* Contenido */}
                <div className="prose prose-invert prose-zinc max-w-none text-zinc-300 leading-relaxed text-base whitespace-pre-line">
                    {noticia.content}
                </div>
            </article>

            {/* Botón volver inferior */}
            <div className="mt-12 pt-8 border-t border-surface-border">
                <Link
                    href="/noticias"
                    className="inline-flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-brand-neon/70 hover:text-brand-neon transition-colors group"
                >
                    <span className="group-hover:-translate-x-1 transition-transform">←</span>
                    Volver a noticias
                </Link>
            </div>
        </div>
    );
}
