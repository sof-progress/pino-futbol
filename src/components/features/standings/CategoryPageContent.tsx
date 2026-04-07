'use client';

import React, { useState, useEffect } from 'react';
import { CategoryTabs } from '@/components/ui/CategoryTabs';
import { StandingsTable } from './StandingsTable';
import { getStandingsByCategory } from '@/lib/actions/standings';
import { SectionTitle } from '@/components/ui/SectionTitle';
import Image from 'next/image';

interface Tab {
    id: string;
    label: string;
}

interface CategoryPageContentProps {
    title: string;
    subtitle: string;
    tabs: Tab[];
    isDevelopment?: boolean;
}

export function CategoryPageContent({ title, subtitle, tabs, isDevelopment = false }: CategoryPageContentProps) {
    const [activeTab, setActiveTab] = useState(tabs[0].id);
    const [standings, setStandings] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (isDevelopment) {
            setIsLoading(false);
            return;
        }

        const fetchData = async () => {
            setIsLoading(true);
            const activeTabLabel = tabs.find(t => t.id === activeTab)?.label || '';

            // Map labels to full category names in DB
            let categoryName = activeTabLabel;
            if (title === 'Primera') {
                categoryName = `Primera División ${activeTabLabel}`;
            }

            const data = await getStandingsByCategory(categoryName);
            setStandings(data);
            setIsLoading(false);
        };

        fetchData();
    }, [activeTab, tabs, title]);

    return (
        <div className="container mx-auto px-4 py-12 min-h-screen">
            <SectionTitle
                title={title}
                subtitle={`${subtitle} — Edición 2026`}
            />

            <CategoryTabs
                tabs={tabs}
                activeTab={activeTab}
                onChange={setActiveTab}
            />

            {isDevelopment ? (
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
            ) : (
                <div className={`transition-all duration-500 ${isLoading ? 'opacity-30 blur-sm pointer-events-none' : 'opacity-100 blur-0'}`}>
                    <StandingsTable standings={standings} />
                </div>
            )}

            {isLoading && !isDevelopment && (
                <div className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none">
                    <div className="w-12 h-12 border-4 border-brand-primary border-t-transparent rounded-full animate-spin shadow-[0_0_15px_var(--brand-primary)]"></div>
                </div>
            )}
        </div>
    );
}
