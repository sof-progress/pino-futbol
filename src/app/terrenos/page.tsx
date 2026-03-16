import React from 'react';
import { SectionTitle } from '@/components/ui/SectionTitle';
import { getCanchas } from '@/app/admin/actions/canchas';
import Image from 'next/image';
import { MapPin, Navigation } from 'lucide-react';

export default async function TerrenosPage() {
    const canchas = await getCanchas();

    return (
        <div className="container mx-auto px-4 py-12 min-h-screen">
            <SectionTitle
                title="Terrenos de Juego"
                subtitle="Canchas y Sedes — AIFB Río Gallegos"
            />
            
            {canchas.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 border border-brand-neon/10 rounded-3xl bg-zinc-900/30">
                    <div className="w-16 h-16 mb-6 text-brand-neon animate-pulse">
                        <MapPin size={64} strokeWidth={1.5} />
                    </div>
                    <h2 className="text-xl font-black uppercase tracking-widest text-white mb-2 italic">Mapa de Canchas</h2>
                    <p className="text-brand-neon/60 text-sm max-w-md text-center">
                        No hay canchas registradas aún. Próximamente estaremos listando todas las ubicaciones.
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-12">
                    {canchas.map((cancha: any) => (
                        <div 
                            key={cancha.id} 
                            className="group flex flex-col bg-[#0d0d0d] border border-zinc-800 rounded-3xl overflow-hidden hover:border-brand-neon/30 hover:shadow-[0_0_30px_rgba(57,255,20,0.1)] transition-all duration-300"
                        >
                            {/* Imagen Header */}
                            <div className="relative w-full aspect-video bg-zinc-900 border-b border-zinc-800 overflow-hidden">
                                {cancha.imageUrl ? (
                                    <Image
                                        src={cancha.imageUrl}
                                        alt={`Foto de ${cancha.name}`}
                                        fill
                                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                                    />
                                ) : (
                                    <div className="absolute inset-0 flex items-center justify-center text-zinc-800 group-hover:text-brand-neon/20 transition-colors duration-500">
                                        <MapPin size={48} strokeWidth={1} />
                                    </div>
                                )}
                                {/* Overlay Gradient */}
                                <div className="absolute inset-0 bg-gradient-to-t from-[#0d0d0d] via-transparent to-transparent opacity-80" />
                            </div>

                            {/* Contenido */}
                            <div className="p-6 flex flex-col flex-grow">
                                <h3 className="text-2xl font-black text-white italic tracking-wide uppercase mb-2 group-hover:text-brand-neon transition-colors">
                                    {cancha.name}
                                </h3>
                                
                                {cancha.address && (
                                    <div className="flex items-start gap-2 text-zinc-400 mb-4">
                                        <MapPin size={16} className="text-brand-neon shrink-0 mt-0.5" />
                                        <span className="text-sm">{cancha.address}</span>
                                    </div>
                                )}

                                {cancha.description && (
                                    <p className="text-zinc-500 text-sm mb-6 flex-grow line-clamp-3">
                                        {cancha.description}
                                    </p>
                                )}

                                {/* Spacer para empujar el botón abajo si falta descripción */}
                                {!cancha.description && <div className="flex-grow"></div>}

                                {cancha.mapsUrl && (
                                    <div className="mt-4 pt-4 border-t border-zinc-800">
                                        <a 
                                            href={cancha.mapsUrl} 
                                            target="_blank" 
                                            rel="noopener noreferrer"
                                            className="w-full flex items-center justify-center gap-2 bg-brand-neon/10 hover:bg-brand-neon text-brand-neon hover:text-black font-bold uppercase tracking-widest text-xs py-3 rounded-xl transition-all duration-300"
                                        >
                                            <Navigation size={14} />
                                            Cómo llegar
                                        </a>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
