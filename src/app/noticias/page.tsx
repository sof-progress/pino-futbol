import { SectionTitle } from '@/components/ui/SectionTitle';
import { getNoticiasPublicadas } from '@/lib/actions/noticias';
import Image from 'next/image';
import Link from 'next/link';

export default async function NoticiasPage() {
    const noticias = await getNoticiasPublicadas();

    return (
        <div className="container mx-auto px-4 py-12 min-h-screen">
            <SectionTitle
                title="Noticias"
                subtitle="Novedades de la AIFB de Río Gallegos"
            />

            {noticias.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {noticias.map((noticia) => (
                        <Link key={noticia.id} href={`/noticias/${noticia.slug}`} className="block">
                            <article
                                className="group bg-zinc-900/60 border border-zinc-800 rounded-2xl overflow-hidden hover:border-brand-neon/40 transition-all duration-300 flex flex-col h-full cursor-pointer"
                            >
                                {/* Imagen */}
                                {noticia.imageUrl && (
                                    <div className="relative w-full aspect-video overflow-hidden">
                                        <Image
                                            src={noticia.imageUrl}
                                            alt={noticia.title}
                                            fill
                                            className="object-cover group-hover:scale-105 transition-transform duration-500"
                                            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-zinc-900/80 to-transparent" />
                                    </div>
                                )}

                                {/* Contenido */}
                                <div className="p-5 flex flex-col flex-1">
                                    <time className="text-[10px] font-bold uppercase tracking-widest text-brand-neon/60 mb-2">
                                        {new Date(noticia.date).toLocaleDateString('es-AR', {
                                            day: 'numeric',
                                            month: 'long',
                                            year: 'numeric',
                                        })}
                                    </time>
                                    <h3 className="text-lg font-black text-white uppercase tracking-tight leading-tight group-hover:text-brand-neon transition-colors duration-300">
                                        {noticia.title}
                                    </h3>
                                    {noticia.content && (
                                        <p className="text-zinc-400 text-sm mt-3 line-clamp-3 flex-1">
                                            {noticia.content}
                                        </p>
                                    )}
                                </div>
                            </article>
                        </Link>
                    ))}
                </div>
            ) : (
                /* Estado vacío */
                <div className="flex flex-col items-center justify-center py-20 border border-brand-neon/10 rounded-3xl bg-zinc-900/30">
                    <div className="w-16 h-16 mb-6 text-brand-neon/40">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10l4 4v10a2 2 0 01-2 2z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M14 4v4h4" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 8h3M7 12h10M7 16h10" />
                        </svg>
                    </div>
                    <h2 className="text-xl font-black uppercase tracking-widest text-white mb-2 italic">No hay noticias publicadas aún</h2>
                    <p className="text-brand-neon/60 text-sm max-w-md text-center">Las novedades del fútbol barrial aparecerán aquí cuando se publiquen.</p>
                </div>
            )}
        </div>
    );
}
