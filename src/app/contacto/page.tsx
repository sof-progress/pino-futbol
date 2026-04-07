import React from 'react';
import { SectionTitle } from '@/components/ui/SectionTitle';
import Image from 'next/image';

export default function ContactoPage() {
    return (
        <div className="container mx-auto px-4 py-12 min-h-screen">
            <SectionTitle
                title="Contacto"
                subtitle="Comunicate con la AIFB de Río Gallegos"
            />
            
            <div className="max-w-4xl mx-auto py-12">
                <div className="flex flex-col items-center justify-center py-20 border border-brand-primary/10 rounded-3xl bg-black/40 backdrop-blur-sm relative overflow-hidden group">
                    {/* Efecto de brillo de fondo */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-brand-primary/5 rounded-full blur-[80px] pointer-events-none"></div>

                    <div className="relative w-64 h-64 mb-6 transform transition-transform group-hover:scale-110 duration-500 drop-shadow-[0_0_30px_rgba(57,255,20,0.3)]">
                        <Image
                            src="/logo/desarrollo.png"
                            alt="Página en desarrollo"
                            fill
                            className="object-contain [mask-image:linear-gradient(to_bottom,black_90%,transparent_100%)]"
                            priority
                        />
                    </div>

                    <h2 className="text-2xl font-black uppercase tracking-[0.4em] text-brand-primary italic animate-glow drop-shadow-[0_0_8px_rgba(57,255,20,0.3)] text-center">
                        Página en desarrollo...
                    </h2>

                    <div className="mt-10 w-32 h-1.5 bg-brand-primary/10 rounded-full relative overflow-hidden">
                        <div className="absolute inset-0 bg-brand-primary w-1/3 animate-shimmer"></div>
                    </div>
                </div>
            </div>
        </div>
    );
}
