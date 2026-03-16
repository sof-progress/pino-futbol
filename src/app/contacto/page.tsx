import React from 'react';
import { SectionTitle } from '@/components/ui/SectionTitle';

export default function ContactoPage() {
    return (
        <div className="container mx-auto px-4 py-12 min-h-screen">
            <SectionTitle
                title="Contacto"
                subtitle="Comunicate con la AIFB de Río Gallegos"
            />
            <div className="grid md:grid-cols-2 gap-12 max-w-4xl mx-auto py-12">
                <div className="border border-brand-neon/10 rounded-3xl bg-zinc-900/30 p-8">
                    <h3 className="text-lg font-black uppercase tracking-widest text-brand-neon mb-6 italic">Información</h3>
                    <div className="space-y-6">
                        <div className="flex items-start gap-4">
                            <div className="w-10 h-10 rounded-full bg-brand-neon/10 flex items-center justify-center text-brand-neon flex-shrink-0">
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" /></svg>
                            </div>
                            <div>
                                <p className="text-white font-bold text-sm">Teléfono</p>
                                <p className="text-brand-neon/50 text-xs mt-1">+54 (2966) 123-456</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-4">
                            <div className="w-10 h-10 rounded-full bg-brand-neon/10 flex items-center justify-center text-brand-neon flex-shrink-0">
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" /><path d="M2 12h20" /></svg>
                            </div>
                            <div>
                                <p className="text-white font-bold text-sm">Web</p>
                                <p className="text-brand-neon/50 text-xs mt-1">www.pinofutbol.com.ar</p>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="border border-brand-neon/10 rounded-3xl bg-zinc-900/30 p-8">
                    <h3 className="text-lg font-black uppercase tracking-widest text-brand-neon mb-6 italic">Ubicación</h3>
                    <p className="text-brand-neon/50 text-sm leading-relaxed">
                        Nuestra sede se encuentra en el Corazón de Río Gallegos. Visitanos para inscripciones y consultas administrativas.
                    </p>
                    <div className="w-full h-40 mt-6 rounded-2xl bg-black border border-brand-neon/20 flex items-center justify-center relative overflow-hidden group">
                        <div className="absolute inset-0 bg-brand-neon/5 transition-colors group-hover:bg-brand-neon/10"></div>
                        <span className="text-[10px] font-black uppercase tracking-[0.3em] text-brand-neon animate-pulse">Cargando Mapa...</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
