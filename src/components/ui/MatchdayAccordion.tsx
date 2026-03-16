'use client';

import { useState } from 'react';
import { MatchWithTeams } from '@/types';
import { MatchCard } from '@/components/features/matches/MatchCard';

interface MatchdayAccordionProps {
    matchday: number;
    matches: MatchWithTeams[];
    defaultOpen?: boolean;
}

export function MatchdayAccordion({ matchday, matches, defaultOpen = false }: MatchdayAccordionProps) {
    const [isOpen, setIsOpen] = useState(defaultOpen);

    // Determinar el título
    const title = matchday === 9999 ? 'Sin fecha asignada' : `Fecha ${matchday}`;

    // Determinar los estados de los partidos en esta fecha
    const matchCount = matches.length;
    const hasLive = matches.some(m => m.status === 'LIVE');
    const hasFinished = matches.some(m => m.status === 'FINISHED');
    const allScheduled = matches.every(m => m.status === 'SCHEDULED');

    return (
        <section className="bg-zinc-900/40 border border-brand-neon/20 rounded-2xl overflow-hidden transition-colors hover:border-brand-neon/60">
            {/* Header del acordeón */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex items-center justify-between p-4 sm:p-5 text-left bg-black/40 hover:bg-black/60 transition-colors group"
                aria-expanded={isOpen}
            >
                <div className="flex items-center gap-4">
                    <h2 className="text-sm sm:text-base font-black uppercase tracking-widest text-brand-neon">
                        {title}
                    </h2>

                    {/* Indicadores */}
                    <div className="hidden sm:flex items-center gap-2 text-[10px] font-bold tracking-widest uppercase">
                        <span className="text-zinc-500 bg-zinc-900 px-2 py-1 rounded">
                            {matchCount} {matchCount === 1 ? 'partido' : 'partidos'}
                        </span>
                        {hasLive && (
                            <span className="text-red-400 bg-red-400/10 px-2 py-1 rounded border border-red-400/20 animate-pulse">
                                En Vivo
                            </span>
                        )}
                        {!hasLive && hasFinished && (
                            <span className="text-brand-neon/70 bg-brand-neon/5 px-2 py-1 rounded border border-brand-neon/20">
                                Resultados
                            </span>
                        )}
                        {allScheduled && (
                            <span className="text-zinc-400 bg-zinc-800/50 px-2 py-1 rounded">
                                Programados
                            </span>
                        )}
                    </div>
                </div>

                {/* Chevron */}
                <div className={`flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full bg-zinc-900 border border-brand-neon/30 text-brand-neon transition-transform duration-300 group-hover:bg-brand-neon/10 ${isOpen ? 'rotate-180' : ''}`}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                        <path d="m6 9 6 6 6-6" />
                    </svg>
                </div>
            </button>

            {/* Contenido colapsable */}
            <div
                className={`grid transition-all duration-300 ease-in-out ${isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
                    }`}
            >
                <div className="overflow-hidden">
                    <div className="p-4 sm:p-5 border-t border-brand-neon/10">
                        {/* Indicadores mobile */}
                        <div className="sm:hidden flex flex-wrap gap-2 mb-4 text-[10px] font-bold tracking-widest uppercase">
                            <span className="text-zinc-500 bg-zinc-900 px-2 py-1 rounded">
                                {matchCount} {matchCount === 1 ? 'partido' : 'partidos'}
                            </span>
                            {hasLive && (
                                <span className="text-red-400 bg-red-400/10 px-2 py-1 rounded animate-pulse">En Vivo</span>
                            )}
                        </div>

                        {/* Grid de partidos */}
                        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 xl:grid-cols-3">
                            {matches.map((match) => (
                                <MatchCard
                                    key={match.id}
                                    homeTeam={match.homeTeam.name}
                                    awayTeam={match.awayTeam.name}
                                    homeScore={match.homeScore ?? 0}
                                    awayScore={match.awayScore ?? 0}
                                    date={match.date}
                                    status={match.status}
                                    field={match.venue?.name || match.field || undefined}
                                    homeTeamLogo={match.homeTeam.logoUrl}
                                    awayTeamLogo={match.awayTeam.logoUrl}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
