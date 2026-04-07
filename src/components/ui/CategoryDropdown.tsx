'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

interface CategoryDropdownProps {
    categories: string[];
    activeCategory: string;
    baseUrl: string;
}

export function CategoryDropdown({ categories, activeCategory, baseUrl }: CategoryDropdownProps) {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const searchParams = useSearchParams();

    // Cerrar al hacer click afuera
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Cerrar al cambiar la ruta/search params
    useEffect(() => {
        setIsOpen(false);
    }, [searchParams]);

    return (
        <div className="relative w-full sm:w-auto" ref={dropdownRef}>
            {/* Botón selector */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`w-full sm:w-auto flex items-center justify-between gap-4 px-6 py-3 sm:py-2.5 bg-black border rounded-xl sm:rounded-full transition-all duration-300 ${isOpen
                        ? 'border-brand-primary shadow-[0_0_15px_rgba(57,255,20,0.2)]'
                        : 'border-brand-primary/40 hover:border-brand-primary/80 hover:bg-surface/50'
                    }`}
                aria-haspopup="listbox"
                aria-expanded={isOpen}
            >
                <div className="flex flex-col sm:flex-row sm:items-center sm:gap-2 text-left">
                    <span className="text-[10px] text-brand-secondary font-bold uppercase tracking-widest sm:hidden">
                        Categoría
                    </span>
                    <span className="text-sm sm:text-xs font-black text-brand-primary uppercase tracking-widest line-clamp-1">
                        {activeCategory}
                    </span>
                </div>

                {/* Chevron icon animado */}
                <div className={`text-brand-primary/70 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="m6 9 6 6 6-6" />
                    </svg>
                </div>
            </button>

            {/* Menú desplegable */}
            <div
                className={`absolute z-50 top-full left-0 right-0 sm:left-auto sm:right-0 mt-2 w-full sm:w-64 bg-black border border-brand-primary/30 rounded-xl shadow-2xl overflow-hidden transition-all duration-300 origin-top ${isOpen
                        ? 'opacity-100 scale-100 translate-y-0 visible'
                        : 'opacity-0 scale-95 -translate-y-2 invisible'
                    }`}
                role="listbox"
            >
                <div className="max-h-[60vh] overflow-y-auto no-scrollbar py-2">
                    {categories.map((category) => {
                        const isActive = category === activeCategory;
                        return (
                            <Link
                                key={category}
                                href={`${baseUrl}?category=${encodeURIComponent(category)}`}
                                className={`block w-full text-left px-5 py-3 text-xs sm:text-[11px] font-black uppercase tracking-widest transition-colors ${isActive
                                        ? 'bg-brand-primary text-black'
                                        : 'text-brand-secondary hover:bg-zinc-900 hover:text-brand-primary'
                                    }`}
                                role="option"
                                aria-selected={isActive}
                            >
                                {category}
                            </Link>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
