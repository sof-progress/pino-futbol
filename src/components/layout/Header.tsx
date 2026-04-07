'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

export function Header() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isCategoriesExpanded, setIsCategoriesExpanded] = useState(false);

    const menuOptions = [
        { label: 'Noticias', href: '/noticias' },
        { label: 'Fixture', href: '/fixture' },
        {
            label: 'Categorías',
            href: '#',
            isExpandable: true,
            subOptions: [
                { label: 'Primera', href: '/categorias/primera' },
                { label: 'Veteranos', href: '/categorias/veteranos' },
                { label: 'Juveniles', href: '/categorias/juveniles' },
            ]
        },
        { label: 'Terrenos de juego', href: '/terrenos' },
        { label: 'Contacto', href: '/contacto' },
    ];

    const closeAll = () => {
        setIsMenuOpen(false);
        setIsCategoriesExpanded(false);
    };

    return (
        <>
            <header className="sticky top-0 z-50 w-full border-b border-brand-primary bg-black text-brand-primary shadow-sm shadow-brand-primary/20">
                <div className="container mx-auto flex h-20 items-center justify-between px-4 relative">
                    {/* Logo (Izquierda) */}
                    <Link href="/" className="flex items-center z-50" onClick={closeAll}>
                        <div className="relative w-16 h-16 flex items-center justify-center">
                            <Image
                                src="/logo/logo.png"
                                alt="Pino Futbol Logo"
                                fill
                                sizes="64px"
                                className="object-contain"
                            />
                        </div>
                    </Link>

                    {/* Texto Centrado (Absoluto) */}
                    <div className="absolute left-1/2 -translate-x-1/2 pointer-events-none z-10">
                        <span className="font-display font-bold text-2xl tracking-tighter sm:tracking-normal">Pino Fútbol</span>
                    </div>

                    {/* Navegación Desktop (Derecha) */}
                    <nav className="hidden lg:flex items-center gap-6 text-[10px] font-black uppercase tracking-widest z-10">
                        {menuOptions.map((opt) => (
                            <div key={opt.label} className="relative group">
                                {opt.isExpandable ? (
                                    <button className="hover:text-white transition-colors border-b-2 border-transparent hover:border-brand-primary py-1 flex items-center gap-1">
                                        {opt.label}
                                        <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="mt-0.5"><path d="m6 9 6 6 6-6" /></svg>
                                    </button>
                                ) : (
                                    <Link
                                        href={opt.href}
                                        className="hover:text-white transition-colors border-b-2 border-transparent hover:border-brand-primary py-1"
                                    >
                                        {opt.label}
                                    </Link>
                                )}

                                {opt.isExpandable && (
                                    <div className="absolute top-full left-0 mt-2 w-40 bg-black border border-brand-primary rounded-md opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 shadow-[0_10px_30px_rgba(57,255,20,0.1)]">
                                        <div className="flex flex-col py-2">
                                            {opt.subOptions?.map((sub) => (
                                                <Link
                                                    key={sub.href}
                                                    href={sub.href}
                                                    className="px-4 py-2 hover:bg-brand-primary/10 hover:text-white transition-colors text-xs font-bold"
                                                >
                                                    {sub.label}
                                                </Link>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}
                    </nav>

                    {/* Mobile Menu Button (Derecha) */}
                    <div className="lg:hidden z-50">
                        <button
                            className="p-2 text-brand-primary transition-transform active:scale-95"
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            aria-label="Toggle Menu"
                        >
                            {isMenuOpen ? (
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                    <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                                </svg>
                            ) : (
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                    <line x1="4" x2="20" y1="12" y2="12" /><line x1="4" x2="20" y1="6" y2="6" /><line x1="4" x2="20" y1="18" y2="18" />
                                </svg>
                            )}
                        </button>
                    </div>
                </div>

                {/* Mobile Menu Overlay */}
                <div
                    className={`fixed inset-0 top-20 z-40 bg-black/98 backdrop-blur-md transition-all duration-300 lg:hidden ${isMenuOpen ? 'opacity-100 visible' : 'opacity-0 invisible pointer-events-none'
                        }`}
                >
                    <nav className="flex flex-col items-center pt-12 gap-6 p-4 h-full overflow-y-auto">
                        {menuOptions.map((opt, index) => (
                            <div key={opt.label} className="w-full flex flex-col items-center">
                                {opt.isExpandable ? (
                                    <div className="flex flex-col items-center w-full">
                                        <button
                                            className={`w-full text-center text-2xl font-black uppercase tracking-[0.2em] transition-all duration-500 flex items-center justify-center gap-2 ${isMenuOpen ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
                                                }`}
                                            style={{ transitionDelay: `${index * 100}ms` }}
                                            onClick={() => setIsCategoriesExpanded(!isCategoriesExpanded)}
                                        >
                                            {opt.label}
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"
                                                className={`transition-transform duration-300 ${isCategoriesExpanded ? 'rotate-180 text-white' : ''}`}
                                            >
                                                <path d="m6 9 6 6 6-6" />
                                            </svg>
                                        </button>

                                        <div className={`flex flex-col items-center gap-4 mt-4 overflow-hidden transition-all duration-300 ${isCategoriesExpanded ? 'max-h-60 opacity-100 mb-4' : 'max-h-0 opacity-0'}`}>
                                            {opt.subOptions?.map((sub) => (
                                                <Link
                                                    key={sub.href}
                                                    href={sub.href}
                                                    className="w-full text-center text-lg font-bold text-brand-primary/70 hover:text-white uppercase tracking-widest"
                                                    onClick={closeAll}
                                                >
                                                    {sub.label}
                                                </Link>
                                            ))}
                                        </div>
                                    </div>
                                ) : (
                                    <Link
                                        href={opt.href}
                                        className={`w-full text-center text-2xl font-black uppercase tracking-[0.2em] transition-all duration-500 hover:text-white ${isMenuOpen ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
                                            }`}
                                        style={{ transitionDelay: `${index * 100}ms` }}
                                        onClick={closeAll}
                                    >
                                        {opt.label}
                                    </Link>
                                )}
                            </div>
                        ))}
                        <div className="w-12 h-1 bg-brand-primary rounded-full my-8 animate-pulse shadow-[0_0_10px_var(--brand-primary)]"></div>
                    </nav>
                </div>
            </header>
        </>
    );
}
