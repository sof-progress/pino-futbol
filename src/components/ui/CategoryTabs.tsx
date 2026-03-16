'use client';

import React from 'react';
import Link from 'next/link';

interface Tab {
    id: string;
    label: string;
}

interface CategoryTabsProps {
    tabs?: Tab[];             // Opcional si se usa categories (strings)
    categories?: string[];    // Para compatibilidad con versiones anteriores
    activeTab: string;
    onChange?: (tabId: string) => void;
    baseUrl?: string;          // Si se provee, los tabs serán Links en lugar de botones
}

export function CategoryTabs({ tabs, categories, activeTab, onChange, baseUrl }: CategoryTabsProps) {
    // Normalizamos los items para que siempre sean un array de {id, label}
    const items = tabs || (categories?.map(c => ({ id: c, label: c })) || []);

    return (
        <div className="flex flex-wrap gap-2 mb-8 border-b border-brand-neon/10 pb-4 overflow-x-auto no-scrollbar">
            {items.map((item) => {
                const isActive = activeTab === item.id;
                const commonStyles = `px-6 py-2 rounded-full text-[10px] sm:text-xs font-black uppercase tracking-widest transition-all duration-300 border whitespace-nowrap ${isActive
                        ? 'bg-brand-neon text-black border-brand-neon shadow-[0_0_15px_rgba(57,255,20,0.4)] scale-105'
                        : 'bg-transparent text-brand-neon/60 border-brand-neon/20 hover:border-brand-neon/50 hover:text-brand-neon'
                    }`;

                if (baseUrl) {
                    return (
                        <Link
                            key={item.id}
                            href={`${baseUrl}?category=${encodeURIComponent(item.id)}`}
                            className={commonStyles}
                        >
                            {item.label}
                        </Link>
                    );
                }

                return (
                    <button
                        key={item.id}
                        onClick={() => onChange?.(item.id)}
                        className={commonStyles}
                    >
                        {item.label}
                    </button>
                );
            })}
        </div>
    );
}
